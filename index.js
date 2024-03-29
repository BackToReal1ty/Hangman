// Allows for user input and reading from external files
const userInput = require("readline-sync");
const fs = require("fs");

// Starts new game
function newGame() {
    //lifelines
    usedShowVowels = false;
    usedShowDefinition = false;
    usedSkipWord = false;

    //An array to store already guessed words
    completedWords = [];

    //An array to store chosen numbers from the random integer generator
    chosenNumberArr = [];

    //a variable to store user's score
    score = 0;

    //output starting message
    console.log(
        "=============================================================================" +
            "\n                             Welcome to Hangman!" +
            "\n============================================================================="
    );
    //output for difficulty selection
    console.log(
        "Select Difficulty" +
            "\n(1)\tEasy (10 Lives)" +
            "\n(2)\tMedium (5 Lives)" +
            "\n(3)\tHard (3 Lives)" +
            "\n(4)\tIMPOSSIBLE (1 Lives)"
    );

    //Prompts user for difficuly
    switch (userInput.questionInt("\n> ")) {
        case 1:
            console.log("Selected: Easy");
            lives = 10;
            break;
        case 2:
            console.log("Selected: Medium");
            lives = 5;
            break;
        case 3:
            console.log("Selected: Hard");
            lives = 3;
            break;
        case 4:
            console.log("Selected: IMPOSSIBLE");
            lives = 1;
            break;
    }

    //output for category
    console.log("Select Category" + "\n(1)\tAnimals" + "\n(2)\tSports" + "\n(3)\tFruits");

    //Prompts user for category and reads text files accordingly
    switch (userInput.questionInt("\n> ")) {
        case 1:
            console.log("Selected: Animals");
            words = fs.readFileSync("./Words/animals.txt").toString().replace(/\r\n/g, "\n").split("\n");
            definitions = fs.readFileSync("./Words/animalsDefinition.txt").toString().replace(/\r\n/g, "\n").split("\n");
            break;
        case 2:
            console.log("Selected: Sports");
            words = fs.readFileSync("./Words/sports.txt").toString().replace(/\r\n/g, "\n").split("\n");
            definitions = fs.readFileSync("./Words/sportsDefinition.txt").toString().replace(/\r\n/g, "\n").split("\n");
            break;
        case 3:
            console.log("Selected: Fruits");
            words = fs.readFileSync("./Words/fruits.txt").toString().replace(/\r\n/g, "\n").split("\n");
            definitions = fs.readFileSync("./Words/fruitsDefinition.txt").toString().replace(/\r\n/g, "\n").split("\n");
            break;
    }

    //wordbank object to meet assignment requirements
    wordCollection = {
        wordArr: words,
        definitionArr: definitions,
    };

    //Callback Function to initiate first round
    newRound();
}

//Starts a new round
function newRound() {
    //Picks a random word from the array
    var randomInteger = Math.floor(Math.random() * wordCollection.wordArr.length);

    //Checks if the random number has been chosen before and chooses a new number if it has
    var chosenNumbersMinLength = chosenNumberArr.length++;
    for (let i = 0; i < chosenNumbersMinLength; i++) {
        if (randomInteger == chosenNumberArr[i]) {
            randomInteger = Math.floor(Math.random() * wordCollection.wordArr.length);
        }
    }

    var chosenWord = new Word(wordCollection.wordArr[randomInteger], wordCollection.definitionArr[randomInteger]);

    //removes the entry from the set of words
    wordCollection.wordArr.splice(randomInteger, 1);

    //array to store letters already used by the user
    usedLetterArr = [];

    //array used to store letters in the word for comparison to user's guess
    lettersWordArr = [];

    //pushes every letter of the word into lettersWordArr
    for (let i = 0; i < chosenWord.lettersArr.length; i++) {
        lettersWordArr.push(chosenWord.lettersArr[i].letter);
    }

    //calls checkVowel fuction to update vowels
    for (let i = 0; i < chosenWord.lettersArr.length; i++) {
        chosenWord.lettersArr[i].checkVowel();
    }

    //calls guessLetter function to let the user guess
    guessLetter(chosenWord, randomInteger);
}

