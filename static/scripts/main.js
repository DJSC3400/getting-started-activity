document.addEventListener("DOMContentLoaded", () => {
    const addGameCard = document.querySelector(".add-game-card");
    const fileInput = document.querySelector("#file-upload");
    const gameGrid = document.getElementById("game-grid");

    addGameCard.addEventListener("click", () => {
        fileInput.click(); // file input click
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/zip") {
            const formData = new FormData();
            formData.append("gameZip", file);

            // send file to the server
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message);

                    // add the new game card
                    const gameName = file.name.replace(".zip", "").replace(/-/g, " ");
                    const sessionId = data.sessionId; // Get the session ID from the server response
                    const newGameCard = document.createElement("div");
                    newGameCard.classList.add("game-card");
                    newGameCard.dataset.game = gameName;

                    const gameImage = document.createElement("img");
                    gameImage.src = "images/placeholder.jpg"; // Placeholder image
                    gameImage.alt = gameName;

                    const gameTitle = document.createElement("h2");
                    gameTitle.textContent = gameName;

                    newGameCard.appendChild(gameImage);
                    newGameCard.appendChild(gameTitle);

                    // click event to play game
                    newGameCard.addEventListener("click", () => {
                        // make sure the game html is -> (index.html)
                        window.location.href = `game.html?game=games/${sessionId}/${gameName}/index.html`;
                    });

                    gameGrid.appendChild(newGameCard);
                })
                .catch((error) => {
                    console.error("Error uploading game:", error);
                    alert("Failed to upload the game.");
                });
        } else {
            alert("Please upload a valid .zip file."); //make sure that the uploaded file is a zip file
        }
    });
});