const gameContainer = document.getElementById("game");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const submitButton = document.querySelector("#submit-button");
const currentScore = document.querySelector("#score-current");
const bestScore = document.querySelector("#score-best");
const enteredNumber = document.querySelector("#number-entry");
const cardsToClear = [];
const cardsToEvaluate = [];
const scores = { current: 0, best: -1 };
let includedEmoji = [];
let cardNumber = 10;
let matchedCardNumber = 0;

//Provided by Springboard, order adjusted to list colors in pairs
const COLORS = [
  "red",
  "red",
  "green",
  "green",
  "blue",
  "blue",
  "orange",
  "orange",
  "purple",
  "purple",
];

//function provided by Springboard
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

//function provided by Springboard, modified to use data-attributes instead of class
//and utilize emojis as well as colors
function createDivsForColors(combinedArray) {
  for (element of combinedArray) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("data-color", element.color);
    newDiv.setAttribute("data-emoji", element.emoji);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  let card = event.target;
  if (
    cardsToClear.length == 0 &&
    !card.getAttribute("data-matched") &&
    (cardsToEvaluate.length == 0 ||
      (cardsToEvaluate.length < 2 && cardsToEvaluate[0] !== card))
  ) {
    setColorAndEmoji(
      card,
      card.getAttribute("data-color"),
      card.getAttribute("data-emoji")
    );
    cardsToEvaluate.push(card);
    incrementScore();
  }
  if (cardsToEvaluate.length == 2) {
    evaluateCards();
  }
}

function evaluateCards() {
  if (
    cardsToEvaluate[0].getAttribute("data-color") !=
    cardsToEvaluate[1].getAttribute("data-color")
  ) {
    cardsToClear.push(cardsToEvaluate.pop());
    cardsToClear.push(cardsToEvaluate.pop());
    setTimeout(clearMismatches, 1000);
  } else {
    cardsToEvaluate.pop().setAttribute("data-matched", true);
    cardsToEvaluate.pop().setAttribute("data-matched", true);
    matchedCardNumber += 2;
    if (matchedCardNumber == cardNumber) {
      recordScore();
    }
  }
}

function clearMismatches() {
  while (cardsToClear.length > 0) {
    setColorAndEmoji(cardsToClear.pop(), "", "");
  }
}

function recordScore() {
  if (scores.best < 0 || scores.current < scores.best) {
    scores.best = scores.current;
    bestScore.textContent = `- ${cardNumber} Cards: ` + scores.current;
    localStorage.setItem("bestScore" + cardNumber, scores.best);
  }
}

function adjustNumberOfColors(inputNum) {
  let newColorArray;
  if (inputNum > 10) {
    newColorArray = [...COLORS];
    while (newColorArray.length != inputNum) {
      let newColor = randomColor();
      if (!newColorArray.includes(newColor)) {
        newColorArray.push(newColor, newColor);
      }
    }
  } else {
    newColorArray = [...COLORS];
    while (newColorArray.length != inputNum) {
      let removalIndex =
        Math.floor(Math.random() * (newColorArray.length / 2)) * 2;
      newColorArray.splice(removalIndex, 2);
    }
  }
  return newColorArray;
}

function assignEmojisToColors(colorArray) {
  let combinedArray = [];
  for (let i = 0; i < colorArray.length; i += 2) {
    let emoji = randomEmoji();
    while (includedEmoji.includes(emoji)) {
      emoji = randomEmoji();
    }
    includedEmoji.push(emoji);
    let colorEmojiObj = { color: colorArray[i], emoji };
    combinedArray.push(colorEmojiObj, colorEmojiObj);
  }
  return combinedArray;
}

function randomColor() {
  let red = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

function randomEmoji() {
  let emojiNum = Math.floor(Math.random() * 768) + 127744;
  return `&#${emojiNum};`;
}

function getShuffledComboArray() {
  let outputArray = assignEmojisToColors(adjustNumberOfColors(cardNumber));
  shuffle(outputArray);
  return outputArray;
}

function setColorAndEmoji(card, color, emoji) {
  card.style.backgroundColor = color;
  card.innerHTML = emoji;
}

function incrementScore() {
  currentScore.textContent = ++scores.current;
}

function resetGame(numCards) {
  gameContainer.textContent = "";
  matchedCardNumber = 0;
  includedEmoji = [];
  scores.current = -1;
  let storedBest = localStorage.getItem("bestScore" + numCards);
  if (storedBest != null) {
    scores.best = Number(storedBest);
    bestScore.textContent = `- ${numCards} Cards: ` + storedBest;
  } else {
    scores.best = -1;
    bestScore.textContent = `- ${numCards} Cards: None Yet!`;
  }
  incrementScore();
  let shuffledColorsAndEmojis = getShuffledComboArray();
  createDivsForColors(shuffledColorsAndEmojis);
}

// Provided by Springboard, removed to start game with start button instead
//createDivsForColors(shuffledColors);

startButton.addEventListener("click", function (e) {
  resetGame(10);
  startButton.disabled = true;
  resetButton.disabled = false;
});

resetButton.addEventListener("click", function (e) {
  resetGame(cardNumber);
});

submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (enteredNumber.validity.valid) {
    cardNumber = enteredNumber.value;
    resetGame(cardNumber);
  }
});
