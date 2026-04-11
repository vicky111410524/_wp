let levels = 5;
for (let i = 1; i <= levels; i++) {
  let row = "";
  for (let j = 1; j <= i; j++) {
    row += i;
  }
  console.log(row);
}