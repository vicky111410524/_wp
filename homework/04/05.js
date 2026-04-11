let numbers = [12, 5, 8, 130, 44];
let filtered = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 10) {
    filtered.push(numbers[i]);
  }
}
console.log(filtered); // [12, 130, 44]