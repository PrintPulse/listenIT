import React from 'react';
import ReactDOM from 'react-dom/client';
// import './mocks/apiMock';
import App from './App';
import { BackgroundProvider } from './context/BackgroundContext';
import { AuthProvider } from './context/AuthContext';
import { OrientationCheck } from 'components/layout/OrientationCheck';

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);

root.render(
   <AuthProvider>
      <BackgroundProvider>
         <OrientationCheck>
            <App />
         </OrientationCheck>
      </BackgroundProvider>
   </AuthProvider>
);