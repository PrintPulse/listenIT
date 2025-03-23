import React, { FC, useState, useCallback, useContext, useEffect } from 'react';
import Circles from '../components/layout/Circles';
import Casette from '../components/UI/Casette';
import { Upload } from 'lucide-react';
import { RadioPlayer } from '../components/UI/RadioPlayer';
import { StationList } from '../components/UI/StationList';
import type { RadioStation, RadioState } from '../types';
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
   const [radioState, setRadioState] = useState<RadioState>({
      currentStation: null,
      stations: [],
      isPlaying: false,
      volume: 0.5,
   });
   const [queueState, setQueueState] = useState<IQueueState | null>(null);

   useEffect(() => {
      checkUserStatus();
   }, []);

   const handleImport = useCallback(() => {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
         const file = (e.target as HTMLInputElement).files?.[0];
         if (file) {
            const text = await file.text();

            try {
               const imported = JSON.parse(text);
               setRadioState(prev => ({
               ...prev,
               stations: [...prev.stations, ...imported]
               }));
            } 
            catch (err) {
               alert('Invalid JSON file');
            }
         }
      };
      input.click();
   }, []);

   const handleSelectStation = (station: RadioStation) => {
      setRadioState(prev => ({
      ...prev,
      currentStation: station,
      isPlaying: true
      }));
   };

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
      <>
         <Circles />
         <div className='radio-import'>
            <button onClick={handleImport} className="radio-import__button--import">
               <Upload size={20} />
               Import Stations
            </button>
         </div>
         <>
            {radioState.stations.length === 0 ? (
               <div className="radio-empty">
               <p className="radio-empty__text">No radio stations added yet</p>
               <p className='radio-empty__text'>Import your stations using the button above</p>
               </div>
            ) : (
               <StationList stations={radioState.stations} currentStation={radioState.currentStation} onSelectStation={handleSelectStation} />
            )}
         </>
         <RadioPlayer station={radioState.currentStation} isPlaying={radioState.isPlaying} volume={radioState.volume} onPlayPause={ () => setRadioState(prev => ({ ...prev, isPlaying: !prev.isPlaying })) } onVolumeChange={ (volume) => setRadioState(prev => ({ ...prev, volume })) } />
         <Casette onLinkChange={handleLinkChange}/>
         {!isAuthed && isAuthModalOpen &&
            <AuthModal onSuccess={handleAuthSuccess} />
         }
         <Queue queueItem={queueState} />
      </>
   );
};

export default MainPage;