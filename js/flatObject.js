
function testPropTypes(value, type, dev) {
    const nEnums = [
        '[object Number]',
        '[object String]',
        '[object Boolean]',
        '[object Undefined]',
        '[object Function]',
        '[object Null]',
        '[object Object]',
        '[object Array]',
        '[object Date]',
        '[object RegExp]',
        '[object Error]',
    ];
    const reg = new RegExp('\\[object (.*?)\\]');

    // 完全匹配模式，type应该传递类似格式[object Window] [object HTMLDocument] ...
    if (reg.test(type)) {
        // 排除nEnums的12种
        if (~nEnums.indexOf(type)) {
            if (dev === true) {
                console.warn(value, 'The parameter type belongs to one of 12 types：number string boolean undefined Null Object Array Date RegExp function Error NaN');
            }
        }

        if (Object.prototype.toString.call(value) === type) {
            return true;
        }

        return false;
    }
}
function getValue(obj, key, defaultValue) {
    // 结果变量
    const defaultResult = defaultValue === undefined ? undefined : defaultValue;

    if (testPropTypes(obj, 'Object') === false && testPropTypes(obj, 'Array') === false) {
        return defaultResult;
    }

    // 结果变量，暂时指向obj持有的引用，后续将可能被不断的修改
    let result = obj;

    // 得到知道值
    try {
        // 解析属性层次序列
        const keyArr = key.split('.');
        // console.log(keyArr[0])
        var res = []
        for (let i = 0; i < keyArr.length; i++) {
            let k0 = keyArr[i]
            // console.log(k0.split('['))
            k0 = k0.split('[')
            for (let i = 0; i < k0.length; i++) {
                if (k0[i] !== '') {
                    res.push(k0[i][0])
                }
            }
        }
        console.log(res)
        // 迭代obj对象属性
        for (let i = 0; i < res.length; i++) {
            // 如果第 i 层属性存在对应的值则迭代该属性值
            if (result[res[i]] !== undefined) {
                result = result[res[i]];

                // 如果不存在则返回未定义
            } else {
                return defaultResult;
            }
        }
    } catch (e) {
        return defaultResult;
    }

    // 返回获取的结果
    return result;
}

// 示例
var object = { a: [{ b: { c: 3 } }] }; // path: 'a[0].b.c'
var array = [{ a: { b: [1] } }]; // path: '[0].a.b[0]'r
// res = 'a'

// function getValue(target, valuePath, defaultValue) {}

console.log(getValue(object, "a[0].b.c", 0)); // 输出3
console.log(getValue(array, "[0].a.b[0]", 12)); // 输出 1
console.log(getValue(array, "[0].a.b[0].c", 12)); // 输出 12


function objectFlat(obj = '') {
    const res = {}
    function flat(item, preKey = '') {
        Object.entries(item).forEach(([key, value]) => {
            let newKey = key
            // console.log(value,typeof value,Array.isArray(value))
            if (Array.isArray(item)) {
                // console.log('是数组')
                newKey = preKey ? `${preKey}[${key}]` : key
            } else {
                newKey = preKey ? `${preKey}.${key}` : key
            }
            if (value && typeof value === 'object') {
                flat(value, newKey)
            } else {
                res[newKey] = value
            }
        })
    }
    flat(obj)
    return res
}

const source = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } }
console.log(objectFlat(source));
const obj = {
    a: 1,
    b: [1, 2, { c: true }],
    c: { e: 2, f: 3 },
    g: null,
};
console.log(objectFlat(obj));

