class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'O';
        this.gameActive = true;
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restart');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.cellClicked(index));
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    cellClicked(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;

        if (this.checkWinner()) {
            this.statusDisplay.textContent = `${this.currentPlayer === 'O' ? 'You' : 'Enemy'} wins!`;
            this.gameActive = false;
            return;
        }

        if (this.isDraw()) {
            this.statusDisplay.textContent = "It's a tie!";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = 'X';
        this.statusDisplay.textContent = 'Enemy is thinking...';
        setTimeout(() => this.computerMove(), 500);
    }

    computerMove() {
        const bestMove = this.findBestMove();
        this.board[bestMove] = 'X';
        this.cells[bestMove].textContent = 'X';

        if (this.checkWinner()) {
            this.statusDisplay.textContent = 'Enemy wins!';
            this.gameActive = false;
            return;
        }

        if (this.isDraw()) {
            this.statusDisplay.textContent = "It's a tie!";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = 'O';
        this.statusDisplay.textContent = 'Your turn';
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    isDraw() {
        return this.board.every(cell => cell !== '');
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                let score = this.minimax(this.board, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    minimax(board, isMaximizing) {
        const result = this.checkGameState(board);
        if (result !== null) return result;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkGameState(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === 'X' ? 1 : -1;
            }
        }

        return board.every(cell => cell !== '') ? 0 : null; // Return 0 for draw, null for ongoing game
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'O';
        this.gameActive = true;
        this.cells.forEach(cell => cell.textContent = '');
        this.statusDisplay.textContent = 'Your turn';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
