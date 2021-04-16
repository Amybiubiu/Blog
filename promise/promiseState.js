class QueryablePromise extends Promise {
    constructor (executor) {
      super((resolve, reject) => executor(
        data => {
          resolve(data)
          this._status = 'Resolved'
        },
        err => {
          reject(err)
          this._status = 'Rejected'
        },
      ))
      this._status = 'Pending'
    }
  
    get status () {
      return this._status
    }
  }
   
  // Create a promise that resolves after 5 sec 
  var myQueryablePromise = new QueryablePromise((resolve, reject) => {
    setTimeout(() => resolve(), 5000)
  })
  
  // Log the status of the above promise every 500ms
  setInterval(() => {
    console.log(myQueryablePromise.status)
  }, 500)