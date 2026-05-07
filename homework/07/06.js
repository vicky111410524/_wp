// JSON 字串轉物件
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

const obj = JSON.parse(jsonStr);

console.log(obj.tags[1]);
// 測試結果：node