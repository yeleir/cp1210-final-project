// Setup 
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
let selectedPeice = null;

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.board tr:not(:first-child)');
    initialBoard.forEach((rowData, rowIndex) => {
        const cells = rows[rowIndex].querySelectorAll('td');
        rowData.forEach((pieceSymbol, colIndex) => {
            const currentCell = cells[colIndex];
            cells[colIndex].textContent = pieces[pieceSymbol];
            cells[colIndex].style.fontSize = '45px';
            cells[colIndex].style.textAlign = 'center';
            cells[colIndex].style.cursor = 'pointer'; 
            
            // Move pieces
            currentCell.addEventListener('click', () => {
                const hasPeice = currentCell.textContent !== "";
                if (selectedPeice && currentCell !== selectedPeice){
                    currentCell.textContent = selectedPeice.textContent;
                    selectedPeice.textContent="";
                    selectedPeice.classList.remove('selected');
                    selectedPeice = null;
                }
                if (hasPeice) {
                    if (selectedPeice) {
                        selectedPeice.classList.remove('selected');

                    }
                    selectedPeice = currentCell
                    currentCell.classList.add('selected');
                }
            })
        });
    });
});
