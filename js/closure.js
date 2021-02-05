// function foo() {
//     var myName = "极客时间"
//     let test1 = 1
//     const test2 = 2
//     var innerBar = {
//         getName:function(){
//             console.log(test1)
//             return myName
//         },
//         setName:function(newName){
//             myName = newName
//         }
//     }
//     return innerBar
// }
// var bar = foo()
// bar.setName("极客邦")
// bar.getName()
// console.log(bar.getName())


var bar = {
    myName:"time.geekbang.com",
    printName: function () {
        console.log(myName)
    }    
}
function foo() {
    let myName = "极客时间"
    return bar.printName
}
let myName = "极客邦"
let _printName = foo()
_printName()
bar.printName()