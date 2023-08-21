function createPlayer(name, marker) {
    return {name, marker};
}

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
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1
    }

    function checkForWin(playerMarker) {
        for (const combination of winningCombinations) {
            if (combination.every(index => gameBoard[index] === playerMarker)) {
                return true;
            }
        }
        return false; 
    }

    function checkForTie() {
        return gameBoard.every(cell => cell !== '');
    }


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

    const playerModule = gameModule;
    const gameBoard = playerModule.getGameBoard();
    const players = playerModule.getPlayers();

    function handleSquareClick(event) {
        const cellIndex = parseInt(event.target.dataset.cellIndex);
        console.log("Current Player:", playerModule.getCurrentPlayer());
        
        if(gameBoard[cellIndex] === '') {
            gameBoard[cellIndex] = players[playerModule.getCurrentPlayer()-1].marker;
            renderGameBoard();
            
            if (playerModule.checkForWin(players[playerModule.getCurrentPlayer() - 1].marker)) {
                gameStatus.textContent = players[playerModule.getCurrentPlayer()-1].name + ' wins!';
            }
            else if (playerModule.checkForTie()){
                gameStatus.textContent = 'It\'s a tie!';
            }
            else {
                playerModule.switchPlayer();
                gameStatus.textContent = 'Player\'s Turn: ' + players[playerModule.getCurrentPlayer()-1].name;
            }
            
        }
    }

    function renderGameBoard() {
        squares.forEach((square, index) =>{
            square.textContent = gameBoard[index];
        })
    }

    squares.forEach(square => {
        square.addEventListener('click', handleSquareClick);
    })

    restartButton.addEventListener('click', function(){
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = '';
        }
    
        renderGameBoard();
    
        squares.forEach(square => {
            square.textContent = '';
        })
        gameStatus.textContent = 'Player\'s Turn: ' + players[0].name;
    });
    
    renderGameBoard();
  });