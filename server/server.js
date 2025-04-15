import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import AdmZip from "adm-zip";
import session from "express-session";
import fs from "fs";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;
 
console.log(process.cwd());

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../static")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // session key
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/games/:id", function (req, res) {
  // Correct the path to point to /server/games
  const gamePath = path.join(__dirname, "games", req.params.id, "index.html");
  console.log("Resolved game path:", gamePath); // Debugging log

  res.sendFile(gamePath, function (err) {
    if (err) {
      console.error(err);
      res.status(404).send("Game not found");
    }
  });
});

// app.get(/^\/games/(.+)\/(.+)/, function(req, res) {
//   const id = req.params[0];
//   const path = req.params[1];
//   res.sendFile(`/games/${id}/${path}`);

// });

app.use('/games', express.static(path.join(__dirname, 'games')));

app.use('/assets', express.static(path.join(__dirname, '../assets'))); //for assets

// multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// POST /upload route
app.post('/upload', upload.single('gameZip'), (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        console.log('Uploaded file:', req.file);

        // Define the destination directory for the game
        const gameName = req.file.originalname.replace('.zip', '').replace(/-/g, ' ');
        const sessionId = Date.now().toString();
        const gameDir = path.join(__dirname, 'games', sessionId, gameName);

        // Create the game directory if it doesn't exist
        if (!fs.existsSync(gameDir)) {
            fs.mkdirSync(gameDir, { recursive: true });
        }

        // Move the uploaded file to the game directory
        const uploadedFilePath = req.file.path;
        const destinationPath = path.join(gameDir, req.file.originalname);

        fs.renameSync(uploadedFilePath, destinationPath);

        // Extract the .zip file
        const zip = new AdmZip(destinationPath);
        zip.extractAllTo(gameDir, true); // Extract all files to the game directory
        console.log(`Extracted ${req.file.originalname} to ${gameDir}`);

        // Delete the .zip file after extraction
        fs.unlinkSync(destinationPath);

        console.log(`Game uploaded and extracted successfully to ${gameDir}`);
        res.json({ sessionId });
    } catch (error) {
        console.error('Error handling upload:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// route to handle assets upload
app.post('/upload-assets', upload.array('assets'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    const sessionId = req.session.id;
    const sessionAssetsPath = path.join(__dirname, '../client/assets', sessionId);

    // Create a session-specific folder if it doesn't exist
    if (!fs.existsSync(sessionAssetsPath)) {
        fs.mkdirSync(sessionAssetsPath, { recursive: true });
    }

    req.files.forEach(file => {
        const destPath = path.join(sessionAssetsPath, file.originalname);
        fs.renameSync(file.path, destPath);
    });

    res.status(200).json({ message: 'Assets uploaded successfully!' });
});

// start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(process.cwd());
});
