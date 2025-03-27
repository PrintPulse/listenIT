import React, { FC, useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import AudioPlayer from './AudioPlayer';

interface IQueueProps {
   queueItem: IQueueState | null; 
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
};

interface IQueueState {
   id: number;
   url: string;
};

const Queue: FC<IQueueProps> = ({ queueItem, isPlaying, onPlayingChange}) => {
   const [queue, setQueue] = useState<IQueueState[]>([]);
   const [currIndex, setCurrIndex] = useState<number>(-1);
   const bgContext = useContext(BackgroundContext);

   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }

   const { setIsBgYellow } = bgContext;

   useEffect(() => {
      if (queueItem) {
         setQueue(prevVal => ([...prevVal, queueItem]));

         if (currIndex === -1) setCurrIndex(0);
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
      <div className='queue'>
         {/* <ul className="queue__list">
         {queue.map((item, index) => (
            <li key={item.id} className='queue__item'>
               <p className="queue__item__placement">{index + 1}</p>
               <p className="queue__item__url">{item.url}</p>
            </li>
        ))}
         </ul> */}
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
   )
};

export default Queue;