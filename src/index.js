
export default function ({ types: t }) {
  return {
    name: 'transform-remove-imports',
    visitor: {

      // https://babeljs.io/docs/en/babel-types#callexpression
      CallExpression(path, state) {

        const { node } = path;

        if (node.callee.name !== 'require') {
          return;
        }

        const argument = node.arguments[0];
        const moduleId = argument.value;

        const options = state.opts;

        if (options.test && !testMatches(moduleId, options.test)) {
          return;
        }

        const parentType = path.parentPath.node.type;

        // In remove effects mode we should delete only requires that are
        // simple expression statements
        if (
          options.remove === 'effects' &&
          parentType !== 'ExpressionStatement'
        ) {
          return;
        }

        removeRequire(path, t);

      },

      // https://babeljs.io/docs/en/babel-types#importdeclaration
      ImportDeclaration(path, state) {

        const { node } = path;
        const { source } = node;
        const { opts } = state;

        if (opts.removeAll) {
          path.remove();
          return;
        }

        if (!opts.test) {
          console.warn('transform-remove-imports: "test" option should be specified');
          return;
        }

        /** @var {string} importName */
        const importName = (source && source.value ? source.value : undefined);
        const isMatch = testMatches(importName, opts.test);

        // https://github.com/uiwjs/babel-plugin-transform-remove-imports/issues/3
        if (opts.remove === 'effects') {
          if (node.specifiers && node.specifiers.length === 0 && importName && isMatch) {
            path.remove();
          }
          return;
        }

        if (importName && isMatch) {
          path.remove();
        }

      },
    }
  };
}


/**
 * Removes a matched `require()` without leaving a syntax error behind.
 * Bindings that cannot exist without an initializer are removed. A call in
 * any other expression position is replaced with `undefined`.
 *
 * @param {import('@babel/traverse').NodePath} path
 * @param {import('@babel/types')} t
 */
function removeRequire(path, t) {

  const parent = path.parentPath;

  if (parent.isExpressionStatement()) {
    parent.remove();
    return;
  }

  if (isRemovableListEntry(path)) {
    path.remove();
    return;
  }

  if (parent.isVariableDeclarator() && parent.node.init === path.node) {
    removeRequireBinding(parent);
    return;
  }

  path.replaceWith(t.identifier('undefined'));

}

/**
 * Argument lists and array elements can shrink and still parse.
 * `require("x")()` is the callee, not an argument, so it is not handled here.
 *
 * @param {import('@babel/traverse').NodePath} path
 * @returns {Boolean}
 */
function isRemovableListEntry(path) {

  const parent = path.parentPath;

  if (path.listKey === 'arguments') {
    return parent.isCallExpression() || parent.isNewExpression();
  }

  return path.listKey === 'elements' && parent.isArrayExpression();

}

/**
 * @param {import('@babel/traverse').NodePath} declaratorPath
 */
function removeRequireBinding(declaratorPath) {

  const declarationPath = declaratorPath.parentPath;
  const id = declaratorPath.node.id;
  const kind = declarationPath.isVariableDeclaration()
    ? declarationPath.node.kind
    : null;

  // `const`, `using`, and destructuring patterns are syntax errors without an
  // initializer. A `var` or `let` identifier can stay uninitialized.
  const needsInitializer = kind === 'const'
    || kind === 'using'
    || kind === 'await using'
    || id.type !== 'Identifier';

  if (!needsInitializer) {
    declaratorPath.get('init').remove();
    return;
  }

  declaratorPath.remove();

  // Babel itself drops a declaration that lost its only declarator, and an
  // `export` wrapped around that declaration. Cover the case where it did not.
  if (!declarationPath.node || declarationPath.node.declarations.length > 0) {
    return;
  }

  if (declarationPath.parentPath.isExportNamedDeclaration()) {
    declarationPath.parentPath.remove();
    return;
  }

  declarationPath.remove();

}

/**
 * Determines if the import matches the specified tests.
 *
 * @param {string} importName
 * @param {RegExp|RegExp[]|string|string[]} test
 * @returns {Boolean}
 */
function testMatches(importName, test) {

  // Normalizing tests
  const tests = Array.isArray(test) ? test : [test];

  // Finding out if at least one test matches
  return tests.some(regex => {
    if (typeof regex === 'string') {
      regex = new RegExp(regex);
    }
    return regex.test(importName || '');
  });

}
