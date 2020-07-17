// concept of commands for interaction

const userInput = require("readline-sync");
var myArr = ["dog", "cat"];
var promptRun = userInput.question("> ");
if (promptRun.toLowerCase() === "/yes") {
    console.log(myArr[1]);
}
