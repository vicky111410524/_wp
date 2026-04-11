let students = [
  { name: "Alice", score: 90 },
  { name: "Bob", score: 80 },
  { name: "Charlie", score: 70 }
];
let total = 0;
for (let i = 0; i < students.length; i++) {
  total += students[i].score;
}
console.log("平均分數：" + (total / students.length));