function newInstanceof(a, type){
    let typePrototype = type.prototype;
    a = a.__proto__;
    while(1){
        if(a === typePrototype){
            return true;
        }
        if(a === null){
            return false;
        }
        a = a.__proto__;
    }
}

console.log(newInstanceof([1, 2], Array));
console.log(newInstanceof([1, 2], Object));
console.log(newInstanceof([1, 2], Number));