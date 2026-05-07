// 模擬 db.get
function fakeGet(sql, params, callback) {
    callback(null, { title: "Fake Title" });
}

fakeGet("SELECT *", [], (err, data) => {
    if (!err) {
        console.log(data.title);
        // 測試結果：Fake Title
    }
});