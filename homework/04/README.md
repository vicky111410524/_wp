## 習題 4 

AI 問答 -- https://gemini.google.com/share/d2c4aa7153ba

## 我的測試結果


```sh
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 01.js
正常
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 02.js
1
22
333
4444
55555
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 03.js
10
9
8
7
6
5
4
3
2
1
發射！
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 04.js
77°F
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 05.js
[ 12, 130, 44 ]
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 06.js
你好，我是 小明
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 07.js
平均分數：80
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 08.js
Coffee 庫存充足，剩餘 5 件
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 09.js
總共：1150 元
PS C:\Users\abc45\OneDrive\Desktop\vicky\_wp\homework\04> node 10.js
0988-111-222
```

## 摘要 

沒問題！我將每一題的**核心測試程式碼**與其在控制台（Console）輸出的**預期結果**整理如下，方便你對照：

---

### 1. BMI 計算器
```javascript
console.log("測試 1 (70kg, 1.75m):", calculateBMI(70, 1.75));
console.log("測試 2 (50kg, 1.80m):", calculateBMI(50, 1.80));
console.log("測試 3 (95kg, 1.70m):", calculateBMI(95, 1.70));
```
> **執行結果：**
> 測試 1 (70kg, 1.75m): 正常
> 測試 2 (50kg, 1.80m): 過輕
> 測試 3 (95kg, 1.70m): 肥胖

---

### 2. 數字金字塔
```javascript
// 執行上述迴圈邏輯
```
> **執行結果：**
> 1
> 22
> 333
> 4444
> 55555

---

### 3. 倒數計時器
```javascript
// 執行上述 while 迴圈
```
> **執行結果：**
> 10
> 9
> 8
> 7
> 6
> 5
> 4
> 3
> 2
> 1
> 發射！

---

### 4. 攝氏轉華氏轉換器
```javascript
console.log("0°C 轉華氏:", toFahrenheit(0));
console.log("100°C 轉華氏:", toFahrenheit(100));
```
> **執行結果：**
> 0°C 轉華氏: 32
> 100°C 轉華氏: 212

---

### 5. 陣列過濾器
```javascript
console.log("原始陣列: [12, 5, 8, 130, 44]");
console.log("過濾後結果:", filtered);
```
> **執行結果：**
> 原始陣列: [12, 5, 8, 130, 44]
> 過濾後結果: [12, 130, 44]

---

### 6. 個人名片物件
```javascript
user.sayHi();
```
> **執行結果：**
> 你好，我是 小明

---

### 7. 班級成績統計
```javascript
console.log("平均分數計算結果:");
console.log(total / students.length);
```
> **執行結果：**
> 平均分數計算結果:
> 80

---

### 8. JSON 資料解析
```javascript
// 執行上述 JSON.parse 與 if 判斷
```
> **執行結果：**
> Coffee 庫存充足，剩餘 5 件

---

### 9. 購物車總金額計算
```javascript
// 100*2 + 50*1 + 300*3 = 200 + 50 + 900
console.log("計算總金額中...");
console.log("結帳金額:", calculateTotal(cart));
```
> **執行結果：**
> 計算總金額中...
> 結帳金額: 1150

---

### 10. 簡易通訊錄搜尋
```javascript
console.log("搜尋 李華:", findContact("李華"));
console.log("搜尋 張三:", findContact("張三"));
```
> **執行結果：**
> 搜尋 李華: 0988-111-222
> 搜尋 張三: 查無此人

---

這些結果是基於上一題程式碼邏輯的直接輸出。**你想試著修改其中某一題的參數（例如改變購物車內容），看看結果會怎麼變嗎？**