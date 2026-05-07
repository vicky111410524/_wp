// callback 回傳資料
function fetchData(id, callback) {
    const data = { id: id, status: "success" };
    callback(null, data);
}

fetchData(101, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        // 測試結果：{ id: 101, status: 'success' }
    }
});