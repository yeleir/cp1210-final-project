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
        secondString = "0" + seconds;
    } else {
        secondString = seconds;
    }

    return minutes + ":" + secondString;
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
    const turnDisplay = document.getElementById('turn-display');

    initialBoard.forEach((rowData, rowIndex) => {
        const cells = rows[rowIndex].querySelectorAll('td');

        rowData.forEach((pieceSymbol, colIndex) => {
            const currentCell = cells[colIndex];

            currentCell.textContent = pieces[pieceSymbol];
            currentCell.style.fontSize = '45px';
            currentCell.style.textAlign = 'center';
            currentCell.style.cursor = 'pointer';

            if (pieceSymbol !== '') {
                let pieceColor = '';

                if (pieceSymbol === pieceSymbol.toUpperCase()) {
                    pieceColor = 'white';
                } else {
                    pieceColor = 'black';
                }

                currentCell.dataset.pieceColor = pieceColor;
            }

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
                    switchTurn();

                    if (currentTurn === "white") {
                        turnDisplay.textContent = "Current Turn: White";
                    } else {
                        turnDisplay.textContent = "Current Turn: Black";
                    }

                } else if (currentCell.textContent !== '') {

                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                    }
                }
            });
        });
    });

    updateClocks();
});