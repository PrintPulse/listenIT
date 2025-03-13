import React from 'react';
import { Radio, Trash2 } from 'lucide-react';
import type { RadioStation } from '../../types';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  onSelectStation: (station: RadioStation) => void;
}

export function StationList({ stations, currentStation, onSelectStation }: StationListProps) {
  return (
    <div className="">
      {stations.map((station) => (
        <div
          key={station.id}
          className=''
          onClick={() => onSelectStation(station)}
        >
          <div className="">
            {station.favicon ? (
              <img
                src={station.favicon}
                alt={station.name}
                className=""
              />
            ) : (
              <Radio size={24} />
            )}
            <div>
              <h3 className="">{station.name}</h3>
              {station.genre && (
                <p className="">{station.genre}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=""
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
