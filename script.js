const pieces = {
    r: 'images/black-rook.svg', 
    n: 'images/black-knight.svg', 
    b: 'images/black-bishop.svg', 
    q: 'images/black-queen.svg', 
    k: 'images/black-king.svg', 
    p: 'images/black-pawn.svg',
    
    R: 'images/white-rook.svg', 
    N: 'images/white-knight.svg', 
    B: 'images/white-bishop.svg', 
    Q: 'images/white-queen.svg', 
    K: 'images/white-king.svg', 
    P: 'images/white-pawn.svg',
    
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
let enPassantTarget = null; 

function isPathClear(startRow, startCol, endRow, endCol) {
    const rowStep = (startRow === endRow) ? 0 : (endRow > startRow ? 1 : -1);
    const colStep = (startCol === endCol) ? 0 : (endCol > startCol ? 1 : -1);

    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    const rows = document.querySelectorAll('.board tr:not(:first-child)');

    while (currentRow !== endRow || currentCol !== endCol) {
        const cells = rows[currentRow].querySelectorAll('td');
        if (cells[currentCol].innerHTML !== '') {
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
    const type = piece.toLowerCase(); 

    if (type === 'r') {
        if (startRow === endRow || startCol === endCol) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }
    if (type === 'b') {
        if (rowDiff === colDiff) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }
    if (type === 'q') {
        if ((startRow === endRow || startCol === endCol) || (rowDiff === colDiff)) return isPathClear(startRow, startCol, endRow, endCol);
        return false;
    }
    if (type === 'n') {
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    if (type === 'k') {
        if (rowDiff <= 1 && colDiff <= 1) return true;
        
        // CASTLING 
        if (rowDiff === 0 && colDiff === 2) {
            const rookCol = (endCol > startCol) ? 7 : 0; //  fiind corner Rook
            const rows = document.querySelectorAll('.board tr:not(:first-child)');
            const kingCell = rows[startRow].querySelectorAll('td')[startCol];
            const rookCell = rows[startRow].querySelectorAll('td')[rookCol];
            
            // if neither has moved, and the path between them is empty:
            if (kingCell.dataset.hasMoved === 'false' && 
                rookCell && rookCell.dataset.hasMoved === 'false' && 
                rookCell.dataset.pieceSymbol.toLowerCase() === 'r') {
                return isPathClear(startRow, startCol, startRow, rookCol);
            }
        }
        return false;
    }
    if (type === 'p') {
        const direction = (pieceColor === 'white') ? -1 : 1;
        const startingRow = (pieceColor === 'white') ? 6 : 1;

        if (!isCapture && startCol === endCol) {
            if (endRow === startRow + direction) return true;
            if (startRow === startingRow && endRow === startRow + (direction * 2)) return isPathClear(startRow, startCol, endRow, endCol);
        }
        if (isCapture && rowDiff === 1 && endRow === startRow + direction) {
            return true;
        }
        // EN PASSANT LEGALITY
        if (!isCapture && rowDiff === 1 && colDiff === 1 && endRow === startRow + direction) {
            if (enPassantTarget && enPassantTarget.row === endRow && enPassantTarget.col === endCol) {
                return true; 
            }
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

           if (symbol !== '') {
                cell.innerHTML = `<img src="${pieces[symbol]}" style="width: 45px; height: 45px; pointer-events: none;">`;
                cell.dataset.pieceSymbol = symbol;
                cell.dataset.hasMoved = 'false'; 
                
                if (symbol === symbol.toUpperCase()) {
                    cell.dataset.pieceColor = 'white';
                } else {
                    cell.dataset.pieceColor = 'black';
                }
            } else {
                cell.innerHTML = ''; 
                delete cell.dataset.pieceColor;
                delete cell.dataset.pieceSymbol; 
                delete cell.dataset.hasMoved; 
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
    enPassantTarget = null;
    document.getElementById('turnDisplay').textContent = "Current Turn: White";
    document.getElementById('startMenu').classList.remove('hidden'); 
    document.getElementById('clockContainer').style.visibility = 'hidden';
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

                    const pieceSymbol = selectedPiece.dataset.pieceSymbol;
                    const isCapture = (currentCell.innerHTML !== '');
                    const pieceColor = selectedPiece.dataset.pieceColor;

                    if (!isValidMove(pieceSymbol, selectedRow, selectedCol, targetRow, targetCol, isCapture, pieceColor)) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = null;
                        return;
                    }

                    if (currentCell.dataset.pieceSymbol === 'k' || currentCell.dataset.pieceSymbol === 'K') {
                        const winner = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1);
                        alert(`Checkmate! ${winner} captured the King and wins the game!`);
                        resetGame(); 
                        return; 
                    }
            
                    // --- EN PASSANT CAPTURE EXECUTION ---
                    if (pieceSymbol.toLowerCase() === 'p' && enPassantTarget && targetRow === enPassantTarget.row && targetCol === enPassantTarget.col) {
                        // the ghost, find  real pawn right behind it and destroy it.
                        const enemyRow = (currentTurn === 'white') ? targetRow + 1 : targetRow - 1;
                        const enemyCell = rows[enemyRow].querySelectorAll('td')[targetCol];
                        enemyCell.innerHTML = '';
                        delete enemyCell.dataset.pieceColor;
                        delete enemyCell.dataset.pieceSymbol;
                    }

                    if (pieceSymbol.toLowerCase() === 'p' && Math.abs(selectedRow - targetRow) === 2) {
                        enPassantTarget = {
                            row: (currentTurn === 'white') ? targetRow + 1 : targetRow - 1,
                            col: targetCol
                        };
                    } else {
                        enPassantTarget = null; 
                    }

                    // move piece logic
                    currentCell.innerHTML = selectedPiece.innerHTML;
                    currentCell.dataset.pieceColor = selectedPiece.dataset.pieceColor;
                    currentCell.dataset.pieceSymbol = selectedPiece.dataset.pieceSymbol;
                    currentCell.dataset.hasMoved = 'true'; 
                    
                    selectedPiece.innerHTML = '';
                    delete selectedPiece.dataset.pieceColor;
                    delete selectedPiece.dataset.pieceSymbol;
                    delete selectedPiece.dataset.hasMoved; 
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;

                    // castle execution
                    // If the King just moved 2 squares
                    if (pieceSymbol.toLowerCase() === 'k' && Math.abs(selectedCol - targetCol) === 2) {
                        const isKingside = targetCol > selectedCol; // right or left?
                        const rookStartCol = isKingside ? 7 : 0;
                        const rookEndCol = isKingside ? targetCol - 1 : targetCol + 1; // Put Rook next to King
                        
                        const oldRookCell = rows[targetRow].querySelectorAll('td')[rookStartCol];
                        const newRookCell = rows[targetRow].querySelectorAll('td')[rookEndCol];
                        
                        // tp the rook
                        newRookCell.innerHTML = oldRookCell.innerHTML;
                        newRookCell.dataset.pieceColor = oldRookCell.dataset.pieceColor;
                        newRookCell.dataset.pieceSymbol = oldRookCell.dataset.pieceSymbol;
                        newRookCell.dataset.hasMoved = 'true';
                        
                        oldRookCell.innerHTML = '';
                        delete oldRookCell.dataset.pieceColor;
                        delete oldRookCell.dataset.pieceSymbol;
                        delete oldRookCell.dataset.hasMoved;
                    }

                    // Pawn Promotion
                    if (currentCell.dataset.pieceSymbol === 'P' && targetRow === 0) {
                        currentCell.dataset.pieceSymbol = 'Q';
                        currentCell.innerHTML = `<img src="${pieces['Q']}" style="width: 45px; height: 45px; pointer-events: none;">`;
                    } 
                    else if (currentCell.dataset.pieceSymbol === 'p' && targetRow === 7) {
                        currentCell.dataset.pieceSymbol = 'q';
                        currentCell.innerHTML = `<img src="${pieces['q']}" style="width: 45px; height: 45px; pointer-events: none;">`;
                    }

                    runTimer();
                    switchTurn();
                    turnDisplay.textContent = `Current Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;

                } else if (currentCell.innerHTML !== '') {
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