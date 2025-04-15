import './App.css';
import React, { useState } from 'react';
import logo from './logo.svg';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [episodeDetails, setEpisodeDetails] = useState({
    episodeName: '',
    brand: '',
    series: '',
    keywords: '',
    description: ''
  });
  const [isTranscriptionComplete, setIsTranscriptionComplete] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEpisodeDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Veuillez d\'abord sélectionner un fichier audio');
      return;
    }
    
    // Vérifier si les champs obligatoires sont remplis
    if (!episodeDetails.episodeName || !episodeDetails.brand) {
      alert('Veuillez remplir les champs obligatoires: Nom de l\'épisode et Marque/Entreprise');
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', file);
    
    try {
      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la transcription');
      }
      
      const data = await response.json();
      setTranscription(data.transcription);
      setIsTranscriptionComplete(true);
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    // Fonction pour générer le contenu (à implémenter à l'étape suivante)
    console.log("Génération avec les détails:", episodeDetails);
    console.log("Et la transcription:", transcription);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="logo" alt="Le Repère des collab logo" />
        
        <div className="title-container">
          <h1>Le Repère des collab</h1>
        </div>
        
      </header>
      
      <main>
        <div className="content-container">
          {/* Section d'upload et formulaire */}
          <div className="upload-form-section">
            {/* Sélection de fichier */}
            <div
              className="upload-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <h2>1. Téléchargez votre fichier audio</h2>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
              />
              {file && <p>Fichier sélectionné : {file.name}</p>}
            </div>
            
            {/* Formulaire de détails */}
            <div className="episode-details-form">
              <h2>2. Entrez les détails de l'épisode</h2>
              
              <div className="form-group">
                <label htmlFor="episodeName">Nom de l'épisode *</label>
                <input
                  type="text"
                  id="episodeName"
                  name="episodeName"
                  value={episodeDetails.episodeName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand">Marque / Entreprise *</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={episodeDetails.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="series">Série / Thématique</label>
                <input
                  type="text"
                  id="series"
                  name="series"
                  value={episodeDetails.series}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="keywords">Mots-clés SEO (séparés par des virgules)</label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={episodeDetails.keywords}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description brève</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={episodeDetails.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            
            {/* Bouton de transcription */}
            <div className="action-section">
              <h2>3. Lancez la transcription</h2>
              <button
                onClick={handleUpload}
                disabled={!file || isLoading || !episodeDetails.episodeName || !episodeDetails.brand}
                className="transcribe-button"
              >
                {isLoading ? 'Transcription en cours...' : 'Transcrire le fichier'}
              </button>
            </div>
          </div>
          
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="loading-section">
              <p>Transcription en cours... Cela peut prendre quelques minutes.</p>
              {/* Ici vous pourriez ajouter un spinner ou une barre de progression */}
            </div>
          )}
          
          {/* Section de résultats (après transcription) */}
          {isTranscriptionComplete && (
            <div className="results-section">
              <h2>Transcription terminée</h2>
              
              <div className="transcription-result">
                <h3>Aperçu de la transcription :</h3>
                <p>{transcription.substring(0, 300)}...</p>
                <details>
                  <summary>Voir la transcription complète</summary>
                  <div className="full-transcription">
                    <p>{transcription}</p>
                  </div>
                </details>
              </div>
              
              <div className="generation-section">
                <h3>Prêt à générer le contenu</h3>
                <p>Les contenus seront générés pour : <strong>{episodeDetails.episodeName}</strong></p>
                
                <button 
                  onClick={handleGenerate}
                  className="generate-button"
                >
                  Générer les contenus
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;