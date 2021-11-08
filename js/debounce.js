// 如果在定时器的时间范围内再次触发，则重新计时。
const debounce = function(fn, delay){
    let timer = null;
    return function (...args){
        if(timer)
            clearTimeout(timer);
            
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}