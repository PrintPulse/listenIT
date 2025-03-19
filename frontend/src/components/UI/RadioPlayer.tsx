import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import type { RadioStation } from '../../types';

interface RadioPlayerProps {
   station: RadioStation | null;
   isPlaying: boolean;
   volume: number;
   onPlayPause: () => void;
   onVolumeChange: (volume: number) => void;
};

export function RadioPlayer({ station, isPlaying, volume, onPlayPause, onVolumeChange }: RadioPlayerProps) {
   const [isMuted, setIsMuted] = useState(false);
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = isMuted ? 0 : volume;
      }
   }, [volume, isMuted]);

   const handleVolumeClick = () => {
      setIsMuted(!isMuted);
      if (audioRef.current) {
         audioRef.current.muted = !isMuted;
      }
   };

   if (!station) return null;

   return (
      <div className="radio-player">
         <audio ref={audioRef} src={station.url} autoPlay={isPlaying} className="hidden"/>
         <div className="radio-player__inner">
            <div className="radio-player__controller radio-player__controller--play">
               <button onClick={onPlayPause} className="radio-player__button radio-player__button--controller">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
               </button>
               <div className='radio-player__info'>
                  <h3 className="radio-player__title">{station.name}</h3>
                  {station.genre && (
                     <p className="radio-player__subtitle">{station.genre}</p>
                  )}
               </div>
            </div>
            <div className="radio-player__controller radio-player__controller--volume">
               <button onClick={handleVolumeClick} className="radio-player__button">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
               </button>
               <input value={volume} onChange={ (e) => onVolumeChange(parseFloat(e.target.value)) } 
                  className="radio-player__input" type="range" min="0" max="1" step="0.1" 
               />
            </div>
         </div>
      </div>
   );
};