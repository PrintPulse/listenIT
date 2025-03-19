import React from 'react';
import { Radio, Trash2 } from 'lucide-react';
import type { RadioStation } from '../../types';

interface StationListProps {
   stations: RadioStation[];
   currentStation: RadioStation | null;
   onSelectStation: (station: RadioStation) => void;
};

export function StationList({ stations, currentStation, onSelectStation }: StationListProps) {
   return (
      <div className="station-container">
         <ul className="stations__list">
            {stations.map((station) => (
               <li onClick={() => onSelectStation(station)} key={station.id} className='stations__item'>
                  {station.favicon ? (
                     <img className="station__icon" src={station.favicon} alt={station.name}/>
                  ) : (
                     <Radio size={24} />
                  )}
                  <div className='station__info'>
                     <h3 className="station__title">{station.name}</h3>
                     {station.genre && (
                        <p className="station__subtitle">{station.genre}</p>
                     )}
                  </div>
                  <button onClick={ (e) => { e.stopPropagation(); } } className="station__button station__button--delete">
                     <Trash2 size={18} />
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
};