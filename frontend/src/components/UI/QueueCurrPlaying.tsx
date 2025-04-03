import React, { FC, useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import AudioPlayer from './AudioPlayer';
import { IRadioItem } from '../../types';
import './QueueCurrPlaying.scss';

interface IQueueCurrPlayingProps {
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   currentTrack?: string;
   onTrackChange: (track: string) => void;
   queueList: IRadioItem[];
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const QueueCurrPlaying: FC<IQueueCurrPlayingProps> = ({ isPlaying, onPlayingChange, currentTrack, onTrackChange, queueList, handleSnackbarMsg, handleSnackbarType }) => {
   const [currIndex, setCurrIndex] = useState<number>(0);
   const bgContext = useContext(BackgroundContext);

   useEffect(() => {
      if (queueList.length > 0) {
         onTrackChange(queueList[currIndex].source);
      }
   }, [queueList, currIndex, onTrackChange]);

   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }

   const { setIsBgYellow } = bgContext;

   const playNext = () => {
      if (currIndex < queueList.length - 1) {
         setCurrIndex(currIndex + 1);
         setIsBgYellow((prev: boolean) => !prev);
      }
      else {
         handleSnackbarMsg('Следующих станций нет');
         handleSnackbarType('error');
         return;
      }
   };

   const playPrev = () => {
      if (currIndex > 0) {
         setCurrIndex(currIndex - 1);
         setIsBgYellow((prev: boolean) => !prev);
      }
      else {
         handleSnackbarMsg('Предыдущих станций нет');
         handleSnackbarType('error');
         return;
      }
   };

   const handleShazamDetection = () => {
      console.log("Shazam detection triggered");
   };

   const currRadio = queueList[currIndex];

   return (
      <div className='queue'>
         <div className='queue__curr-playing'>
            <h3 className='queue__title'>Сейчас играет:</h3>
            {currRadio ? (
               <div className='queue__curr-playing__item'>
                  <p className='queue__curr-playing__name' title={currRadio.name}>{currRadio.name}</p>
                  <AudioPlayer streamUrl={currRadio.source} isPlaying={isPlaying} onPlayingChange={onPlayingChange} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType} />
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
   )
};

export default QueueCurrPlaying;