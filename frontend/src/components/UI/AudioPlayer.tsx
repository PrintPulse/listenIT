import React, { useState, useEffect, useRef } from "react";

const AudioPlayer: React.FC<{ streamUrl: string }> = ({ streamUrl }) => {
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [volume, setVolume] = useState<number>(0.5);
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = streamUrl;
         audioRef.current.volume = volume;
         audioRef.current
            .play()
            .then(() => {
               setIsPlaying(true);
            })
            .catch((error) => {
               console.error(error);
               setIsPlaying(false);
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
            <button onClick={ () => setIsPlaying(prevVal => !prevVal) } className={`audio-controls__button audio-controls__button--${isPlaying ? 'pause' : 'play'}`} aria-label={`${isPlaying ? 'pause' : 'play'}`}></button>
            <div className="audio-controls__volume-control">
               <input className={'audio-controls__volume-input' + (volume === 0 ? ' muted' : '')} type="range" min="0" max="1" step="0.01" aria-label="Регулировка громкости"
                  onChange={(e) => setVolume(e.target.valueAsNumber)} value={volume}   
               />
            </div>
         </div>
      </div>

   );
};

export default AudioPlayer;