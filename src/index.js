// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './index.css'; // Your CSS file
import App from './App';
import reportWebVitals from './reportWebVitals';

// Find the root element in the DOM
const rootElement = document.getElementById('root');

// Check if the root element exists
if (rootElement) {
  // Create a root and render the App component
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Make sure you have a <div id='root'></div> in your index.html.");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


