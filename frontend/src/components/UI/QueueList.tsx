import React, { FC, useState, useEffect } from 'react';
import { radioService } from '../../services/radioService';
import { IRadioItem } from '../../types';
import './QueueList.scss';

interface IQueueListProps {
   queue: IRadioItem[];
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const QueueList: FC<IQueueListProps> = ({ queue, handleSnackbarMsg, handleSnackbarType }) => {
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
      console.log('called')
      let result;
      let isLiked = likedItems.some(likedItem => likedItem.id === item.id);
      console.log(likedItems, item, isLiked)

      if (isLiked) result = await radioService.deleteFavorite(item.name);
      else result = await radioService.postFavorites(item.name);

      console.log(result)
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
               {queue.map((item) => (
                  <li key={item.id} className='queue-list__item'>
                     <p className='queue-list__item-position'>{item.id}</p>
                     <p className='queue-list__item-name'>{item.name}</p>
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
                  likedItems.map((item) => (
                     <li key={item.id} className='queue-list__item'>
                        <p className='queue-list__item-name'>{item.name}</p>
                        <button
                           onClick={ () => handleLikeButton(item) }
                           className={`queue-list__item-button ${likedItems.some(likedItem => likedItem.id === item.id) ? 'queue-list__item-button--liked' : ''}`}
                        />
                     </li>
                  ))
               ) : (
                  <p>Пока пусто</p>
               )}
            </ul>
         </div>
      </aside>
   );
};
export default QueueList;