// 关于context是什么
// 是call后面的第一个参数
Function.prototype.call2 = function (context){
    var context = Object(context);
    // var context = context || window;
    context.fn = this;
    
    // var res = context.fn(...arguments);

    var args = [];
    for(var i = 1; i < arguments.length; i++)
        // 如果直接arguments[i]的话，object会出错，
        // 难道string一下就能处理各种数据类型吗？
        args.push('arguments[' + i + ']');
    // 这里 args 会自动调用 Array.toString() 这个方法。
    var res = eval('context.fn('+ args + ')');
    // var res = context.fn(args.join(','));    // {name: 'arguments[0], ..., arguments[1]}
    // var res = context.fn(...args);

   
    delete context.fn;
    return res;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

// bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }