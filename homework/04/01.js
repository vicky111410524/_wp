function calculateBMI(weight, height) {
  let bmi = weight / (height * height);
  if (bmi < 18.5) return "過輕";
  if (bmi < 24) return "正常";
  if (bmi < 27) return "過重";
  return "肥胖";
}
console.log(calculateBMI(70, 1.75)); // 正常