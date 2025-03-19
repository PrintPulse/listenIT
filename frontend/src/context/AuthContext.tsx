import React, { createContext, FC, ReactNode, useState } from 'react';

interface IAuthContext {
   isAuthed: boolean;
   setIsAuthed: (isAuthed: boolean) => void;
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider: FC<{ children: ReactNode}> = ({ children }) => {
   const [isAuthed, setIsAuthed] = useState<boolean>(false);

   return (
      <AuthContext.Provider value={{ isAuthed, setIsAuthed }}>
         {children}
      </AuthContext.Provider>
   )
};

export { AuthContext, AuthProvider };