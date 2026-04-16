 
const pieces = {
    r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟', // Black pieces
    R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙', // White pieces
    '': '' // Empty square
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // 8 (Black side)
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // 7
    ['', '', '', '', '', '', '', ''], // 6
    ['', '', '', '', '', '', '', ''], // 5
    ['', '', '', '', '', '', '', ''], // 4
    ['', '', '', '', '', '', '', ''], // 3
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 2
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] // 1 (White side)
];

// Move pieces
let selectedPiece = null;
let currentTurn = 'white';

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
                // add color tag to html cell
                currentCell.dataset.pieceColor = pieceColor;
            }
            
            // move pieces
            currentCell.addEventListener('click', () => {
                
                if (selectedPiece) {
                    
                    // If square clicked has a piece of own color, switch instead of eating it
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece.classList.remove('selected');
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                        return; // return so we dont end move
                    }
                    
                    // 1. Move piece/color tag
                    currentCell.textContent = selectedPiece.textContent;
                    currentCell.dataset.pieceColor = selectedPiece.dataset.pieceColor;
                    
                    // 2. Erase old piece completely
                    selectedPiece.textContent = '';
                    delete selectedPiece.dataset.pieceColor; 
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;

                    // 3. Swap turns
                    if (currentTurn === 'white') {
                        currentTurn = 'black';
                    } else {
                        currentTurn = 'white';
                    }
                    
                    // 4. Update the header 
                    turnDisplay.textContent = `Current Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;
                    
                } 
                else if (currentCell.textContent !== '') {
                    
                    // Only let them pick up if the piece color matches the current turn
                    if (currentCell.dataset.pieceColor === currentTurn) {
                        selectedPiece = currentCell;
                        currentCell.classList.add('selected');
                    }
                }
            });
        });
    });
});