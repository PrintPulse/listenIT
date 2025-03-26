import React, { FC, useState, ReactNode } from 'react';
import audocassete from '../../images/audiocassete.png';
import './Casette.scss';

interface ICasetteProps {
   onLinkChange: (value: string) => void;
   children: ReactNode;
};

const Casette: FC<ICasetteProps> = ({ onLinkChange, children }) => {
   const [linkInput, setLinkInput] = useState<string>('');
   const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

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
            <div className="main__bottom">
               <img src={ audocassete } className="main__image" alt='vintage audio cassette tape' draggable={false}/>
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
