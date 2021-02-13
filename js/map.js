Array.prototype.myMap = function(fn){
    var arr = [];
    for(var i = 0; i < this.length; i++){
        arr.push(fn.call(null, this[i], i, this));
    }
    return arr;
}

//tests
var arrs = ['dic tanin', 'boo radley', 'hans gruber'];
var numbers2 = [1, 4, 9];

var goodT = arrs.myMap(function(n) {
    return n;
});

var squareRoot = numbers2.myMap(function(num) {
    return Math.sqrt(num);
});

console.log(goodT); // [ 'dic tanin', 'boo radley', 'hans gruber' ]
console.log(squareRoot); // [ 1, 2, 3 ]