const repeatFunc = repeat(console.log, 4, 3000);
// 每3秒打印一个 helloword，总共执行4次
repeatFunc('helloworld');
// function repeat(fn, count, timeout){
//     let times = count;
//     return function call(param){
//         if(times == 0) return;
//         times--;
//         fn(param);
//         setTimeout(() => call(param), timeout);
//     }
// }

function repeat(fn, count, timeout){
    return function(param){
        let p = Promise.resolve();
        for(let i = 0; i < count; i++){
            p = p.then(() => {
                return new Promise((resolve, reject) => {
                    fn(param);
                    setTimeout(resolve, timeout);
                })
            });
        }
    }
}