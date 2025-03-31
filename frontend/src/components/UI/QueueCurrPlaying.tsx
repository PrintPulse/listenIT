import React, { FC, useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import AudioPlayer from './AudioPlayer';
import { IRadioItem } from '../../types';

interface IQueueCurrPlayingProps {
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   currentTrack?: string;
   onTrackChange: (track: string) => void;
   queueList: IRadioItem[];
};

const QueueCurrPlaying: FC<IQueueCurrPlayingProps> = ({ isPlaying, onPlayingChange, currentTrack, onTrackChange, queueList }) => {
   const [currIndex, setCurrIndex] = useState<number>(0);
   const bgContext = useContext(BackgroundContext);

   useEffect(() => {
      if (queueList.length > 0) {
         onTrackChange(queueList[currIndex].name);
      }
   }, [queueList, currIndex]);

   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }

   const { setIsBgYellow } = bgContext;

   const playNext = () => {
      if (currIndex < queueList.length - 1) {
         setCurrIndex(currIndex + 1);
         setIsBgYellow((prev: boolean) => !prev);
      }
   };

   const playPrev = () => {
      if (currIndex > 0) {
         setCurrIndex(currIndex - 1);
         setIsBgYellow((prev: boolean) => !prev);
      }
   };

   const currRadio = queueList[currIndex];

   return (
      <>
         <div className='queue'>
            <div className='queue__curr-playing'>
               <h3 className='queue__title'>Сейчас играет:</h3>
               {currRadio ? (
                  <div className='queue__curr-playing__item'>
                     <p className='queue__curr-playing__url'>{currRadio.source}</p>
                     <AudioPlayer streamUrl={currRadio.source} isPlaying={isPlaying} onPlayingChange={onPlayingChange}/>
                  </div>
               ) : (
                  <p className='queue__curr-playing__warning'>Нет текущей станции</p>
               )}
               <div className='queue__curr-playing__controller'>
                  <button onClick={ playPrev } className='queue__curr-playing__button queue__curr-playing__button--prev'></button>
                  <button onClick={ playNext } className='queue__curr-playing__button queue__curr-playing__button--next'></button>
               </div>
            </div>
         </div>
      </>
   )
};

export default QueueCurrPlaying;