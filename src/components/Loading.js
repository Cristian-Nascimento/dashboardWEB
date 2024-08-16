// src/components/Loading.js
import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Await: Loading resources</p>
      </div>
    </div>
  );
};

export default Loading;
