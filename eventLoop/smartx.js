setTimeout(() => {
    console.log(1)
  }, 0);
  
  const promise = new Promise((resolve, reject) => {
    console.log(2)
    // reject(3)
    resolve(3)
    console.log(4)
  })
  
  promise
  .then(() => console.log(5))
  .catch(() => console.log(6))
  .then(() => {
    console.log(7)
    return new Promise((resolve, reject)=>{
        reject(11);
    })
  })
  .catch(() => console.log(8))
  .then(() => console.log(9))
  
  console.log(10)