import React, { FC, FormEvent, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { loginUser, registerUser, resetPassStep1, resetPassStep2 } from '../../services/authService';
import './AuthModal.scss';

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

const AuthModal: FC = () => {
    const { setIsAuthed } = useContext(AuthContext) || { setIsAuthed: () => {} };    const [currStepIndex, setCurrStepIndex] = useState<number>(0);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currStep = authSteps[currStepIndex];

    const handleSwitchStep = () => {
        if (currStepIndex === 0) {
            setCurrStepIndex(1);
        } else if (currStepIndex === 1) {
            setCurrStepIndex(0);
        } else if (currStepIndex === 2) {
            setCurrStepIndex(1);
        }
    };

    const handleSubmint = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (currStepIndex === 0) { //регистрация
                const response: boolean = await registerUser(email, password);
    
                if (response) {
                    setIsLoading(false);
                }
            }
            else if (currStepIndex === 1) { //авторизация
                const token: string = await loginUser(email, password);
    
                if (token) {
                    localStorage.setItem('token', token);
                    setIsLoading(false);
                    setIsAuthed(true);
                }
            }
            else if (currStepIndex === 2) {//сброс 1
                const response: string = await resetPassStep1(email);
    
                if (response) {
                    setIsLoading(false);
                    setCurrStepIndex(3);
                    localStorage.setItem('token-reset', response);
                }
            }
            else if (currStepIndex === 3) {//сброс 2
                const tokenReset = localStorage.getItem('token-reset');
    
                if (tokenReset) {
                    const response: boolean = await resetPassStep2(tokenReset, email);
    
                    if (response) {
                        setIsLoading(false);
                        setCurrStepIndex(3);
                    }
                }
                else {
                    throw new Error('ошибка, пользователь пропустил этап сброса пароля');
                }
            }
        }
        catch (err) {
            setIsLoading(false);
            throw new Error('произошла ошибка');
        }
    };

    return (
        <div className='auth-modal'>
            <div className="auth-modal__inner">
                <h3 className="auth-modal__title">{currStep.title}</h3>
                <form onSubmit={ handleSubmint } className="auth-modal__form">
                    {currStep.inputs.map((input, index) => (
                        <input
                            key={index}
                            type={input.type}
                            className={`auth-modal__input auth-modal__input--${input.type}`}
                            placeholder={input.placeholder}
                            autoComplete='off'
                            value={input.type === 'email' ? email : password}
                            onChange={(e) => {
                                if (input.type === 'email') setEmail(e.target.value);
                                else setPassword(e.target.value);
                            }}
                        />
                    ))}
                    <button className="auth-modal__button--submit" type='submit'>
                        {currStep.buttonText}
                    </button>
                    {isLoading && 
                        <p>Загрузка...</p>
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
    )
};
export default AuthModal;