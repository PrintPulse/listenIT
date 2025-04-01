import React, { FC, useState, useEffect } from 'react';
import { radioService } from '../../services/radioService';
import { IRadioItem } from '../../types';
import './QueueList.scss';

interface IQueueListProps {
   queue: IRadioItem[];
   currTrack: string;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const QueueList: FC<IQueueListProps> = ({ queue, currTrack, handleSnackbarMsg, handleSnackbarType }) => {
   const [likedItems, setLikedItems] = useState<IRadioItem[]>([]);

   useEffect(() => {
      const loadFavorites = async () => {
         const result = await radioService.getFavorites();

         if (result?.error) {
            handleSnackbarMsg(result.error);
            handleSnackbarType('error');
            return;
         }
         else {
            setLikedItems(result.stations);
            console.log('result:', result, 'stations:', result.stations)
         }
      };

      loadFavorites();
   }, []);

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

   return (
      <aside className='queue-list'>
         <div className="queue-list__queue">
            <p className="queue-list__title">Очередь радио:</p>
            <ul className='queue-list__list'>
               {queue.slice(0, 20).map((item) => (
                  <li key={item.id} className={'queue-list__item' + (item.source === currTrack ? ' queue-list__item--playing' : '')}>
                     <p className='queue-list__item-position'>{item.id}</p>
                     <p className='queue-list__item-name' title={item.name}>{item.name}</p>
                     <button
                        onClick={ () => handleLikeButton(item) }
                        className={`queue-list__item-button ${likedItems.some(likedItem => likedItem.id === item.id) ? 'queue-list__item-button--liked' : ''}`}
                     />
                  </li>
               ))}
            </ul>
         </div>
         <div className="queue-list__liked-items">
         <p className="queue-list__title">Избранное радио:</p>
            <ul className='queue-list__list'>
               {likedItems.length > 0 ? (
                  likedItems.slice(0, 20).map((item) => (
                     <li key={item.id} className='queue-list__item queue-list__item--liked'>
                        <p className='queue-list__item-name' title={item.name}>{item.name}</p>
                        <button
                           onClick={ () => handleLikeButton(item) }
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