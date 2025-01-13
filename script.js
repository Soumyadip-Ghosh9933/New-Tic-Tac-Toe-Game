const board = document.getElementById("board");
const resetButton = document.getElementById("reset");
const resultDisplay = document.getElementById("result");
const toggleSoundButton = document.getElementById("toggle-sound");
const toggleThemeButton = document.getElementById("toggle-theme");
const playerXScoreDisplay = document.getElementById("playerXScore");
const playerOScoreDisplay = document.getElementById("playerOScore");
const drawsDisplay = document.getElementById("draws");
const turnDisplay = document.getElementById("turn");
const playerNamesPopup = document.getElementById("playerNamesPopup");
const startGameButton = document.getElementById("startGame");

let playerXName = "Player X";
let playerOName = "Player O";
let playerXScore = 0;
let playerOScore = 0;
let draws = 0;
let soundsEnabled = true;
const clickSound = new Audio("click.mp3");
const winSound = new Audio("win.mp3");

let currentPlayer = "X"; // Player X starts first
let gameState = Array(9).fill(null);
let gameOver = false;

// Show the popup to input player names
playerNamesPopup.style.display = "flex";

// Start the game when players enter their names
startGameButton.addEventListener("click", () => {
    playerXName = document.getElementById("playerXName").value || "Player X";
    playerOName = document.getElementById("playerOName").value || "Player O";

    // Close the popup and start the game
    playerNamesPopup.style.display = "none";
    createBoard();
});

// Initialize the board
function createBoard() {
    board.innerHTML = "";
    resultDisplay.textContent = "";
    gameState.fill(null);
    currentPlayer = currentPlayer === "X" ? "X" : "O"; // Ensure Player X starts first
    gameOver = false;
    turnDisplay.textContent = `${currentPlayer === "X" ? playerXName : playerOName}'s Turn`; // Show whose turn it is
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    }
}

// Handle cell click
function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const index = cell.dataset.index;

    if (!gameState[index]) {
        if (soundsEnabled) clickSound.play();

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add("taken");

        if (checkWin()) {
            if (soundsEnabled) winSound.play();
            resultDisplay.textContent = `${currentPlayer === "X" ? playerXName : playerOName} wins!`;
            updateScore(currentPlayer);
            gameOver = true;
            setTimeout(createBoard, 2000);
        } else if (gameState.every(cell => cell)) {
            resultDisplay.textContent = "It's a draw!";
            draws++;
            drawsDisplay.textContent = draws;
            gameOver = true;
            setTimeout(createBoard, 2000);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch players after each turn
            turnDisplay.textContent = `${currentPlayer === "X" ? playerXName : playerOName}'s Turn`; // Update the turn display
        }
    }
}

// Check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => gameState[index] === currentPlayer)
    );
}

// Update score
function updateScore(player) {
    if (player === "X") {
        playerXScore++;
        playerXScoreDisplay.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreDisplay.textContent = playerOScore;
    }
}

// Reset game
resetButton.addEventListener("click", createBoard);

// Toggle sound
toggleSoundButton.addEventListener("click", () => {
    soundsEnabled = !soundsEnabled;
    toggleSoundButton.textContent = soundsEnabled ? "🔊" : "🔇";
});

// Toggle theme
toggleThemeButton.addEventListener("click", () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    document.querySelector(".container").classList.toggle("dark-theme");
    document.querySelectorAll(".cell").forEach(cell => cell.classList.toggle("dark-theme"));
    toggleThemeButton.textContent = isDarkTheme ? "🌞" : "🌙";
});

// Initialize the game
createBoard();
