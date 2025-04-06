import React, { FC, useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import AudioPlayer from './AudioPlayer';
import { IRadioItem } from '../../types';
import './QueueCurrPlaying.css';

interface IQueueCurrPlayingProps {
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   currentTrack?: string;
   onTrackChange: (track: string) => void;
   queueList: IRadioItem[];
   favoritesList: IRadioItem[];
   currentSource: 'queue' | 'favorites';
   onSourceChange: (source: 'queue' | 'favorites') => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const QueueCurrPlaying: FC<IQueueCurrPlayingProps> = ({ isPlaying, onPlayingChange, currentTrack, onTrackChange, queueList, favoritesList, currentSource, onSourceChange, handleSnackbarMsg, handleSnackbarType }) => {
   const [currentIndex, setCurrentIndex] = useState<number>(0);
   const bgContext = useContext(BackgroundContext);

   useEffect(() => {
      if (currentTrack) {
         let index = -1;
         let list = currentSource === 'queue' ? queueList : favoritesList;
         
         index = list.findIndex(item => item.source === currentTrack);
         
         if (index !== -1) {
            setCurrentIndex(index);
         } 
         else {
            const otherList = currentSource === 'queue' ? favoritesList : queueList;
            const otherIndex = otherList.findIndex(item => item.source === currentTrack);
            
            if (otherIndex !== -1) {
               onSourceChange(currentSource === 'queue' ? 'favorites' : 'queue');
               setCurrentIndex(otherIndex);
            } 
            else {
               setCurrentIndex(0);
            }
         }
      }
   }, [currentTrack, queueList, favoritesList, currentSource, onSourceChange]);

   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }

   const { setIsBgYellow } = bgContext;

   const playNext = () => {
      if (currentSource === 'queue') {
         if (currentIndex < queueList.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            onTrackChange(queueList[newIndex].source);
            setIsBgYellow((prev: boolean) => !prev);
         } 
         else {
            handleSnackbarMsg('Следующих станций нет в очереди');
            handleSnackbarType('error');
         }
      } 
      else if (currentSource === 'favorites') {
         if (currentIndex < favoritesList.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            onTrackChange(favoritesList[newIndex].source);
            setIsBgYellow((prev: boolean) => !prev);
         } 
         else {
            handleSnackbarMsg('Следующих станций нет в избранном');
            handleSnackbarType('error');
         }
      }
   };

   const playPrev = () => {
      if (currentSource === 'queue') {
         if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            onTrackChange(queueList[newIndex].source);
            setIsBgYellow((prev: boolean) => !prev);
         } 
         else {
            handleSnackbarMsg('Предыдущих станций нет в очереди');
            handleSnackbarType('error');
         }
      } 
      else if (currentSource === 'favorites') {
         if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            onTrackChange(favoritesList[newIndex].source);
            setIsBgYellow((prev: boolean) => !prev);
         } else {
            handleSnackbarMsg('Предыдущих станций нет в избранном');
            handleSnackbarType('error');
         }
      }
   };

   const currRadio = currentSource === 'queue' ? queueList[currentIndex] : favoritesList[currentIndex];

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