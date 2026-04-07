import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // Temporarily disable StrictMode to prevent double API calls during development
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);