document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    const descriptionBox = document.getElementById('description-box');
    const closeBtn = document.getElementById('close-btn');
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const playGameBtn = document.getElementById('play-game-btn');
    const changeAssetsBtn = document.getElementById('change-assets-btn');

    const gameDescriptions = {
        "Tic-Tac-Toe": "A classic game of Xs and Os.",
        "Connect 4": "Connect four discs in a row to win.",
        "Concentration": "Test your memory by matching pairs of cards."
    };

    const gameURLs = {
        "Tic-Tac-Toe": "games/tic-tac-toeHTML/tic-tac-toe.html",
        "Connect 4": "games/Xonnect4HTML/Xonnect4.html",
        "Concentration": "games/concentrationHTML/concentration.html"
    };

    // Show description box on game card click
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameName = card.dataset.game;
            gameTitle.textContent = gameName;
            gameDescription.textContent = gameDescriptions[gameName] || "No description available.";
            playGameBtn.dataset.game = gameName; 
            descriptionBox.classList.remove('hidden');
            descriptionBox.classList.add('visible');
        });
    });
    

    // Close button click
    closeBtn.addEventListener('click', () => {
        descriptionBox.classList.remove('visible');
        descriptionBox.classList.add('hidden');
    });

    // Play game button click
    playGameBtn.addEventListener('click', () => {
        const gameName = playGameBtn.dataset.game;
        const gameURL = gameURLs[gameName];
        if (gameURL) {
            window.location.href = `game.html?game=${encodeURIComponent(gameURL)}`;
        } else {
            alert("Game not available.");
        }
    });

    // Change Assets button click
    changeAssetsBtn.addEventListener('click', () => {
        const gameName = playGameBtn.dataset.game; // Get the current game name
        if (gameName) {
            // Redirect to assets.html with the game name
            window.location.href = `assets.html?game=${encodeURIComponent(gameName)}`;
        } else {
            alert("No game selected.");
        }
    });
});