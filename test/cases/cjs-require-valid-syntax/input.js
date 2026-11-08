const styles = require("./button.css");
const { join } = require("./join.css");
const [first] = require("./list.css");
const removed = require("./multi.css"), kept = 1;
const bothA = require("./both-a.css"), bothB = require("./both-b.css");
let stylesLet = require("./let.css"), keptLet = 2;
var stylesVar = require("./var.css");
let onlyLet = require("./let-only.css");
var { join: joinVar } = require("./var-pattern.css");
let { join: joinLet } = require("./let-pattern.css"), keptPattern = 3;
export const exported = require("./export.css");
export const exportedRemoved = require("./export-multi.css"), exportedKept = 4;
export default require("./export-default.css");
module.exports = require("./assign.css");
value = require("./assign-expr.css");
const fallback = require("./logical.css") || other;
flag && require("./logical-and.css");
require("./logical-or.css") || fallback;
for (const item of require("./for-of.css")) {}
for (const item = require("./for-init.css"); false;) {}
foo(require("./arg.css"), require("./arg-b.css"));
require("./callee.css")();
new Foo(require("./new.css"));
[require("./array.css"), keptValue];
require("./side-effect.css");
const keptModule = require("path");
