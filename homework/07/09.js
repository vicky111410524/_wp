// 取前 10 字 + ...
const arr = [
    "Very long content here",
    "Another Very long content here",
    "3rd Very long content here"
];

const short = arr.map(str => str.substring(0, 10) + "...");

console.log(short);
// 測試結果：["Very long ...", "Another Ve...", "3rd Very ..."]