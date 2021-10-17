Promise.resolve('foo').then().then(console.log)

Promise.resolve('bar').then(console.log)

console.log('baz')