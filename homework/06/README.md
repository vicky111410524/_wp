// ----------------- 1. Callback 基礎實作 -----------------
function mathTool(num1, num2, action) {
    return action(num1, num2);
}

console.log(mathTool(10, 5, function (a, b) {
    return a + b;
})); // 測試結果：15

console.log(mathTool(10, 5, function (a, b) {
    return a - b;
})); // 測試結果：5


// ----------------- 2. IIFE 立即執行函數 -----------------
(function () {
    let count = 100;
    console.log("Count is: " + count);
})(); // 測試結果：Count is: 100


// ----------------- 3. map + 箭頭函數 -----------------
const prices = [100, 200, 300, 400];
const discounted = prices.map(price => price * 0.8);

console.log(discounted); // 測試結果：[80, 160, 240, 320]


// ----------------- 4. 陣列破壞性修改 -----------------
function cleanData(arr) {
    arr.pop();
    arr.unshift("Start");
}

let myData = [1, 2, 3];
cleanData(myData);

console.log(myData); // 測試結果：["Start", 1, 2]


// ----------------- 5. Higher-Order Function -----------------
function multiplier(factor) {
    return n => n * factor;
}

const double = multiplier(2);

console.log(double(10)); // 測試結果：20


// ----------------- 6. 自製 filter -----------------
function myFilter(arr, callback) {
    let result = [];

    for (let item of arr) {
        if (callback(item)) {
            result.push(item);
        }
    }

    return result;
}

console.log(myFilter([1, 5, 8, 12], item => item > 7));
// 測試結果：[8, 12]


// ----------------- 7. 物件陣列 filter -----------------
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 }
];

console.log(users.filter(user => user.age >= 18));
// 測試結果：[{ name: "Alice", age: 25 }]


// ----------------- 8. 傳址 vs 重新指向 -----------------
let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
    a.push(99);
    b = [100];
}

process(listA, listB);

console.log(listA); // 測試結果：[1, 2, 99]
console.log(listB); // 測試結果：[3, 4]


// ----------------- 9. setTimeout 延遲執行 -----------------
setTimeout(() => {
    const arr = ["Task", "Completed"];
    console.log(arr.join(" "));
}, 2000); // 測試結果：Task Completed


// ----------------- 10. 計算總價 + callback -----------------
function calculateTotal(cart, discountFunc) {
    let total = 0;

    for (let price of cart) {
        total += price;
    }

    return discountFunc(total);
}

console.log(
    calculateTotal([100, 200, 300], function (total) {
        return total - 50;
    })
); // 測試結果：550
