import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import { IRadioItem } from '../../types';
import AudioPlayer from './AudioPlayer';
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

   const handleTrackChange = useCallback((direction: 'next' | 'prev') => {
      const list = currentSource === 'queue' ? queueList : favoritesList;
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < list.length) {
         setCurrentIndex(newIndex);
         onTrackChange(list[newIndex].source);
         setIsBgYellow(prev => !prev);
      } else {
         const message = direction === 'next' ? 'Следующих станций нет' : 'Предыдущих станций нет';
         handleSnackbarMsg(currentSource === 'queue' ? `${message} в очереди` : `${message} в избранном`);
         handleSnackbarType('error');
      }
   }, [currentIndex, currentSource, queueList, favoritesList, onTrackChange, handleSnackbarMsg, handleSnackbarType, setIsBgYellow]);

   const currRadio = useMemo(() => {
      return currentSource === 'queue' ? queueList[currentIndex] : favoritesList[currentIndex];
   }, [currentSource, currentIndex, queueList, favoritesList]);

   return (
      <div className='queue'>
         <p className="queue-index">{currRadio?.id ?? 0}</p>
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
               <button onClick={ () => handleTrackChange('prev') } className='queue__curr-playing__button queue__curr-playing__button--prev'></button>
               <button onClick={ () => handleTrackChange('next') } className='queue__curr-playing__button queue__curr-playing__button--next'></button>
            </div>
         </div>
      </div>
   )
};

export default QueueCurrPlaying;