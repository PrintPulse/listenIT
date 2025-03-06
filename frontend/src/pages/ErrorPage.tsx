import React, { FC } from 'react';
import { DataProvider } from '../context/DataContext';
import Circles from '../components/layout/Circles';
import { Link } from 'react-router-dom';

const ErrorPage: FC = () => {
  return (
    <DataProvider>
        <Circles />
        <main className='main--error'>
            <h2 className="main--error__title">Ошибка, запрашиваемая страница не найдена</h2>
            <Link to='/' className='main--error__link'>Вернуться на главную страницу</Link>
        </main>
    </DataProvider>
  )
}

export default ErrorPage;