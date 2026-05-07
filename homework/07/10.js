// 錯誤優先 callback
function checkAdmin(role, callback) {
    if (role !== "admin") {
        callback("Access Denied", null);
    } else {
        callback(null, "Welcome");
    }
}

checkAdmin("user", (err, msg) => {
    if (err) {
        console.log(err);
        // 測試結果：Access Denied
    } else {
        console.log(msg);
    }
});

checkAdmin("admin", (err, msg) => {
    if (err) {
        console.log(err);
    } else {
        console.log(msg);
        // 測試結果：Welcome
    }
});