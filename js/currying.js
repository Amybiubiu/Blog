function curry(fn){
  // 对于第二个函数的调用过程
  // args = [1]
  return function carried(...args){
    if(args.length >= fn.length){
      return fn.apply(this, args);
    }else{
      // args2 = [2,3]
      return function (...args2){
        return carried.apply(this, args.concat(args2));
      }
    }
  }
}

function sum(a, b, c) {
    return a + b + c;
  }
  
let curriedSum = curry(sum);
  
console.log( curriedSum(1, 2, 3) ); // 6，仍然可以被正常调用
console.log( curriedSum(1)(2,3) ); // 6，对第一个参数的柯里化
console.log( curriedSum(1)(2)(3) ); // 6，全柯里化