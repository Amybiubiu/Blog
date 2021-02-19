// https://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244#23785244
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

// a function that returns `then` if `value` is a promise, otherwise `null`
// 如果 new Promise(... resolve(new Promise()))
function getThen(value) {
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      var then = value.then;
      if (typeof then === 'function') {
        return then;
      }
    }
    return null;
}
// Note how resolve can receive a Promise as its argument,
// but a Promise can never be fulfilled with another Promise. So we have to handle this special case.
// Note also that a Promise can only ever be fulfilled/rejected once. 
// We also have the problem that a third party Promise may misbehave, 
// and we should guard our code against that. 
// For this reason, I haven't just called result.then(resolve, reject) from within resolve. 
// Instead, I split that into a separate function:
// 如何保障只决议一次？？233 看懂英文好不
/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return
        done = true
        onFulfilled(value)
      }, function (reason) {
        if (done) return
        done = true
        // 这里说明执行 resolve 函数出错时，错误也能被捕获
        onRejected(reason)
      })
    } catch (ex) {
      if (done) return
      done = true
      onRejected(ex)
    }
}

function myPromise(fn) {
  if (typeof this !== 'object')
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function')
    throw new TypeError('fn must be a function');

  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        // 为什么要又调用一层？？API的使用特性？？
        // 使 resolve(new Promise()) 的promise 从 pending 状态转换，能够正常使用
        doResolve(then.bind(result), resolve, reject)
        return
      }
      state = FULFILLED;
      value = result;
      // 关于为什么要 forEach 因为一个 promise 实例 .then 方法可以被多次调用
      handlers.forEach(handle);
      handlers = null;
    } catch (e) {
      reject(e);
    }
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
    } else {
      if (state === FULFILLED && typeof handler.onFulfilled === 'function') {
        // value 是在这里被 then 方法捕获调用的
        handler.onFulfilled(value);
      }
      if (state === REJECTED && typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }
  this.done = function (onFulfilled, onRejected) {
    // 计时器队列，仍属于宏任务队列，但是它会在执行宏队列的时候优先检查有没有到期的计时器任务
    // 模拟微任务，但不是真正插入微任务队列
    setTimeout(function () { // ensure we are always asynchronous
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }, 0);
  }

  this.then = function (onFulfilled, onRejected) {
    var self = this;
    return new myPromise(function (resolve, reject) {
      return self.done(function (result) {
        if (typeof onFulfilled === 'function') {
          try {
            return resolve(onFulfilled(result));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return resolve(result);
        }
      }, function (error) {
        if (typeof onRejected === 'function') {
          try {
            return resolve(onRejected(error));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return reject(error);
        }
      });
    });
  }

  doResolve(fn, resolve, reject);
}

var promise = new myPromise((resolve, reject)=>{
  resolve("resolve");
})

promise.then(
  val => console.log('first:' + val)
)

promise.then(
  val => console.log('second:' + val)
)