import React, { createContext, useState, ReactNode, FC, useContext } from 'react';

interface DataContextType {
    isBgYellow: boolean,
    setIsBgYellow: React.Dispatch<React.SetStateAction<boolean>>
};

interface DataProviderProps {
    children: ReactNode;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: FC<DataProviderProps> = ({ children }) => {
  const [isBgYellow, setIsBgYellow] = useState(true);

  return (
    <DataContext.Provider value={{ isBgYellow, setIsBgYellow }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};