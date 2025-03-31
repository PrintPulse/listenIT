import React, { FC, useState, useEffect } from 'react';
import { ISnackbarMsg } from '../../types';
import './Snackbar.scss';

const Snackbar: FC<ISnackbarMsg> = ({ type, message }) => {
   const [visible, setVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setVisible(false);
      }, 2500);

      return () => clearTimeout(timer);
   }, [type, message]);

   if (!visible) return null;
   else if (type === null) return null;

   return (
      <div className='snackbar'>
         <div className={`snackbar__inner snackbar__inner--${type}`}>
            <p className="snackbar__text">{message}</p>
         </div>
      </div>
   )
};

export default Snackbar;