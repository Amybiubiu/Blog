async function p (){
    let res = await fn();
    console.log(res);
}
async function fn(){
    const p1 = await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            resolve(1);
        }, 0);
        resolve(2);
    })
    console.log(p1);
    return new Promise((resolve, reject)=>{
        console.log(3);
        resolve(4);
    })
}
p();
console.log('end');
// end 2 3 4???