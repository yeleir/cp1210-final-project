const pieces = {
    r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
    R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
    '': ''
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let whiteTime = 300;
let blackTime = 300;
let timer = null;

let selectedPiece = null;
let currentTurn = 'white';

function formatTime(t) {
    let minutes = Math.floor(t / 60);
    let seconds = t % 60;
    let secondString;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

function updateClocks() {
    document.getElementById("whiteClock").textContent = formatTime(whiteTime);
    document.getElementById("blackClock").textContent = formatTime(blackTime);
    if (currentTurn === "white") {
        document.getElementById("whiteClock").classList.add("active");
        document.getElementById("blackClock").classList.remove("active");
    } else {
        document.getElementById("blackClock").classList.add("active");
        document.getElementById("whiteClock").classList.remove("active");
    }
}

function runTimer() {
    if (timer !== null) {
        return;
    }
    timer = setInterval(function () {
        if (currentTurn === "white") {
            whiteTime = whiteTime - 1;
            if (whiteTime <= 0) {
                clearInterval(timer);
                alert("Black wins on time");
            }
        } else {
            blackTime = blackTime - 1;

            if (blackTime <= 0) {
                clearInterval(timer);
                alert("White wins on time");
            }
        }
        updateClocks();
    }, 1000);
}

function setupBoard() {
    const rows = document.querySelectorAll('.board tr:not(:first-child)');
    for (let i = 0; i < 8; i++) {
        const cells = rows[i].querySelectorAll('td');
        for (let j = 0; j < 8; j++) {
            const symbol = initialBoard[i][j];
            const cell = cells[j];

            cell.classList.remove('selected');
            cell.textContent = pieces[symbol];

            if (symbol !== '') {
                if (symbol === symbol.toUpperCase()) {
                    cell.dataset.pieceColor = 'white';
                } else {
                    cell.dataset.pieceColor = 'black';
                }
            } else {
                delete cell.dataset.pieceColor;
            }
        }
    }
}

function resetGame() {
    clearInterval(timer);
    timer = null;
    whiteTime = 300;
    blackTime = 300;
    currentTurn = 'white';
    selectedPiece = null;
    document.getElementById('turnDisplay').textContent = "Current Turn: White";
    updateClocks();
    setupBoard();
}

function switchTurn() {
    if (currentTurn === "white") {
        currentTurn = "black";
    } else {
        currentTurn = "white";
    }

    updateClocks();
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.board tr:not(:first-child)');
    const turnDisplay = document.getElementById('turnDisplay');
    const resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', resetGame);

    for (let i = 0; i < 8; i++) {
        const cells = rows[i].querySelectorAll('td');
        for (let j = 0; j < 8; j++) {
            const currentCell = cells[j];

            currentCell.style.fontSize = '45px';
            currentCell.style.textAlign = 'center';
            currentCell.style.cursor = 'pointer';

            currentCell.addEventListener('click', () => {
                if (selectedPiece) {
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                        return;
                    }

                    currentCell.textContent = selectedPiece.textContent;
                    currentCell.dataset.pieceColor = selectedPiece.dataset.pieceColor;
                    selectedPiece.textContent = '';
                    delete selectedPiece.dataset.pieceColor;
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;

                    runTimer();

                    if (currentTurn === "white") {
                        currentTurn = "black";
                        turnDisplay.textContent = "Current Turn: Black";
                    } else {
                        currentTurn = "white";
                        turnDisplay.textContent = "Current Turn: White";
                    }
                    updateClocks();

                } else if (currentCell.textContent !== '') {
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                    }
                }
            });
        };
    };
    setupBoard();
    updateClocks();
});