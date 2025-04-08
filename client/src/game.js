document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameURL = urlParams.get('game'); // Get the game URL from the query parameter
    const gameNameElement = document.getElementById('game-name');
    const iframe = document.getElementById('game-iframe');

    if (gameURL) {
        // getting the game name from the file
        const gameName = gameURL
            .split('/')
            .pop()
            .replace('.html', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()); // uppercase the first letter of each word

        // set the header to the game name
        gameNameElement.textContent = gameName;

        // set the iframe to the game url
        iframe.src = gameURL;
    } else {
        gameNameElement.textContent = "Unknown Game";
        iframe.src = "about:blank";
        alert("No game specified.");
    }
});