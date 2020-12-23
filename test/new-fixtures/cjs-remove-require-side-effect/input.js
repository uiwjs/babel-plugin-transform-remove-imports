
const a = 1;
const b = 2;

// Variable declarations
const core = require('@babel/core');

// Using as argument to a function
useCore(require('@babel/core'));

// A clear side-effect expression (SHOULD be removed)
require('@babel/core');

// Non-matching module ID
require('jest');

console.log(a + b); // 3


function useCore() {
  // do something with it
}
