import React, { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ErrorPage from './pages/ErrorPage';
import './App.css';

const App: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='*' element={<ErrorPage />} />
         </Routes>
      </BrowserRouter>
   );
};

export default App;