了解了！你希望十題的程式碼和測試結果一次排好，並且用 **README.md 的格式**，讓它看起來有結構、有格式。這裡我幫你整理成一個完整的 Markdown 文件，直接複製到 VS Code 存成 `README.md` 就能看到漂亮的排版：

```markdown
# 📘 JavaScript Homework - Callback & Array Practice

這份作業包含 10 個 JavaScript 基礎練習，涵蓋 **Callback、IIFE、Array 操作、Higher-Order Function** 等概念。

---

## 📑 目錄
1. [Callback 基礎實作](#-習題-1callback-基礎實作)
2. [IIFE 立即執行函數](#-習題-2iife-立即執行函數)
3. [map + 箭頭函數](#-習題-3map--箭頭函數)
4. [陣列破壞性修改](#-習題-4陣列破壞性修改)
5. [Higher-Order Function](#-習題-5higher-order-function)
6. [自製 filter](#-習題-6自製-filter)
7. [物件陣列 filter](#-習題-7物件陣列-filter)
8. [傳址 vs 重新指向](#-習題-8傳址-vs-重新指向)
9. [setTimeout 延遲執行](#-習題-9settimeout-延遲執行)
10. [計算總價 + callback](#-習題-10計算總價--callback)

---

## 📌 習題 1：Callback 基礎實作
```javascript
function mathTool(num1, num2, action) {
    return action(num1, num2);
}

console.log(mathTool(10, 5, function (a, b) {
    return a + b;
})); // 15

console.log(mathTool(10, 5, function (a, b) {
    return a - b;
})); // 5
```

**測試結果**
```
15
5
```

---

## 📌 習題 2：IIFE 立即執行函數
```javascript
(function () {
    let count = 100;
    console.log("Count is: " + count);
})(); // Count is: 100
```

---

## 📌 習題 3：map + 箭頭函數
```javascript
const prices = [100, 200, 300, 400];
const discounted = prices.map(price => price * 0.8);

console.log(discounted); // [80, 160, 240, 320]
```

---

## 📌 習題 4：陣列破壞性修改
```javascript
function cleanData(arr) {
    arr.pop();
    arr.unshift("Start");
}

let myData = [1, 2, 3];
cleanData(myData);

console.log(myData); // ["Start", 1, 2]
```

---

## 📌 習題 5：Higher-Order Function
```javascript
function multiplier(factor) {
    return n => n * factor;
}

const double = multiplier(2);

console.log(double(10)); // 20
```

---

## 📌 習題 6：自製 filter
```javascript
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
// [8, 12]
```

---

## 📌 習題 7：物件陣列 filter
```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 }
];

console.log(users.filter(user => user.age >= 18));
// [{ name: "Alice", age: 25 }]
```

---

## 📌 習題 8：傳址 vs 重新指向
```javascript
let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
    a.push(99);
    b = [100];
}

process(listA, listB);

console.log(listA); // [1, 2, 99]
console.log(listB); // [3, 4]
```

---

## 📌 習題 9：setTimeout 延遲執行
```javascript
setTimeout(() => {
    const arr = ["Task", "Completed"];
    console.log(arr.join(" "));
}, 2000); // Task Completed
```

---

## 📌 習題 10：計算總價 + callback
```javascript
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
); // 550
