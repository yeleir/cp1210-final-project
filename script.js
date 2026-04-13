/* Setup */
// Unicode characters for chess pieces
const pieces = {
    r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟', // Black pieces
    R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙', // White pieces
    '': '' // Empty square
};
// The starting position of a chess game
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Rank 8 (Black)
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Rank 7 (Black Pawns)
    ['', '', '', '', '', '', '', ''], // Rank 6
    ['', '', '', '', '', '', '', ''], // Rank 5
    ['', '', '', '', '', '', '', ''], // Rank 4
    ['', '', '', '', '', '', '', ''], // Rank 3
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Rank 2 (White Pawns)
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] // Rank 1 (White)
];

// Wait for the HTML to load before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Grab all the rows in the table EXCEPT the first one (which has the A-H labels)
    const rows = document.querySelectorAll('.board tr:not(:first-child)');
    // Loop through the JS array and put the pieces into the HTML table cells
    initialBoard.forEach((rowData, rowIndex) => {
        // Grab the cells in this specific row EXCEPT the first one (which has the 1-8 labels)
        const cells = rows[rowIndex].querySelectorAll('td');
        rowData.forEach((pieceSymbol, colIndex) => {
            // Apply the piece to the HTML, making it nice and big
            cells[colIndex].textContent = pieces[pieceSymbol];
            cells[colIndex].style.fontSize = '35px';
            cells[colIndex].style.textAlign = 'center';
            cells[colIndex].style.cursor = 'pointer'; // Changes mouse to a hand when hovering
        });
    });
});
