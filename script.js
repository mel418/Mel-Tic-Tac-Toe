// Factory function to create a player object
function createPlayer(name, marker) {
    return {name, marker};
}

// Game module using the revealing module pattern
const gameModule = (function() {
    let currentPlayer = 1;
    const players = [
        {name: 'Player 1', marker: 'X'},
        {name: 'Player 2', marker: 'O'}
    ];
    const gameBoard = ['', '', '', '', '', '', '', '', ''];

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];
    
    // Function to switch between players
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1
    }

    // Function to check for a win based on the player's marker
    function checkForWin(playerMarker) {
        for (const combination of winningCombinations) {
            if (combination.every(index => gameBoard[index] === playerMarker)) {
                return true;
            }
        }
        return false; 
    }

    // Function to check for a tie by examining all cells
    function checkForTie() {
        return gameBoard.every(square => square !== '');
    }

    // Public methods exposed by the game module
    return {
        getCurrentPlayer: function() {
            return currentPlayer;
        },

        getPlayers: function() {
            return players;
        },

        getGameBoard: function() {
            return gameBoard;
        },
        
        switchPlayer: switchPlayer,
        checkForWin: checkForWin,
        checkForTie: checkForTie,
        
    };
})();


document.addEventListener('DOMContentLoaded', function() {
    const squares = document.querySelectorAll('.square');
    const gameStatus = document.getElementById('current-player');
    const restartButton = document.getElementById('restart-btn');

    // Flag to track if the game is over
    let gameOver = false;

    // Initialize the game module and retrieve game data
    const playerModule = gameModule;
    const gameBoard = playerModule.getGameBoard();
    const players = playerModule.getPlayers();

    // Function to handle a square being clicked
    function handleSquareClick(event) {
        if (gameOver) return;

        const cellIndex = parseInt(event.target.dataset.cellIndex);
        console.log("Current Player:", playerModule.getCurrentPlayer());
        
        if(gameBoard[cellIndex] === '') {
            gameBoard[cellIndex] = players[playerModule.getCurrentPlayer()-1].marker;
            event.target.classList.add('marked');
            renderGameBoard();
            
            // Check for win or tie conditions
            if (playerModule.checkForWin(players[playerModule.getCurrentPlayer() - 1].marker)) {
                gameStatus.textContent = players[playerModule.getCurrentPlayer()-1].name + ' wins!';
                gameOver = true;
            }
            else if (playerModule.checkForTie()){
                gameStatus.textContent = 'It\'s a tie!';
                gameOver = true;
            }
            else {
                playerModule.switchPlayer();
                gameStatus.textContent = 'Player\'s Turn: ' + players[playerModule.getCurrentPlayer()-1].name;
            }
            
        }
    }

    // Function to update the displayed game board
    function renderGameBoard() {
        squares.forEach((square, index) =>{
            square.textContent = gameBoard[index];
        })
    }

     // Attach event listeners to each square
    squares.forEach(square => {
        square.addEventListener('click', handleSquareClick);
    })

    // Attach event listener to the restart button
    restartButton.addEventListener('click', function(){
        gameOver = false;
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = '';
        }
    
        renderGameBoard();
    
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('marked');
        })
        gameStatus.textContent = 'Player\'s Turn: ' + players[0].name;
    });
    
    renderGameBoard(); // Initialize the game board display
  });