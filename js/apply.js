Function.prototype.apply2 = function (context, arr){
    var context = Object(context);
    context.fn = this;
    var res;
    if(!arr){
        res = context.fn();
    }else{
        var args = [];
        for(var i = 0; i < arr.length; i++)
        // 如果直接arguments[i]的话，object会出错，
        // 难道string一下就能处理各种数据类型吗？
        args.push('arr[' + i + ']');
        // 这里 args 会自动调用 Array.toString() 这个方法。
        res = eval('context.fn('+ args + ')');
    }
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

console.log(bar.apply2(obj, ['kevin', 18]));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }