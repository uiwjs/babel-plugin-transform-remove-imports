var a = 1;
var b = 2; // Variable declarations (SHOULD be removed)

var core; // Using non-require function

var something = useCore('@babel/core'); // Using as argument to a function (SHOULD be removed)

useCore(); // A clear side-effect expression (SHOULD be removed)

// Non-matching module ID
require('jest');

console.log(a + b); // 3

function useCore(arg0) {// do something with it
}