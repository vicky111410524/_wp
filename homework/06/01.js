function mathTool(num1, num2, action) {
    return action(num1, num2);
}

let addResult = mathTool(10, 5, function(a, b) {
    return a + b;
});

let subResult = mathTool(10, 5, function(a, b) {
    return a - b;
});

console.log(addResult);
console.log(subResult);