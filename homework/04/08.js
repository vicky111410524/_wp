let jsonString = '{"product": "Coffee", "price": 150, "stock": 5}';
let data = JSON.parse(jsonString);

if (data.stock > 0) {
  console.log(data.product + " 庫存充足，剩餘 " + data.stock + " 件");
}