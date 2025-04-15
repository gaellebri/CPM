import React, { useState } from 'react';

function EpisodeDetailsForm({ onSubmit }) {
  const [episodeName, setEpisodeName] = useState('');
  const [brand, setBrand] = useState('');
  const [series, setSeries] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      episodeName,
      brand,
      series,
      keywords,
      description
    });
  };

  return (
    <div className="episode-details-form">
      <h2>Détails de l'épisode</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="episodeName">Nom de l'épisode *</label>
          <input
            type="text"
            id="episodeName"
            value={episodeName}
            onChange={(e) => setEpisodeName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marque / Entreprise *</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="series">Série / Thématique</label>
          <input
            type="text"
            id="series"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Mots-clés SEO (séparés par des virgules)</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description brève</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Continuer vers la génération
        </button>
      </form>
    </div>
  );
}

export default EpisodeDetailsForm;