// Lets user guess word
function guessLetter(word, wordIndex) {
    console.log("\n" + word.returnString() + "\n");

    //array used to store boolearn values whether each letter of the word is correctly guessed
    var guessesArr = [];

    if (usedShowVowels == false || usedShowDefinition == false || usedSkipWord == false) {
        console.log("\n(1) Use a lifeline\n(2) Guess Letter");
        var choiceInput = userInput.questionInt("\n> ");
        while (choiceInput.length < 1 || choiceInput.length > 1 || choiceInput > 2 || choiceInput < 1) {
            choiceInput = userInput.questionInt("Error! INVALID OPTION \nPlease choose again.");
        }

        switch (choiceInput) {
            case 1:
                console.log(
                    "\nWhich lifeline should be used?" +
                        "\n(1) Show all vowels" +
                        "\n(2) Show definition of current word" +
                        "\n(3) Skip current word" +
                        "\n(4) Cancel"
                );
                lifelineInput = userInput.questionInt("\n> ");
                while (lifelineInput.length > 1 || lifelineInput.length < 1 || lifelineInput > 4 || lifelineInput < 1) {
                    lifelineInput = userInput.questionInt("Error! INVALID OPTION \nPlease choose again.");
                }
                switch (lifelineInput) {
                    case 1:
                        showVowels(word, wordIndex);
                        console.log("\n" + word.returnString() + "\n");
                        break;
                    case 2:
                        ShowDefinition(word, wordIndex);
                        console.log("\n" + word.returnString() + "\n");
                        break;
                    case 3:
                        skipWord(word, wordIndex);
                        newRound();
                        return;
                        break;
                    case 4:
                        guessLetter(word, wordIndex);
                        break;
                }
                break;
        }
    }

    //prompts user for a letter and converts it into lowercase for easy comparison
    var letterInput = userInput.question("\nEnter a letter \n> ").toLowerCase();

    // <------------------------------------Error Handling for letterInput Starts Here------------------------------------------->
    //Ensures that the letter input is one character
    while (letterInput.length < 1 || letterInput < Number.POSITIVE_INFINITY || letterInput > Number.NEGATIVE_INFINITY) {
        letterInput = userInput.question("\nError! Please enter a letter. \n> ").toLowerCase();
    }

    while (letterInput.length > 1) {
        letterInput = userInput.question("\nError! Please enter only one letter at a time. \n> ").toLowerCase();
    }

    //Ensures that the letter input has not been used
    for (let i = 0; i < usedLetterArr.length; i++) {
        while (letterInput === usedLetterArr[i].toLowerCase()) {
            letterInput = userInput.question("\nError! You have already used that letter! \n> ").toLowerCase();
        }
    }

    //<------------------------------------Error Handling for letterInput Ends Here------------------------------------------->

    //Pushes the letter input by the user into the used letter array
    usedLetterArr.push(letterInput);

    //Checks if the letter given is in the word and updates gussesArr
    word.guessCheckCallback(letterInput);
    for (i = 0; i < word.lettersArr.length; i++) {
        guessesArr.push(word.lettersArr[i].guessed);
    }

    //Output based on user's guess
    if (lettersWordArr.indexOf(letterInput) >= 0) {
        console.log("\nCorrect!");
    } else {
        lives--;
        console.log("\nIncorrect\nLives Remaining: " + lives);
    }

    //<------------------------------------Possible Outcomes Based on User's Guess Starts Here------------------------------------------->
    //Checks that the word has not been fully guessed
    if (guessesArr.indexOf(false) >= 0 && lives > 0) {
        //calls guessLetter again, allowing the user to input another guess
        guessLetter(word, wordIndex);

        //Moves to next round if guessed correctly, or outputs win message if 10 words have been guessed
    } else if (lives > 0) {
        //Checks score and updates score variable
        for (let i = 0; i < word.lettersArr.length; i++) {
            word.lettersArr[i].checkScore();
            score += word.lettersArr[i].score;

            //if completed words are less than 10, starts the next round
        }
        if (completedWords.length !== 10) {
            console.log("\nWord guessed! The word was " + word.actualWord + "\nMoving on to next round..." + "\nScore: " + score);
            completedWords.push(word);

            //starts another round
            newRound();

            //output if the user won the game
        } else {
            completedWords.push(word);
            console.log("\nWord guessed! The word was " + word.actualWord);
            console.log("Congratulations, you solved " + completedWords.length + " out of 10 words!");
            console.log("Score: " + score);

            //promts user to enter their name
            nameInput = userInput.question("Please enter your name\n> ");

            //writes name and score to the respective files
            fs.appendFileSync("./Scores/scores.txt", "\r\n" + score);
            fs.appendFileSync("./Scores/names.txt", "\r\n" + nameInput);
            endMenu();
        }
    } else {
        //Checks score and updates score variable
        for (let i = 0; i < word.lettersArr.length; i++) {
            word.lettersArr[i].checkScore();
            score += word.lettersArr[i].score;
        }
        console.log("\nYou lost :-/ The word was " + word.actualWord);
        console.log("You solved: " + completedWords.length + " out of 10 words!");
        console.log("Score: " + score);

        //promts user to enter their name
        nameInput = userInput.question("Please enter your name\n> ");

        //writes name and score to the respective files
        fs.appendFileSync("./Scores/names.txt", "\r\n" + nameInput);
        fs.appendFileSync("./Scores/scores.txt", "\r\n" + score);
        endMenu();
    }
}

//<------------------------------------Possible Outcomes Based on User's Guess Ends Heree------------------------------------------->

//<------------------------------------Lifeline Functions Starts Here------------------------------------------->

//parameter wordIndex is used so that the value can be parsed back into guess Letter function

//lifeline to show all vowels
function showVowels(word, wordIndex) {
    if (usedShowVowels == true) {
        console.log("Error! You have already used that lifeline!");
        guessLetter(word, wordIndex);
    }
    for (let i = 0; i < word.lettersArr.length; i++) {
        if (word.lettersArr[i].vowel === true) {
            word.lettersArr[i].guessed = true;
        }
    }
    usedShowVowels = true;
}

