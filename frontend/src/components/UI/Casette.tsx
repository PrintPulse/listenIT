import React, { FC, ReactNode, useState, useEffect } from 'react';
import { IRadioItem } from '../../types';
import { radioService } from '../../services/radioService';
import audiocasette from '../../images/audiocasette.png';
import './Casette.scss';

interface ICasetteProps {
   children: ReactNode;
   isPlaying: boolean;
   currentTrack?: string;
   onRadioStationsUpdate: (stations: IRadioItem[]) => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const Casette: FC<ICasetteProps> = ({ children, isPlaying, currentTrack, onRadioStationsUpdate, handleSnackbarMsg, handleSnackbarType }) => {
   const [cassetteColor, setCassetteColor] = useState<string>('#ffffff');

   useEffect(() => {
      const loadRadioStations = async () => {
         const result = await radioService.getRadio()
   
         if (result?.error) {
            handleSnackbarMsg(result.error);
            handleSnackbarType('error');
            return;
         }
         
         onRadioStationsUpdate(result.stations);
      };   

      loadRadioStations();
   }, []);

   useEffect(() => {
      if (currentTrack) {
         setCassetteColor(getColorFromTrack(currentTrack));
      }
   }, [currentTrack]);

   const getColorFromTrack = (track: string | undefined) => {
      if (!track) return '#ffffff';
      const hash = track.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
   };

   return (
      <>
         <main className='main' data-testid='main'>
            <div className="main__top">
               <h2 className="main__title">listen!</h2>
            </div>
            <div className="main__bottom" style={{ '--cassette-color': cassetteColor } as React.CSSProperties}>
            <img src={ audiocasette } className="main__image" alt='vintage audio cassette tape' draggable={false}/>               
            <div className={`main__reel main__reel--left ${isPlaying ? 'spin' : ''}`}></div>
               <div className={`main__reel main__reel--right ${isPlaying ? 'spin' : ''}`}></div>
               <div className="main__inner">
                  {children}
               </div>
            </div>
         </main>
      </>
   )
};

export default Casette;