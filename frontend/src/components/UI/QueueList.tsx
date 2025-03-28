import React, { FC, useState } from 'react';
import './QueueList.scss';

interface IQueueListProps {
   queue: IQueueState[];
};

interface IQueueState {
   id: number;
   url: string;
   liked?: boolean;
};

const QueueList: FC<IQueueListProps> = ({ queue }) => {
   const [likedItems, setLikedItems] = useState<IQueueState[]>([]);

   const handleLikeItem = (e: React.MouseEvent<HTMLButtonElement>, item: IQueueState) => {
      setLikedItems(prev => {
         const isItemLiked = prev.some(likedItem => likedItem.id === item.id);

         if (isItemLiked) return prev.filter(likedItem => likedItem.id !== item.id);

         return [...prev, { ...item, liked: true }];
      });
   };

   return (
      <aside className='queue-list'>
         <div className="queue-list__queue">
            <p className="queue-list__title">Очередь радио:</p>
            <ul className='queue-list__list'>
               {queue.map((item) => (
                  <li key={item.id} className='queue-list__item'>
                     <p className='queue-list__item-position'>{item.id}</p>
                     <p className='queue-list__item-name'>{item.url}</p>
                     <button
                        onClick={ (e) => handleLikeItem(e, item) }
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
                     <p className='queue-list__item-name'>{item.url}</p>
                     <button
                        onClick={ (e) => handleLikeItem(e, item) }
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