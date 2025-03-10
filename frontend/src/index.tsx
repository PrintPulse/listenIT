import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BackgroundProvider } from './context/BackgroundContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <BackgroundProvider>
      <App />
    </BackgroundProvider>
);