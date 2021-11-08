// function instanceOf(a, b){
//     let c = a.__proto__;
//     while(c !== null){
//         if(c == b.prototype){
//             return true;
//         }else{
//             c = c.__proto__;
//         }
//     }
//     return false;
// }

// console.log(instanceOf('1', String));

// const obj = {
//     a: 1,
//     b: [1, 2, { c: true }],
//     c: { e: 2, f: 3 },
//     g: null,
// };
// console.log(objectFlat(obj));

// function objectFlat(obj){
//     let res = {};
//     function flat(obj, preKey){
//         Object.entries(obj).forEach(([key, val], i) => {
//             let newKey = '';
//             if(Array.isArray(obj)){
//                 newKey = preKey ? `${preKey}[${key}]`: key;
//             }else{
//                 newKey = preKey ? `${preKey}.${key}` : key;
//             }

//             if(val && typeof val == 'object'){
//                 flat(val, newKey);
//             }else{
//                 res[newKey] = val;
//             }
//         })
//     }
//     flat(obj);
//     return res;
// }

function fn(){
    console.log(1);
}
function test(fn){
    [fn];
    console.log(2);
}
test();
test();