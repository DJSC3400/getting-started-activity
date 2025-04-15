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

            const uploadUrl = "/upload";
            const options = {
                method: "POST",
                body: formData,
            };

            fetch(uploadUrl, options)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Server response:", data); // Log the server response

                    if (!data.sessionId) {
                        throw new Error("Missing sessionId in server response");
                    }

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

                    if (!gameGrid) {
                        throw new Error("gameGrid is not defined or accessible");
                    }

                    gameGrid.appendChild(newGameCard);
                    console.log("Game card successfully created and added to the grid.");
                })
                .catch((error) => {
                    console.error("Error uploading game:", error);
                    alert(`Failed to upload the game. Details: ${error.message}`);
                });
        } else {
            alert("Please upload a valid .zip file."); //make sure that the uploaded file is a zip file
        }
    });
});