import React, { FC, useState, useEffect, useRef } from "react";
import ShazamRadioButton from "./ShazamRadioButton";
import './AudioPlayer.scss';

interface IAudioPlayerProps {
   streamUrl: string;
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   onShazamDetect?: () => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const AudioPlayer: FC<IAudioPlayerProps> = ({ streamUrl, isPlaying, onPlayingChange, onShazamDetect, handleSnackbarMsg, handleSnackbarType }) => {
   const [volume, setVolume] = useState<number>(0.5);
   const [isShazamActive, setIsShazamActive] = useState<boolean>(false);
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
               console.error('Ошибка воспроизведения:', error.message);
               handleSnackbarMsg('ошибка воспроизведения');
               handleSnackbarType('error');
               onPlayingChange(false);
               
               if (error.name === 'NotAllowedError') {
                  handleSnackbarMsg('воспроизведение заблокировано браузером');
                  handleSnackbarType('error');
               }
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
            audioRef.current.play()
               .catch(error => {
                  console.error('ошибка при воспроизведении радио:', error);
                  handleSnackbarMsg('ошибка воспроизведения');
                  handleSnackbarType('error');
                  onPlayingChange(false);
               });
         } else {
            audioRef.current.pause();
         }
      }
   }, [isPlaying]);

   const handleShazamClick = () => {
      setIsShazamActive(true);
      if (onShazamDetect) {
         onShazamDetect();
         setTimeout(() => setIsShazamActive(false), 3000);
      }
   };

   return (
      <div className="audio-container" data-testid='audio-container'>
         <audio ref={audioRef} className="queue__curr-playing__audio" data-testid='audio-element'/>
         <div className="audio-controls">
            <button 
               onClick={ () => onPlayingChange(!isPlaying) } 
               className={`audio-controls__button audio-controls__button--${isPlaying ? 'pause' : 'play'}`} 
               aria-label={`${isPlaying ? 'pause' : 'play'}`}
               data-testid='play-button'
            />
            <ShazamRadioButton isActive={isShazamActive} onClick={handleShazamClick} />
            <div 
               className="audio-controls__volume-control"
               style={{ '--rotation': volume * 180 - 90 } as React.CSSProperties}
               data-testid='volume-control'
            >  
               <input className={'audio-controls__volume-input' + (volume === 0 ? ' muted' : '')} type="range" min="0" max="1" step="0.01" aria-label="Регулировка громкости"
                  onChange={(e) => setVolume(e.target.valueAsNumber)} value={volume}
                  data-testid='volume-input' 
               />
               <div className="audio-controls__marker"></div>
            </div>
         </div>
      </div>

   );
};

export default AudioPlayer;