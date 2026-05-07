function myFilter(arr, callback) {
    let result = [];

    for (let item of arr) {
        if (callback(item)) {
            result.push(item);
        }
    }

    return result;
}

let numbers = [1, 5, 8, 12];

let filtered = myFilter(numbers, item => item > 7);

console.log(filtered);