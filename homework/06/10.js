function calculateTotal(cart, discountFunc) {
    let total = 0;

    for (let price of cart) {
        total += price;
    }

    return discountFunc(total);
}

let result = calculateTotal([100, 200, 300], function(total) {
    return total - 50;
});

console.log(result);