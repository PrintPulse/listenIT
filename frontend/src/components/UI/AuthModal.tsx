import React, { FC, FormEvent, useState, useContext, act } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { loginUser, registerUser, resetPassStep1, resetPassStep2 } from '../../services/authService';
import './AuthModal.css';

type AuthModalProps = {
   onSuccess: () => void;
   handleSnackbarMsg: (snackbarMsg: string) => void;
   handleSnackbarType: (snackbarType: "error" | "success" | null) => void;
};

type AuthStep = {
   title: string;
   inputs: { type: string; placeholder: string }[];
   buttonText: string;
   switchText: string;
};

const authSteps: AuthStep[] = [
   { title: 'Регистрация', inputs: [{ type: 'email', placeholder: 'Email' }, { type: 'password', placeholder: 'Пароль' }], buttonText: 'Зарегистрироваться', switchText: 'Уже есть аккаунт? Войти в систему' },
   { title: 'Вход в систему', inputs: [{ type: 'email', placeholder: 'Email' }, { type: 'password', placeholder: 'Пароль' }], buttonText: 'Войти', switchText: 'Нет аккаунта? Зарегистрироваться' },
   { title: 'Восстановление пароля', inputs: [{ type: 'email', placeholder: 'Введите ваш Email' }], buttonText: 'Отправить', switchText: 'Вспомнили пароль? Войти в систему' },
   { title: 'Сброс пароля', inputs: [{ type: 'password', placeholder: 'Новый пароль' }], buttonText: 'Сбросить пароль', switchText: 'Вспомнили пароль? Войти в систему' }
];

const AuthModal: FC<AuthModalProps> = ({ onSuccess, handleSnackbarMsg, handleSnackbarType }) => {
   const { setIsAuthed } = useContext(AuthContext) || { setIsAuthed: () => {} };    
   const [currStepIndex, setCurrStepIndex] = useState<number>(0);
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [errorResponseInfo, setErrorResponseInfo] = useState<string | null>(null);
   const [actionStatus, setActionStatus] = useState<string>('');

   const currStep = authSteps[currStepIndex];

   const handleSwitchStep = () => {
      setErrorResponseInfo(null);
      
      if (currStepIndex === 0) {
         setCurrStepIndex(1);
      } 
      else if (currStepIndex === 1) {
         setCurrStepIndex(0);
      } 
      else if (currStepIndex === 2) {
         setCurrStepIndex(1);
      }
      else if (currStepIndex === 3) {
         setCurrStepIndex(1);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputType: 'email' | 'password') => {
      if (inputType === 'email') setEmail(e.target.value);
      else if (inputType === 'password') setPassword(e.target.value);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setActionStatus('');
      setErrorResponseInfo(null);
      
      try {
         let response;
         if (currStepIndex === 0) { //регистрация
            response = await registerUser(email, password);

            if (response?.is_active) {
               setActionStatus('Вы успешно зарегистрированы, войдите в аккаунт');
            }
            else if (response?.error) {
               setErrorResponseInfo(response.error);
            }
         }
         else if (currStepIndex === 1) { //авторизация
            response = await loginUser(email, password);

            if (response?.access_token) {
               localStorage.setItem('token', response.access_token);
               setIsAuthed(true);
               handleSnackbarMsg('Вы успешно авторизованы');
               handleSnackbarType('success');
               onSuccess();
            }
            else if (response?.error) {
               setErrorResponseInfo(response.error);
            }
         }
         else if (currStepIndex === 2) {//сброс 1
            response = await resetPassStep1(email);

            if (response?.token) {
               setCurrStepIndex(3);
               localStorage.setItem('token-reset', response.token);
               setActionStatus('Успех, перейдите к следующему этапу');
            }
            else if (response?.error) {
               setErrorResponseInfo(response.error);
            }
         }
         else if (currStepIndex === 3) {//сброс 2
            const tokenReset = localStorage.getItem('token-reset');

            if (tokenReset) {
               const response = await resetPassStep2(tokenReset, password);

               if (Object.keys(response).length === 0) {
                  setActionStatus('Ваш пароль успешно обновлён');
                  localStorage.removeItem('token-reset');
               }
               else if (response?.details) {
                  setErrorResponseInfo(response.details);
               }
            }
            else {
               throw new Error('ошибка, пользователь пропустил этап сброса пароля');
            }
         }
      }
      catch (err: unknown) {
         let errorMessage: string;
         if (err instanceof Error) errorMessage = err.message;
         else errorMessage = String(err);
  
         handleSnackbarMsg(`Ошибка:, ${errorMessage}`);
      }
      finally {
         setIsLoading(false);
      }
   };

   return (
      <div className='auth-modal'>
         <div className="auth-modal__inner">
               <h3 className="auth-modal__title">{currStep.title}</h3>
               <form onSubmit={ handleSubmit } className="auth-modal__form">
                  {currStep.inputs.map((input, index) => (
                     <input 
                        key={index} type={input.type} placeholder={input.placeholder} 
                        value={ input.type === 'email' ? email : password } onChange={(e) => handleInputChange(e, input.type as 'email' | 'password')}
                        className={`auth-modal__input auth-modal__input--${input.type}`} autoComplete='off' 
                     />
                  ))}
                  <button className="auth-modal__button--submit" type='submit'>
                     {currStep.buttonText}
                  </button>
                  {isLoading && 
                     <p>Загрузка...</p>
                  }
                  {errorResponseInfo &&
                     <p>{errorResponseInfo}</p>
                  }
                  {actionStatus &&
                     <p>{actionStatus}</p>
                  }
                  {currStepIndex === 1 &&
                     <button onClick={ () => setCurrStepIndex(2) } type='submit' className="auth-modal__button--reset">Забыли пароль? Восстановить пароль</button>
                  }
               </form>
               <button className="auth-modal__button--switch" onClick={ handleSwitchStep }>
                  {currStep.switchText}
               </button>
         </div>
      </div>
   );
};
export default AuthModal;