Array.prototype.reduce2 = function (fn, init){
    var accumulator = init;
    for(var i = 0; i < this.length; i++){
        if(accumulator){
            accumulator = fn.call(undefined, accumulator, this[i], i, this);
        }else{
            accumulator = this[i];
        }
    }
    return accumulator;
}
//tests
var numbers3 = [20, 20, 2, 3];
var total = numbers3.reduce2(function(a, b) {
    return a + b;
}, 10);
console.log(total); // 55
// 方法2
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.reduce2((prev, value) => {
        return prev.concat(Array.isArray(value)? flatten(value) : value);
    }, [])
}
console.log(flatten(arr));//  [1, 2, 3, 4, 5]