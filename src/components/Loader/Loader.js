// src/components/Loader.jsx

import React from 'react';
import './Loader.css'; // Importa el archivo CSS

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loader-text">Cargando, por favor espere...</div>
    </div>
  );
};

export default Loader;
