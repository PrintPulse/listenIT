import React, { FC, useState, useEffect, useRef } from "react";
import './AudioPlayer.scss';

interface IAudioPlayerProps {
   streamUrl: string;
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
};

const AudioPlayer: FC<IAudioPlayerProps> = ({ streamUrl, isPlaying, onPlayingChange }) => {
   const [volume, setVolume] = useState<number>(0.5);
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = streamUrl;
         audioRef.current.volume = volume;
         audioRef.current
            .play()
            .then(() => {
               onPlayingChange(true);
            })
            .catch((error) => {
               console.error(error);
               onPlayingChange(false);
            });
      }
   }, [streamUrl]);

   useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
   }, [volume]);

   useEffect(() => {
      if (audioRef.current) {
         if (isPlaying) {
            audioRef.current.play().catch(error => console.error(error));
         } 
         else {
            audioRef.current.pause();
         }
      }
   }, [isPlaying]);

   return (
      <div className="audio-container">
         <audio ref={audioRef} className="queue__curr-playing__audio"/>
         <div className="audio-controls">
            <button onClick={ () => onPlayingChange(!isPlaying) } className={`audio-controls__button audio-controls__button--${isPlaying ? 'pause' : 'play'}`} aria-label={`${isPlaying ? 'pause' : 'play'}`}></button>
            <div 
               className="audio-controls__volume-control"
               style={{ '--rotation': volume * 180 - 90 } as React.CSSProperties}
            >  
               <input className={'audio-controls__volume-input' + (volume === 0 ? ' muted' : '')} type="range" min="0" max="1" step="0.01" aria-label="Регулировка громкости"
                  onChange={(e) => setVolume(e.target.valueAsNumber)} value={volume}   
               />
               <div className="audio-controls__marker"></div>
            </div>
         </div>
      </div>

   );
};

export default AudioPlayer;