'use strict'
// 第二版的代码
function objectFactory() {
    // 内部创建一个新对象
    var object = new Object();
    // 拿到原型对象
    var Constructor = [].shift.call(arguments);
    // 将新对象的原型指向原型对象
    object._proto_ = Constructor.prototype;
    // this 绑定到这个新对象上执行
    var res = Constructor.apply(object, arguments);

    return typeof res === 'object'? object : res;
};

function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = objectFactory(Otaku, 'Kevin', '18');

console.log(person);
console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18