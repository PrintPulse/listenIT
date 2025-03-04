import React, { FC } from 'react';
import { DataProvider } from '../context/DataContext';
import Circles from '../components/layout/Circles';
import Casette from '../components/UI/Casette';

const MainPage: FC = () => {
  return (
    <DataProvider>
        <Circles />
        <Casette />
    </DataProvider>
  )
}

export default MainPage;
