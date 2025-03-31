import React, { FC, useState, useEffect } from 'react';
import { radioService } from '../../services/radioService';
import { IRadioItem } from '../../types';
import './QueueList.scss';

interface IQueueListProps {
   queue: IRadioItem[];
};

const QueueList: FC<IQueueListProps> = ({ queue }) => {
   const [likedItems, setLikedItems] = useState<IRadioItem[]>([]);

   useEffect(() => {
      const loadFavorites = async () => {
         const result = await radioService.getFavorites();

         if (result?.error) {
            return result.error;
         }
         else {
            setLikedItems(result.stations);
         }
      };

      loadFavorites();
   }, []);

   const handleLikeButton = async (item: IRadioItem) => {
      let result;
      let isLiked = likedItems.includes(item);

      if (isLiked) result = await radioService.postFavorites(item.name);
      else result = await radioService.deleteFavorite(item.name);

      if (result?.error) return result.error;

      if (isLiked) setLikedItems(prev => [...prev, { ...item }]);
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
               {likedItems.map((item) => (
                  <li key={item.id} className='queue-list__item'>
                     <p className='queue-list__item-name'>{item.name}</p>
                     <button
                        onClick={ () => handleLikeButton(item) }
                        className={`queue-list__item-button ${likedItems.some(likedItem => likedItem.id === item.id) ? 'queue-list__item-button--liked' : ''}`}
                     />
                  </li>
               ))}
            </ul>
         </div>
      </aside>
   );
};
export default QueueList;