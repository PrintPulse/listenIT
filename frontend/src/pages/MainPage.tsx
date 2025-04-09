import React, { FC, useState, useContext, useEffect, useCallback } from 'react';
import Circles from '../components/layout/Circles';
import Casette from '../components/UI/Casette';
import { AuthContext } from '../context/AuthContext';
import { isUserAuthed } from '../services/authService';
import AuthModal from '../components/UI/AuthModal';
import QueueCurrPlaying from '../components/UI/QueueCurrPlaying';
import QueueList from '../components/UI/QueueList';
import { IRadioItem } from '../types';
import Snackbar from '../components/UI/Snackbar';

const MainPage: FC = () => {
   const { isAuthed: contextIsAuthed, setIsAuthed } = useContext(AuthContext) || { isAuthed: false, setIsAuthed: () => {} };
   const [isAuthed, setLocalIsAuthed] = useState<boolean>(contextIsAuthed);
   const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(!isAuthed);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [currentTrack, setCurrentTrack] = useState<string>('');
   const [currentSource, setCurrentSource] = useState<'queue' | 'favorites'>('queue');
   const [radioStations, setRadioStations] = useState<IRadioItem[]>([]);
   const [likedItems, setLikedItems] = useState<IRadioItem[]>([]);
   const [snackbarMsg, setSnackbarMsg] = useState<string>('');
   const [snackbarType, setSnackbarType] = useState<"error" | "success" | null>(null);

   useEffect(() => {
      const checkAuth = async () => {
         const token = localStorage.getItem('token');
         if (token) {
            const response = await isUserAuthed(token);

            if (response?.is_active) {
               setIsAuthed(true);
               setLocalIsAuthed(true);
               setAuthModalOpen(false);
            } 
            else {
               localStorage.removeItem('token');
               setIsAuthed(false);
               setLocalIsAuthed(false);
               setAuthModalOpen(true);
            }
         }
      };
      
      checkAuth().catch(() => {
         localStorage.removeItem('token');
         setIsAuthed(false);
         setLocalIsAuthed(false); 
         setAuthModalOpen(true);
      });
   }, [setIsAuthed]);

   useEffect(() => {
      setLocalIsAuthed(contextIsAuthed);
   }, [contextIsAuthed]);

   const handleAuthSuccess = () => {
      setAuthModalOpen(false);
   };

   const handleTrackChange = useCallback((track: string, fromFavorites?: boolean) => {
      setCurrentTrack(track);
      setCurrentSource(fromFavorites ? 'favorites' : 'queue');
      setIsPlaying(true);
   }, []);

   const handleSnackbarMsg = (msg: string) => {
      setSnackbarMsg(msg);
   };

   const handleSnackbarType = (type: "error" | "success" | null) => {
      setSnackbarType(type);
   };

   return (
      <>
         <div className='container'>
            <Circles />
            {isAuthed && radioStations &&
               <QueueList queue={radioStations} currTrack={currentTrack} onTrackChange={handleTrackChange} currentSource={currentSource} onRadioStationsUpdate={setRadioStations} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType} />
            }
            {!isAuthed && isAuthModalOpen &&
               <AuthModal onSuccess={handleAuthSuccess} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType} />
            }
            {isAuthed &&
               <Casette isPlaying={isPlaying} currentTrack={currentTrack} onRadioStationsUpdate={setRadioStations}
                  handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType}
               >
                  <QueueCurrPlaying isPlaying={isPlaying} onPlayingChange={setIsPlaying} currentTrack={currentTrack} onTrackChange={setCurrentTrack} 
                     queueList={radioStations} favoritesList={likedItems} currentSource={currentSource} onSourceChange={setCurrentSource} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType}
                  />
               </Casette>
            }
         </div>
         <Snackbar type={snackbarType} message={snackbarMsg} />
      </>
   );
};

export default MainPage;