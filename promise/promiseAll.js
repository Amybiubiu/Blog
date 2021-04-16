let res;
function a(){
    return 'a';
}
function b(){
    return 'b';
}
function c(){
    return 'c';
}
let a = new Promise((resolve, reject)=>{
    let res = a();
    resolve(res);
})