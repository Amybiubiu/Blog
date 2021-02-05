'use strict'
// 第二版的代码
function objectFactory() {
    var object = new Object(),
    // Constructor 是本地变量
    Constructor = [].shift.call(arguments);

    object._proto_ = Constructor.prototype;
    var res = Constructor.apply(object, arguments);

    return typeof res === 'object'? res : object;
};

function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = new objectFactory(Otaku, 'Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18