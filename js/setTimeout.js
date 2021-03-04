setTimeout(() => {
    new Promise((resolve, reject)=>{
        console.log(5);
        resolve(6);
    });
    Promise.resolve(1).then((res) => console.log(res));
    console.log(4)
}, 0)

setTimeout(() => {
    console.log(2)
}, 0)

console.log(3)

// 3 4 2 1; 我
// 3 4 1 2; 答案
// 3 5 4 1 2 