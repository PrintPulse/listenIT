import React from 'react';
import { DataProvider } from '../context/DataContext';
import Circles from '../components/layout/Circles';

const ErrorPage = () => {
  return (
    <DataProvider>
        <Circles />
        <main className='main--error'>
            <h2 className="main--error__title">Ошибка, запрашиваемая страница не найдена</h2>
        </main>
    </DataProvider>
  )
}

export default ErrorPage;