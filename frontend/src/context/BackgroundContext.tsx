import React, { createContext, useState, ReactNode, FC } from 'react';

interface IBackgroundContextType {
   isBgYellow: boolean,
   setIsBgYellow: React.Dispatch<React.SetStateAction<boolean>>
};

interface IBackgroundProviderProps {
   children: ReactNode;
};

const BackgroundContext = createContext<IBackgroundContextType | undefined>(undefined);

const BackgroundProvider: FC<IBackgroundProviderProps> = ({ children }) => {
   const [isBgYellow, setIsBgYellow] = useState(true);

   return (
      <BackgroundContext.Provider value={{ isBgYellow, setIsBgYellow }}>
         {children}
      </BackgroundContext.Provider>
   );
};

export { BackgroundContext, BackgroundProvider };