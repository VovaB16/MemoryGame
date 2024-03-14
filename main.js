const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flippedCards = []

let time = 0
let timer
let attempts = 0;
let maxAttempts = 26;


document.getElementById("start-button").onclick = () => {
  startGame()
}

document.getElementById("Result-button").onclick = () => {
  displayResult()
}

document.getElementById("retry-button").onclick = () => {
  resetVariables();
  location.reload();
}

document.getElementById("Back-button").onclick = () => {
  document.getElementById("Top-Result").style.display = "none";
  document.getElementById("start-page").style.display = "block";
}

function startGame() {
  var selectedLevel = document.getElementById("level").value;

  switch (selectedLevel) {
    case "Easy":
      maxAttempts = 26;
      break;
    case "Medium":
      maxAttempts = 20;
      break;
    case "Hard":
      maxAttempts = 14;
      break;
    default:
      maxAttempts = 26;
  }
  document.getElementById("start-page").style.display = "none"
  document.getElementById("game-page").style.display = "block"

  timer = setInterval(() => {
    time++
    document.getElementById("timer").innerText = `Time: ${time}s`
  }, 1000)
}

function flipCard() {
  //localStorage.clear();
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  flippedCards.push(this);
  checkForMatch();
  attempts++;
  document.getElementById("Attempts").innerText = `Attempts : ${attempts}/${maxAttempts}`;
  if (attempts >= maxAttempts) {
    displayLossMessage();
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  checkWin();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

function checkWin() {
  if (flippedCards.every(card => card.classList.contains('flip'))) {
    endGame();
  }
}

function resetVariables() {
  time = 0;
  clearInterval(timer);
  attempts = 0;
}

function endGame() {
  clearInterval(timer);
  saveResult();
  document.getElementById("game-page").style.display = "none";
  document.getElementById("end-page").style.display = "block";
  document.getElementById("end-time").innerText = `Congratulations! You've passed the ${time} seconds and ${attempts} attempts`;
}

function displayLossMessage() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("end-page").style.display = "block";
  document.getElementById("end-time").innerText = `The game is over. You've used all ${maxAttempts} attempts.`;
}

function displayResult() {
  document.getElementById("start-page").style.display = "none";
  document.getElementById("Top-Result").style.display = "block";
}

function saveResult() {
  let username = prompt("Enter your username:");

  let savedResults = JSON.parse(localStorage.getItem("memoryGameResults")) || [];
  savedResults.push({ username, time, attempts });
  savedResults = savedResults.sort((a, b) => a.time - b.time).slice(0, 10);
  localStorage.setItem("memoryGameResults", JSON.stringify(savedResults));
}

var savedResults = JSON.parse(localStorage.getItem("memoryGameResults")) || [];
savedResults = savedResults.sort((a, b) => a.attempts - b.attempts).slice(0, 10);

var resultsTableBody = document.getElementById("resultsTableBody");
for (var i = 0; i < savedResults.length; i++) {
  var result = savedResults[i];
  var row = resultsTableBody.insertRow(i);
  var rankCell = row.insertCell(0);
  var usernameCell = row.insertCell(1);
  var timeCell = row.insertCell(2);
  var attemptsCell = row.insertCell(3);

  rankCell.textContent = i + 1;
  usernameCell.textContent = result.username;
  timeCell.textContent = result.time;
  attemptsCell.textContent = result.attempts;
}

cards.forEach(card => card.addEventListener('click', flipCard));
