import React, { FC, useState } from 'react';
import { radioService } from 'services/radioService';
import { IRadioItem } from '../../types';
import './AddRadio.scss';

interface IAddRadioProps {
   handleAddNewRadio: (newRadio: IRadioItem) => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

const AddRadio: FC<IAddRadioProps> = ({ handleAddNewRadio, handleSnackbarMsg, handleSnackbarType }) => {
   const [nameInput, setNameInput] = useState<string>('');
   const [urlInput, setUrlInput] = useState<string>('');
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!urlInput.startsWith('https://')) {
         handleSnackbarMsg('ошибка, ссылка должна начинаться с https://');
         handleSnackbarType('error');
         return;
      }

      const response = await radioService.addRadio(nameInput, urlInput);

      if (response?.error) {
         console.log(response.error);
         handleSnackbarMsg(`ошибка: ${response.error}`);
         handleSnackbarType('error');
         return;
      }
      handleAddNewRadio({ id: response.id, name: response.name, source: response.source });
      setNameInput('');
      setUrlInput('');
      
      handleSnackbarMsg(`радио ${response.name} успешно добавлено`);
      handleSnackbarType('success');
   };

   const handleClick = () => {
      setIsOpen(prev => !prev);
   };

   return (
      <div className='add-radio'>
         <button onClick={ handleClick } className='add-radio__button'>{isOpen? 'Скрыть' : '+ Добавить своё радио'}</button>
         {isOpen &&
            <form onSubmit={handleSubmit} className="add-radio__form">
               <input onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value) } value={nameInput} className='add-radio__input' placeholder='Название' required/>
               <input onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value) } value={urlInput} className='add-radio__input' placeholder='https://example.com' required/>
               <button type='submit' className="add-radio__form-button">Сохранить</button>
            </form>
         }
      </div>
   );
};
export default AddRadio;