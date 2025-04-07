import React, { FC, useState } from 'react';
import { radioService } from 'services/radioService';
import { IRadioItem } from '../../types';
import './AddRadio.scss';

const AddRadio: FC = () => {
   const [urlInput, setUrlInput] = useState<string>('');
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();

      const response = await radioService.addRadio(urlInput);

      if (response?.error) {
         console.log(response.error)
      }
      else {
         console.log(response);
      }
   };

   const handleClick = () => {
      setIsOpen(prev => !prev);
   };

   return (
      <div className='add-radio'>
         <button onClick={ handleClick } className='add-radio__button'>{isOpen? 'Скрыть' : '+ Добавить своё радио'}</button>
         {isOpen &&
            <form onSubmit={handleSubmit} className="add-radio__form">
               <input type="url" onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value) } value={urlInput} className='add-radio__input' placeholder='https://example.com'/>
               <button type='submit' className="add-radio__form-button">Сохранить</button>
            </form>
         }
      </div>
   );
};
export default AddRadio;