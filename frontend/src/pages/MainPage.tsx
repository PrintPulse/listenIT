import React, { FC, useState, useContext, useEffect } from 'react';
import Circles from '../components/layout/Circles';
import Casette from '../components/UI/Casette';
import { AuthContext } from '../context/AuthContext';
import { isUserAuthed } from '../services/authService';
import AuthModal from '../components/UI/AuthModal';
import QueueCurrPlaying from '../components/UI/QueueCurrPlaying';
import QueueList from '../components/UI/QueueList';
import { IRadioItem } from '../types';
import Snackbar from '../components/UI/Snackbar';
import { ISnackbarMsg } from '../types';

const MainPage: FC = () => {
   const currAuthContext = useContext(AuthContext) || { isAuthed: false};
   const [isAuthed, setIsAuthed] = useState<boolean>(currAuthContext.isAuthed);
   const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(!isAuthed);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [currentTrack, setCurrentTrack] = useState<string>('');
   const [radioStations, setRadioStations] = useState<IRadioItem[]>([]);
   const [snackbarMsg, setSnackbarMsg] = useState<string>('');
   const [snackbarType, setSnackbarType] = useState<"error" | "success" | null>(null);

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

   const handleSnackbarMsg = (msg: string) => {
      setSnackbarMsg(msg);
   };

   const handleSnackbarType = (type: "error" | "success" | null) => {
      setSnackbarType(type);
   };

   return (
      <div className='container'>
         <Snackbar type={snackbarType} message={snackbarMsg} />
         <Circles />
         {currentTrack &&
            <QueueList queue={radioStations} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType} />
         }
         {!isAuthed && isAuthModalOpen &&
            <AuthModal onSuccess={handleAuthSuccess} />
         }
         {isAuthed &&
            <Casette isPlaying={isPlaying} currentTrack={currentTrack} radioStations={radioStations} onRadioStationsUpdate={setRadioStations}
               handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType}
            >
               <QueueCurrPlaying isPlaying={isPlaying} onPlayingChange={setIsPlaying} currentTrack={currentTrack} onTrackChange={setCurrentTrack} 
                  queueList={radioStations} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType}
               />
            </Casette>
         }
      </div>
   );
};

export default MainPage;