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

// --- COLLISION RADAR ---
function isPathClear(startR, startCol, endR, endCol) {
    const rowStep = (startR === endR) ? 0 : (endR > startR ? 1 : -1);
    const colStep = (startCol === endCol) ? 0 : (endCol > startCol ? 1 : -1);

    let currentRow = startR + rowStep;
    let currentCol = startCol + colStep;
    
    const rows = document.querySelectorAll('.board tr:not(:first-child)');

    while (currentRow !== endR || currentCol !== endCol) {
        const cells = rows[currentRow].querySelectorAll('td');
        if (cells[currentCol].textContent !== '') {
            return false; // Path blocked!
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true; // Path clear!
}

// --- THE BOUNCER ---
function isValidMove(piece, startR, startCol, endR, endCol, isCapture, pieceColor) {
    const rowDiff = Math.abs(startR - endR);
    const colDiff = Math.abs(startCol - endCol);

    // 1. ROOK
    if (piece === '♜' || piece === '♖') {
        if (startR === endR || startCol === endCol) return isPathClear(startR, startCol, endR, endCol);
        return false;
    }
    // 2. BISHOP
    if (piece === '♝' || piece === '♗') {
        if (rowDiff === colDiff) return isPathClear(startR, startCol, endR, endCol);
        return false;
    }
    // 3. QUEEN
    if (piece === '♛' || piece === '♕') {
        if ((startR === endR || startCol === endCol) || (rowDiff === colDiff)) return isPathClear(startR, startCol, endR, endCol);
        return false;
    }
    // 4. KNIGHT
    if (piece === '♞' || piece === '♘') {
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    // 5. KING
    if (piece === '♚' || piece === '♔') {
        return rowDiff <= 1 && colDiff <= 1;
    }
    // 6. PAWN
    if (piece === '♟' || piece === '♙') {
        const direction = (pieceColor === 'white') ? -1 : 1;
        const startingRow = (pieceColor === 'white') ? 6 : 1;

        if (!isCapture && startCol === endCol) {
            if (endR === startR + direction) return true;
            if (startR === startingRow && endR === startR + (direction * 2)) return isPathClear(startR, startCol, endR, endCol); 
        }
        if (isCapture && rowDiff === 1 && endR === startR + direction) {
            return true;
        }
        return false; 
    }
    return false;
}

// --- TIMER FUNCTIONS ---
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

// --- GAME LOGIC FUNCTIONS ---
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

// --- EVENT LISTENERS ---
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
                    const targetRow = i;
                    const targetCol = j;

                    // Friendly fire check
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                        selectedRow = i; // Update coordinates if switching pieces
                        selectedCol = j;
                        return;
                    }

                    // Ask the Bouncer
                    const pieceSymbol = selectedPiece.textContent;
                    const isCapture = (currentCell.textContent !== '');
                    const pieceColor = selectedPiece.dataset.pieceColor;

                    if (!isValidMove(pieceSymbol, selectedRow, selectedCol, targetRow, targetCol, isCapture, pieceColor)) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = null;
                        return; // Illegal move!
                    }

                    // Move is legal: execute it
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