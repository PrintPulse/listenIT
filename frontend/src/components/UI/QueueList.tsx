import React, { FC, useState, useEffect } from 'react';
import { radioService } from '../../services/radioService';
import { IRadioItem } from '../../types';
import './QueueList.css';
import AddRadio from './AddRadio';

interface IQueueListProps {
   queue: IRadioItem[];
   currTrack: string;
   onTrackChange: (track: string, fromFavorites?: boolean) => void;
   currentSource: 'queue' | 'favorites';
   onRadioStationsUpdate: (stations: IRadioItem[]) => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const QueueList: FC<IQueueListProps> = ({ queue, currTrack, onTrackChange, currentSource, handleSnackbarMsg, handleSnackbarType, onRadioStationsUpdate }) => {
   const [likedItems, setLikedItems] = useState<IRadioItem[]>([]);

   useEffect(() => {
      const loadFavorites = async () => {
         const result = await radioService.getFavorites();

         if (result?.error) {
            handleSnackbarMsg(result.error);
            handleSnackbarType('error');
            return;
         }
         else if (result?.stations) {
            setLikedItems(result.stations);
         }
      };

      loadFavorites();
   }, []);

   const handleAddNewRadio = async (newRadio: IRadioItem) => {
      try {
         const updatedQueue = [...queue, newRadio];
         onRadioStationsUpdate(updatedQueue);
         
         handleSnackbarMsg(`Радио "${newRadio.name}" успешно добавлено`);
         handleSnackbarType('success');
         
         onTrackChange(newRadio.source, false);
      } 
      catch (error) {
         handleSnackbarMsg('Ошибка при добавлении радио');
         handleSnackbarType('error');
         console.error(error);
      }
   };

   const handleLikeButton = async (item: IRadioItem) => {
      let result;
      let isLiked = likedItems.some(likedItem => likedItem.id === item.id);

      if (isLiked) result = await radioService.deleteFavorite(item.name);
      else result = await radioService.postFavorites(item.name);

      if (result?.error) {
         handleSnackbarMsg(result.error);
         handleSnackbarType('error');
         return;
      }

      if (!isLiked) setLikedItems(prev => [...prev, { ...item }]);
      else setLikedItems(prev => prev.filter(likedItem => likedItem.id !== item.id));
   };

   const handleRadioClick = (item: IRadioItem, fromFavorites: boolean) => {
      onTrackChange(item.source, fromFavorites);
   };

   return (
      <aside className='queue-list'>
         <div className="queue-list__queue">
            <p className="queue-list__title">Очередь радио:</p>
            <ul className='queue-list__list'>
               {queue.map((item) => (
                  <li key={item.id} onClick={() => handleRadioClick(item, false)} className={'queue-list__item' + (item.source === currTrack && currentSource === 'queue' ? ' queue-list__item--playing' : '')}>
                     <p className='queue-list__item-position'>{item.id}</p>
                     <p className='queue-list__item-name' title={item.name}>{item.name}</p>
                     <button
                        onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation(); handleLikeButton(item);} }
                        className={`queue-list__item-button ${likedItems.some(likedItem => likedItem.id === item.id) ? 'queue-list__item-button--liked' : ''}`}
                     />
                  </li>
               ))}
            </ul>
            <AddRadio handleAddNewRadio={handleAddNewRadio} handleSnackbarMsg={handleSnackbarMsg} handleSnackbarType={handleSnackbarType}/>
         </div>
         <div className="queue-list__liked-items">
         <p className="queue-list__title">Избранное радио:</p>
            <ul className='queue-list__list'>
               {likedItems.length > 0 ? (
                  likedItems.map((item) => (
                     <li 
                        key={item.id} 
                        onClick={() => handleRadioClick(item, true)} 
                        className={'queue-list__item queue-list__item--liked' + (item.source === currTrack && currentSource === 'favorites' ? ' queue-list__item--playing' : '')}
                     >
                        <p className='queue-list__item-name' title={item.name}>{item.name}</p>
                        <button
                           onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation(); handleLikeButton(item);} }
                           className={`queue-list__item-button ${likedItems.some(likedItem => likedItem.id === item.id) ? 'queue-list__item-button--liked' : ''}`}
                        />
                     </li>
                  ))
               ) : (
                  <p className='queue-list__list-empty'>Пока пусто</p>
               )}
            </ul>
         </div>
      </aside>
   );
};
export default QueueList;