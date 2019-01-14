
export default function ({ types: t }) {
  return {
    name: "transform-remove-imports",
    visitor: {
      // https://babeljs.io/docs/en/babel-types#importdeclaration
      ImportDeclaration(path, state) {
        if (!state.opts.test) return;
        if (!path.node.source || !path.node.source.value) return;
        if ((new RegExp(state.opts.test)).test(path.node.source.value)) {
          path.remove();
        }
      },
    }
  };
}