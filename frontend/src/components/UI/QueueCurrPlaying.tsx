import React, { FC, useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import AudioPlayer from './AudioPlayer';

interface IQueueCurrPlayingProps {
   queueItem: IQueueState | null; 
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   currentTrack?: string;
   onTrackChange: (track: string) => void;
   onQueueUpdate: (queue: IQueueState[]) => void;
};

interface IQueueState {
   id: number;
   url: string;
};

const QueueCurrPlaying: FC<IQueueCurrPlayingProps> = ({ queueItem, isPlaying, onPlayingChange, currentTrack, onTrackChange, onQueueUpdate }) => {
   const [queue, setQueue] = useState<IQueueState[]>([]);
   const [currIndex, setCurrIndex] = useState<number>(-1);
   const bgContext = useContext(BackgroundContext);

   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }

   const { setIsBgYellow } = bgContext;

   useEffect(() => {
      if (queueItem) {
         const newQueue = [...queue, { ...queueItem, id: queue.length + 1 }];
         setQueue(newQueue);
         onQueueUpdate(newQueue);
         if (currIndex === -1) {
            setCurrIndex(0);
            onTrackChange(queueItem.url);
         }
      }
   }, [queueItem]);

   const playNext = () => {
      if (currIndex < queue.length - 1) setCurrIndex(currIndex + 1);

      setIsBgYellow((prev: boolean) => !prev);
   };

   const playPrev = () => {
      if (currIndex > 0) setCurrIndex(currIndex - 1);

      setIsBgYellow((prev: boolean) => !prev);
   };

   const currRadio = currIndex >= 0 ? queue[currIndex] : null;

   return (
      <>
         <div className='queue'>
            <div className='queue__curr-playing'>
               <h3 className='queue__title'>Сейчас играет:</h3>
               {currRadio ? (
                  <div className='queue__curr-playing__item'>
                     <p className='queue__curr-playing__url'>{currRadio.url}</p>
                     <AudioPlayer streamUrl={currRadio.url} isPlaying={isPlaying} onPlayingChange={onPlayingChange}/>
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