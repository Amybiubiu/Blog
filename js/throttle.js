// 如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器。
const throttle = function(fn, delay = 100){
    let flag = true;
    return function(...args){
        if(!flag) return;
        flag = false;
        setTimeout(()=>{
            fn.apply(this, args);
            flag = true;
        }, delay);
    }
}