//lifeline to show definition
function ShowDefinition(word, wordIndex) {
    if (usedShowDefinition == true) {
        console.log("Error! You have already used that lifeline!");
        guessLetter(word, wordIndex);
    }
    console.log("\nDefinition: " + wordCollection.definitionArr[wordIndex]);
    usedShowDefinition = true;
}

//lifeline to skip word
function skipWord(word, wordIndex) {
    if (skipWord == true) {
        console.log("Error! You have already used that lifeline!");
        guessLetter(word, wordIndex);
    }
    for (let i = 0; i < word.lettersArr.length; i++) {
        word.lettersArr[i].guessed = true;
    }
    for (let i = 0; i < word.lettersArr.length; i++) {
        word.lettersArr[i].checkScore();
        score += word.lettersArr[i].score;
    }
    console.log("\nLifeline used! The word was " + word.actualWord + "\nMoving on to next round..." + "\nScore: " + score);
    usedSkipWord = true;
    completedWords.push(word);
}

//<------------------------------------Lifeline Functions End Here------------------------------------------->

//a function for the menu at the end of the game
function endMenu() {
    //displays options on what the user can do
    console.log(
        "\n(1) Display Highest Score" +
            "\n(2) Display Lowest Score" +
            "\n(3) Display Average Score" +
            "\n(4) Play Again" +
            "\nPress any other number to exit."
    );

    //Prompts user for their choice
    switch (userInput.questionInt("\n> ")) {
        case 1:
            //store score entries into an array
            var scores = fs.readFileSync("./Scores/scores.txt").toString().replace(/\r\n/g, "\n").split("\n");
            var temp;
            //sorts scores in the array according to highest to lowest
            for (let i = 0; i < scores.length; i++) {
                for (let j = 0; j < scores.length; j++) {
                    if (parseInt(scores[j]) < parseInt(scores[j + 1])) {
                        temp = scores[j];
                        scores[j] = scores[j + 1];
                        scores[j + 1] = temp;
                    }
                }
            }
            console.log("Highest Score: " + scores[0]);
            endMenu();
            break;
        case 2:
            //store score entries into an array
            var scores = fs.readFileSync("./Scores/scores.txt").toString().replace(/\r\n/g, "\n").split("\n");
            var temp;
            //sorts scores in the array according to lowest to highest
            for (let i = 0; i < scores.length; i++) {
                for (let j = 0; j < scores.length; j++) {
                    if (parseInt(scores[j]) > parseInt(scores[j + 1])) {
                        temp = scores[j];
                        scores[j] = scores[j + 1];
                        scores[j + 1] = temp;
                    }
                }
            }
            console.log("Lowest Score: " + scores[0]);
            endMenu();
            break;
        case 3:
            //store score entries into an array
            var scores = fs.readFileSync("./Scores/scores.txt").toString().replace(/\r\n/g, "\n").split("\n");
            var total = 0;
            var averageScore = 0;
            for (let i = 0; i < scores.length; i++) {
                total += parseInt(scores[i]);
            }
            averageScore = total / scores.length;
            console.log("Average Score: " + averageScore.toFixed(3));
            endMenu();
            break;
        case 4:
            newGame();
            break;
    }
}

//Class constructors for each word and letter

function Word(chosenWord, chosenDefinition) {
    this.actualWord = chosenWord;

    this.lettersArr = [];

    //stores the definition of the word
    this.definition = chosenDefinition;

    //Gives each letter properties and pushes them into an array
    for (let i = 0; i < chosenWord.length; i++) {
        this.lettersArr.push(new Letters(chosenWord.charAt(i)));
    }

    //Calls the showLetter function in each letter of the array
    //and puts them into a string to be output
    this.returnString = function () {
        outputString = "";
        for (let i = 0; i < this.lettersArr.length; i++) {
            outputString += this.lettersArr[i].showLetter();
        }
        return outputString;
    };

    //A callback function to call the guessCheck function in each letter
    this.guessCheckCallback = function (guessInput) {
        for (let i = 0; i < this.lettersArr.length; i++) {
            this.lettersArr[i].guessCheck(guessInput);
        }
    };
}
function Letters(letter) {
    this.letter = letter;
    this.guessed = false;
    this.vowel = false;
    this.score = 0;

    //function to check if the word is guessed
    this.guessCheck = function (input) {
        if (input === this.letter) {
            this.guessed = true;
        }
    };

    //determines if the letter is a vowel
    this.checkVowel = function () {
        if (this.letter == "a" || this.letter == "e" || this.letter == "i" || this.letter == "o" || this.letter == "u") {
            this.vowel = true;
            return;
        }
    };

    //if the letter is guessed, assigns a value to this.score
    this.checkScore = function () {
        if (this.guessed == true) {
            if (this.vowel == true) {
                this.score = 2;
            } else {
                this.score = 1;
            }
        }
    };

    //if the letter is guessed, shows the letter
    //if not, shows an underscore
    this.showLetter = function () {
        if (this.guessed) {
            return this.letter + " ";
        } else {
            return "_ ";
        }
    };
}

newGame();
