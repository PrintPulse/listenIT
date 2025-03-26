import React, { FC, useState, useContext, ReactNode } from 'react';
import { BackgroundContext } from '../../context/BackgroundContext';
import audocassete from '../../images/audiocassete.png';
import './Casette.scss';

interface ICasetteProps {
   onLinkChange: (value: string) => void;
   children: ReactNode;
};

const Casette: FC<ICasetteProps> = ({ onLinkChange, children }) => {
   const [linkInput, setLinkInput] = useState<string>('');
   const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
   const bgContext = useContext(BackgroundContext);
   
   if (!bgContext) {
      throw new Error('casette must be used within a BackgroundProvider');
   }
   const { setIsBgYellow } = bgContext;

   const prevBtnClickHandle = () => {

   };

   const nextBtnClickHandle = () => {

   };

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
                  <button className='main__button main__button--prev' aria-label='previous' title='Предыдущий'
                     onClick={() => {
                        prevBtnClickHandle();
                        setIsBgYellow((prev: boolean) => !prev);
                     }}
                  >
                  </button>
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
                  <button className="main__button main__button--next" aria-label='next' title='Следующий'
                     onClick={() => {
                        nextBtnClickHandle();
                        setIsBgYellow((prev: boolean) => !prev);
                     }}
                  >
                  </button>
               </div>
            </div>
         </main>
      </>
   )
};

export default Casette;
