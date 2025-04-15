const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
console.log('OPENAI_API_KEY présente :', !!process.env.OPENAI_API_KEY);

const app = express();
const port = 8000;

// Configuration de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Configuration de multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Assurez-vous que le dossier uploads existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Route pour la transcription audio
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    console.log('Fichier reçu:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier audio n\'a été téléchargé' });
    }
    
    const filePath = req.file.path;
    
    // Utiliser l'API Whisper pour la transcription
    console.log('Début de la transcription avec Whisper...');
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "fr", // Spécifiez "fr" pour le français
      response_format: "text" // Options: json, text, srt, verbose_json, ou vtt
    });
    
    console.log('Transcription terminée');
    
    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ transcription });
  } catch (error) {
    console.error('Erreur lors de la transcription:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});