function replaceChar(str) {
    str = [...str];

    for (let i = 0; i < str.length; i++) {
        if (str[i] == "-") {
            str[i] = " ";
        }
    }
    return str.join("");
}
console.log(replaceChar("foo-bar-baz"));
