// 陣列轉 HTML 字串
const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}];

let html = "";

posts.forEach(p => {
    html += `<div>${p.t}</div>`;
});

console.log(html);
// 測試結果：<div>A</div><div>B</div>