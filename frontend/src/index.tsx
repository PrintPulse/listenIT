import React from 'react';
import ReactDOM from 'react-dom/client';
// import './mocks/apiMock';
import App from './App';
import { BackgroundProvider } from './context/BackgroundContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);

root.render(
   <AuthProvider>
      <BackgroundProvider>
         <App />
      </BackgroundProvider>
   </AuthProvider>
);