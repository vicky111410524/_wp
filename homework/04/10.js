let contacts = [
  { name: "王小明", phone: "0912-345-678" },
  { name: "李華", phone: "0988-111-222" }
];

function findContact(name) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name) {
      return contacts[i].phone;
    }
  }
  return "查無此人";
}
console.log(findContact("李華"));