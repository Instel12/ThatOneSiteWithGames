const WORD_LENGTH = 5;
const MAX_TRIES = 6;
const gameDiv = document.getElementById("game");
const keyboardDiv = document.getElementById("keyboard");
const message = document.getElementById("message");

const qwertyRows = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm"
];
const keys = {};
let wordList = [];
let currentWord = "";
let currentRow = 0;
let currentCol = 0;
let board = [];

async function fetchWordList() {
  try {
const response = await fetch("words.txt");
const text = await response.text();
wordList = text.split("\n").map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
currentWord = wordList[Math.floor(Math.random() * wordList.length)];
buildBoard();
buildKeyboard();
  } catch (e) {
message.textContent = "A critical error occored, please report this to Gameroom!";
  }
}

function buildBoard() {
  for (let r = 0; r < MAX_TRIES; r++) {
board[r] = [];
for (let c = 0; c < WORD_LENGTH; c++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  gameDiv.appendChild(cell);
  board[r][c] = cell;
}
  }
}

function buildKeyboard() {
  qwertyRows.forEach(row => {
[...row].forEach(letter => {
  const key = document.createElement("div");
  key.className = "key";
  key.textContent = letter;
  key.onclick = () => handleKey(letter);
  keyboardDiv.appendChild(key);
  keys[letter] = key;
});
const spacer = document.createElement("div");
spacer.style.gridColumn = "span 10";
keyboardDiv.appendChild(spacer);
  });
}

function handleKey(key) {
  if (currentRow >= MAX_TRIES) return;

  if (key === "Backspace") {
if (currentCol > 0) {
  currentCol--;
  board[currentRow][currentCol].textContent = "";
  message.textContent = "";
}
return;
  }

  if (/^[a-z]$/.test(key) && currentCol < WORD_LENGTH) {
board[currentRow][currentCol].textContent = key;
currentCol++;

if (currentCol === WORD_LENGTH) {
  const guess = board[currentRow].map(cell => cell.textContent).join("").toLowerCase();
  if (wordList.includes(guess)) {
checkGuess(guess);
currentRow++;
currentCol = 0;
  } else {
message.textContent = `"${guess}" is not a valid word`;
  }
}
  }
}

function checkGuess(guess) {
  const answer = currentWord.split("");
  const guessLetters = guess.split("");
  const result = Array(WORD_LENGTH).fill("absent");
  const letterCount = {};

  for (let letter of answer) {
letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
if (guessLetters[i] === answer[i]) {
  result[i] = "correct";
  letterCount[guessLetters[i]]--;
}
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
if (result[i] === "correct") continue;
if (letterCount[guessLetters[i]]) {
  result[i] = "present";
  letterCount[guessLetters[i]]--;
}
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
const cell = board[currentRow][i];
const letter = guessLetters[i];
cell.classList.add(result[i]);

if (keys[letter]) {
  keys[letter].classList.remove("absent", "present", "correct");
  keys[letter].classList.add(result[i]);
}
  }

  if (guess === currentWord) {
message.textContent = "🎉 You got it! New word in 3s...";
setTimeout(() => location.reload(), 3000);
  } else if (currentRow + 1 === MAX_TRIES) {
message.textContent = `Out of tries! The word was "${currentWord.toUpperCase()}"`;
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Backspace") {
handleKey("Backspace");
  } else if (/^[a-zA-Z]$/.test(e.key)) {
handleKey(e.key.toLowerCase());
  }
});

fetchWordList();