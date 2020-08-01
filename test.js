const fs = require("fs");
definitions = fs.readFileSync("./Words/animalsDefinition.txt").toString().replace(/\r\n/g, "\n").split("\n");

console.log(definitions[1]);
