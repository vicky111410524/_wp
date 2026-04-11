let cart = [
  { price: 100, quantity: 2 },
  { price: 50, quantity: 1 },
  { price: 300, quantity: 3 }
];

function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price * items[i].quantity;
  }
  return sum;
}
console.log("總共：" + calculateTotal(cart) + " 元");