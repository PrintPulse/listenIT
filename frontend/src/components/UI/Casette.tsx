import React, { FC, useState, ReactNode } from 'react';
import audocassete from '../../images/audiocassete.png';
import './Casette.scss';

interface ICasetteProps {
   onLinkChange: (value: string) => void;
   children: ReactNode;
   isPlaying: boolean;
   onPlayingChange: (isPlaying: boolean) => void;
   currentTrack?: string;
};

const Casette: FC<ICasetteProps> = ({ onLinkChange, children, isPlaying, onPlayingChange, currentTrack }) => {
   const [linkInput, setLinkInput] = useState<string>('');
   const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

   const getColorFromTrack = (track: string | undefined) => {
      if (!track) return '#ffffff';
      const hash = track.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
   };

   const cassetteColor = getColorFromTrack(currentTrack);

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!linkInput.trim()) return;

      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlRegex.test(linkInput.trim())) return;

      onLinkChange(linkInput);
      setLinkInput('');
      setIsFormVisible(false);
   };

   return (
      <>
         <main className='main' test-dataid='main'>
            <div className="main__top">
                  <h2 className="main__title">listen!</h2>
            </div>
            <div className="main__bottom" style={{ '--cassette-color': cassetteColor } as React.CSSProperties}>
               <img src={ audocassete } className="main__image" alt='vintage audio cassette tape' draggable={false}/>
               <div className={`main__reel main__reel--left ${isPlaying ? 'spin' : ''}`}></div>
               <div className={`main__reel main__reel--right ${isPlaying ? 'spin' : ''}`}></div>
               <div className="main__inner">
                  <div className="main__input-container">
                     {isFormVisible &&
                        <form onSubmit={ handleSubmit } className='main__form'>
                           <input 
                              value={ linkInput } 
                              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setLinkInput(e.target.value) }
                              type="text" name="url" id='url' className='main__input' title='Нажмите Enter для поиска' placeholder=' '
                           />
                           <label htmlFor="url" className={`main__label ${linkInput ? 'invisible' : ''} ${linkInput ? '' : 'transparent'}`}>
                              Вставьте url-ссылку на радио...
                           </label>
                        </form>
                     }
                  </div>
                  {!isFormVisible &&
                     children
                  }
               </div>
            </div>
         </main>
      </>
   )
};

export default Casette;
