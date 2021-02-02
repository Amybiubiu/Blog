// 第二版
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.apply(this, arguments, 1);
    return function(){
        var bindArgs = Array.prototype.slice.apply(this, arguments);
        self.apply(this, context, args.concat(bindArgs));
    }
}

var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind2(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin