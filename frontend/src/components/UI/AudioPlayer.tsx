import React, { useState, useEffect, useRef } from "react";

const AudioPlayer: React.FC<{ streamUrl: string }> = ({ streamUrl }) => {
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = streamUrl;
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

   return (
      <div className="audio-container">
         <audio ref={audioRef} className="queue__curr-playing__audio"/>
         <div className="audio-controls">
            <button onClick={ () => setIsPlaying(prevVal => !prevVal) } className={`audio-controls__button audio-controls__button--${isPlaying ? 'pause' : 'play'}`} aria-label={`${isPlaying ? 'pause' : 'play'}`}></button>
         </div>
      </div>

   );
};

export default AudioPlayer;