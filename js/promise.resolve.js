Promise.prototype.resolve = (param) => {
    if(param instanceof Promise) return param;
    return new Promise((resolve, reject) => {
        if(param?.then && typeof param.then === 'function')
            param.then(resolve, reject);
        else
            resolve(param);
    })
}

Promise.prototype.reject = (param) => {
    return new Promise((resolve, reject)=> {
        resolve(param);
    })
}

