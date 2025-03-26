import React, { FC, useState, useContext, useEffect } from 'react';
import Circles from '../components/layout/Circles';
import Casette from '../components/UI/Casette';
import { AuthContext } from '../context/AuthContext';
import { isUserAuthed } from '../services/authService';
import AuthModal from '../components/UI/AuthModal';
import Queue from '../components/UI/Queue';

interface IQueueState {
   id: number;
   url: string;
};

const MainPage: FC = () => {
   const currAuthContext = useContext(AuthContext) || { isAuthed: false};
   const [isAuthed, setIsAuthed] = useState<boolean>(currAuthContext.isAuthed);
   const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(!isAuthed);
   const [queueState, setQueueState] = useState<IQueueState | null>(null);

   useEffect(() => {
      checkUserStatus();
   }, []);

   const checkUserStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
         isUserAuthed(token)
            .then(() => setIsAuthed(true))
            .catch(error => { setIsAuthed(false); throw new Error(`${error.messsage}`) })
      }
      else {
         setIsAuthed(false);
      }
   };

   const handleAuthSuccess = () => {
      setAuthModalOpen(false);
   };

   const handleLinkChange = (link: string) => {
      setQueueState({ id: Date.now(), url: link });
   };

   return (
      <div className='container'>
         <Circles />
         <Casette onLinkChange={handleLinkChange}>
            <Queue queueItem={queueState} />
         </Casette>
         {isAuthed && isAuthModalOpen &&
            <AuthModal onSuccess={handleAuthSuccess} />
         }
      </div>
   );
};

export default MainPage;