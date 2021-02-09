(function () {
    var ContinueSentinel = {};

    var mark = function (genFun) {
        var generator = Object.create({
            next: function (arg) {
                // 关键的地方
                // 2. this 指向调用对象，即 wrap 中的 generator
                return this._invoke("next", arg);
            }
        });
        genFun.prototype = generator;
        return genFun;
    };

    function wrap(innerFn, outerFn, self) {
        var generator = Object.create(outerFn.prototype);

        var context = {
            done: false,
            method: "next",
            next: 0,
            prev: 0,
            // 6. 'ending' 作为 arg 传入
            abrupt: function (type, arg) {
                var record = {};
                record.type = type;
                record.arg = arg;

                return this.complete(record);
            }, 
            complete: function (record, afterLoc) {
                if (record.type === "return") {
                    this.rval = this.arg = record.arg;
                    this.method = "return";
                    this.next = "end";
                }

                return ContinueSentinel;
            },
            stop: function () {
                this.done = true;
                // 7. 第三次的 next 最终返回值在此处，返回给 70 行 record arg
                return this.rval;
            }
        };

        generator._invoke = makeInvokeMethod(innerFn, context);

        return generator;
    }

    function makeInvokeMethod(innerFn, context) {
        var state = "start";
        // 3. invoke 被调用，method = next，arg = undefined
        return function invoke(method, arg) {
            if (state === "completed") {
                return { value: undefined, done: true };
            }

            context.method = method;
            context.arg = arg;

            while (true) {
                state = "executing";

                var record = {
                    type: "normal",
                    // 4. helloWorldGenerator$ 函数被调用
                    // 返回 arg : hello
                    arg: innerFn.call(self, context)
                };

                if (record.type === "normal") {
                    state = context.done ? "completed" : "yield";

                    if (record.arg === ContinueSentinel) {
                        // 因为这个 continue 第三次的 next 经过各种函数调用返回 {value: 'ending', done: true}
                        continue;
                    }
                    // 5. hw.next 得到结果 {value: 'hello', done: false}
                    // 
                    return {
                        value: record.arg,
                        done: context.done
                    };
                }
            }
        };
    }

    window.regeneratorRuntime = {};

    regeneratorRuntime.wrap = wrap;
    regeneratorRuntime.mark = mark;
})();

var _marked = regeneratorRuntime.mark(helloWorldGenerator);

function helloWorldGenerator() {
    // 1. wrap 之后返回一个 generator 具有原型上继承有 next 方法
    return regeneratorRuntime.wrap(
        function helloWorldGenerator$(_context) {
            while (1) {
                switch ((_context.prev = _context.next)) {
                    case 0:
                        _context.next = 2;
                        return "hello";

                    case 2:
                        _context.next = 4;
                        return "world";

                    case 4:
                        return _context.abrupt("return", "ending");

                    case 5:
                    case "end":
                        // 8. 最后一次直接执行 stop 没有参数传入，value 为 undifiend
                        return _context.stop();
                }
            }
        },
        _marked,
        this
    );
}
// function* helloWorldGenerator() {
//     yield 'hello';
//     yield 'world';
//     return 'ending';
// }
var hw = helloWorldGenerator();

console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());