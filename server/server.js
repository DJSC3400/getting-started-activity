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

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // session key
    resave: false,
    saveUninitialized: true,
  })
);

// multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// function to find .html files recursively
// function findHtmlFile(directory) {
//   const files = fs.readdirSync(directory, { withFileTypes: true });
//   for (const file of files) {
//     const fullPath = path.join(directory, file.name);
//     if (file.isFile() && file.name.endsWith(".html")) {
//       return fullPath; // Return the full path to the .html file
//     } else if (file.isDirectory()) {
//       const found = findHtmlFile(fullPath); // Recursively search subdirectories
//       if (found) return found;
//     }
//   }
//   return null; // No .html file found
// }

// Route to handle file upload
app.post("/upload", upload.single("gameZip"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const sessionId = req.session.id;
  const sessionGamesPath = path.join(__dirname, "../client/games", sessionId);

  // Create a session-specific folder if it doesn't exist
  if (!fs.existsSync(sessionGamesPath)) {
    fs.mkdirSync(sessionGamesPath, { recursive: true });
  }

  // Extract the uploaded .zip file
  const zip = new AdmZip(req.file.path);
  zip.extractAllTo(sessionGamesPath, true);

  // delete the uploaded .zip file after extraction
  fs.unlinkSync(req.file.path);

  // get the relative path to the .html file
  const relativeHtmlPath = path.relative(path.join(__dirname, "../client/games"), htmlFilePath);

  // debug
  console.log(`Extracted files for session ${sessionId}:`);
  console.log(fs.readdirSync(sessionGamesPath));

  res.status(200).json({
    message: "Game uploaded and extracted successfully!",
    sessionId: sessionId,
    htmlFile: relativeHtmlPath, 
  });
});

// start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});