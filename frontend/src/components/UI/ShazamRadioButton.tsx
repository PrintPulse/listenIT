import React, { FC, useState, useEffect } from 'react';
import { shazamRadio } from '../../services/shazamRadioService';
import './ShazamRadioButton.scss';

interface IShazamRadioButtonProps {
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
   currentRadioUrl: string;
};

const ShazamRadioButton: FC<IShazamRadioButtonProps> = ({ handleSnackbarMsg, handleSnackbarType, currentRadioUrl }) => {
   const [isActive, setIsActive] = useState<boolean>(false);

   useEffect(() => {
      if (isActive) {
         const token = localStorage.getItem('token');
         
         if (token) {
            const postShazamRadio = async (token: string) => {
               await new Promise(resolve => setTimeout(resolve, 3000));
   
               try {
                  const response = await shazamRadio.recognize(currentRadioUrl, token);
                  if (response.message) {
                     handleSnackbarMsg(response.message);
                     handleSnackbarType('error');
                  } 
                  else {
                     handleSnackbarMsg('К сожалению, мы пока не знаем такого трека');
                     handleSnackbarType('error');
                  }
               } 
               catch (error) {
                  handleSnackbarMsg('К сожалению, мы пока не знаем такого трека');
                  handleSnackbarType('error');
               }
               finally {
                  setIsActive(false);
               }
            };
            postShazamRadio(token);
         }
         else {
            setIsActive(false);
            throw new Error('ошибка, пользователь не авторизован');
         }
      }
   }, [isActive])

   const handleButtonClick = async () => {
      setIsActive(true);
   };

   return (
      <button 
         className='shazam-button'
         onClick={ handleButtonClick } aria-label="Определить радиостанцию" data-testid='shazam-button' title='Определить радиостанцию'
      >
         <div className="container">
            <div className={"pulse" + (isActive ? ' pulse--active' : '')}>
               <p className="shazam-button__inner-text">S</p>
            </div>
         </div>
      </button>
   );
};

export default ShazamRadioButton;