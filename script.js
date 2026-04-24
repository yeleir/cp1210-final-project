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
let selectedRow = null;
let selectedCol = null;
let currentTurn = 'white';
let isBlitz = false;

function isPathClear(startRow, startCol, endRow, endCol) {
    const rowStep = (startRow === endRow) ? 0 : (endRow > startRow ? 1 : -1);
    const colStep = (startCol === endCol) ? 0 : (endCol > startCol ? 1 : -1);

    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    const rows = document.querySelectorAll('.board tr:not(:first-child)');

    while (currentRow !== endRow || currentCol !== endCol) {
        const cells = rows[currentRow].querySelectorAll('td');
        if (cells[currentCol].textContent !== '') {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}

function isValidMove(piece, startRow, startCol, endRow, endCol, isCapture, pieceColor) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    if (piece === '♜' || piece === '♖') {
        if (startRow === endRow || startCol === endCol) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }

    if (piece === '♝' || piece === '♗') {
        if (rowDiff === colDiff) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }

    if (piece === '♛' || piece === '♕') {
        if ((startRow === endRow || startCol === endCol) || (rowDiff === colDiff)) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }

    if (piece === '♞' || piece === '♘') {
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    if (piece === '♚' || piece === '♔') {
        return rowDiff <= 1 && colDiff <= 1;
    }

    if (piece === '♟' || piece === '♙') {
        const direction = (pieceColor === 'white') ? -1 : 1;
        const startingRow = (pieceColor === 'white') ? 6 : 1;

        if (!isCapture && startCol === endCol) {
            if (endRow === startRow + direction) return true;
            if (startRow === startingRow && endRow === startRow + (direction * 2)) return isPathClear(startRow, startCol, endRow, endCol);
        }
        if (isCapture && rowDiff === 1 && endRow === startRow + direction) {
            return true;
        }
        return false;
    }
    return false;
}


function formatTime(t) {
    let minutes = Math.floor(t / 60);
    let seconds = t % 60;
    if (seconds < 10) seconds = "0" + seconds;
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
    if (timer !== null) return;
    if (isBlitz) {
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
    currentTurn = (currentTurn === "white") ? "black" : "white";
    updateClocks();
}


document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.board tr:not(:first-child)');
    const turnDisplay = document.getElementById('turnDisplay');
    const resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', resetGame);
    const startMenu = document.getElementById('startMenu');
    const btnUntimed = document.getElementById('buttonUntimed');
    const btnBlitz = document.getElementById('buttonBlitz');
    const forfeitButton = document.getElementById('forfeitButton');

    btnUntimed.addEventListener('click', () => {
        isBlitz = false;
        startMenu.classList.add('hidden');
        document.getElementById('clockContainer').style.visibility = 'hidden';
    });
    btnBlitz.addEventListener('click', () => {
        isBlitz = true;
        startMenu.classList.add('hidden');
        document.getElementById('clockContainer').style.visibility = 'visible';
    });

    forfeitButton.addEventListener('click', () => {
        const winner = (currentTurn === 'white') ? 'Black' : 'White';
        alert(`${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)} forfeits! ${winner} wins!`);
        startMenu.classList.remove('hidden');
        resetGame();
    });


    for (let i = 0; i < 8; i++) {
        const cells = rows[i].querySelectorAll('td');
        for (let j = 0; j < 8; j++) {
            const currentCell = cells[j];

            currentCell.style.fontSize = '45px';
            currentCell.style.textAlign = 'center';
            currentCell.style.cursor = 'pointer';

            currentCell.addEventListener('click', () => {
                if (selectedPiece) {
                    const targetRow = i;
                    const targetCol = j;


                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                        selectedRow = i;
                        selectedCol = j;
                        return;
                    }


                    const pieceSymbol = selectedPiece.textContent;
                    const isCapture = (currentCell.textContent !== '');
                    const pieceColor = selectedPiece.dataset.pieceColor;

                    if (!isValidMove(pieceSymbol, selectedRow, selectedCol, targetRow, targetCol, isCapture, pieceColor)) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = null;
                        return;
                    }


                    currentCell.textContent = selectedPiece.textContent;
                    currentCell.dataset.pieceColor = selectedPiece.dataset.pieceColor;
                    selectedPiece.textContent = '';
                    delete selectedPiece.dataset.pieceColor;
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;

                    runTimer();
                    switchTurn();
                    turnDisplay.textContent = `Current Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;

                } else if (currentCell.textContent !== '') {
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece = currentCell;
                        selectedRow = i;
                        selectedCol = j;
                        currentCell.classList.add('selected');
                    }
                }
            });
        }
    }
    setupBoard();
    updateClocks();
});