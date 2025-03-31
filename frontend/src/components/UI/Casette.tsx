import React, { FC, ReactNode, useEffect } from 'react';
import { IRadioItem } from '../../types';
import { radioService } from '../../services/radioService';
import audocassete from '../../images/audiocassete.png';
import './Casette.scss';

interface ICasetteProps {
   children: ReactNode;
   isPlaying: boolean;
   currentTrack?: string;
   radioStations: IRadioItem[];
   onRadioStationsUpdate: (stations: IRadioItem[]) => void;
};

const Casette: FC<ICasetteProps> = ({ children, isPlaying, currentTrack, radioStations, onRadioStationsUpdate }) => {

   useEffect(() => {
      const loadRadioStations = async () => {
         const result = await radioService.getRadio()
   
            if (result?.error) {
               return result.error;
            }
            else {
               onRadioStationsUpdate(result.stations);
            }
      };   

      loadRadioStations();
   }, []);

   const getColorFromTrack = (track: string | undefined) => {
      if (!track) return '#ffffff';
      const hash = track.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
   };

   const cassetteColor = getColorFromTrack(currentTrack);

   return (
      <>
         <main className='main' test-dataid='main'>
            <div className="main__top">
                  <h2 className="main__title">listen!</h2>
            </div>
            <div className="main__bottom" style={{ '--cassette-color': cassetteColor } as React.CSSProperties}>
               <img src={ audocassete } className="main__image" alt='vintage audio cassette tape' draggable={false}/>
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