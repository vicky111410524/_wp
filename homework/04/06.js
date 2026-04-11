let user = {
  name: "小明",
  age: 25,
  isVip: true,
  sayHi: function() {
    console.log("你好，我是 " + this.name);
  }
};
user.sayHi();