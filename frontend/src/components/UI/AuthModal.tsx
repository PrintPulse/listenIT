import React, { FC, useState } from 'react';
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
    const [currStepIndex, setCurrStepIndex] = useState<number>(0);
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
    return (
        <div className='auth-modal'>
            <div className="auth-modal__inner">
                <h3 className="auth-modal__title">{currStep.title}</h3>
                <form className="auth-modal__form">
                    {currStep.inputs.map((input, index) => (
                        <input
                            key={index}
                            type={input.type}
                            className={`auth-modal__input auth-modal__input--${input.type}`}
                            placeholder={input.placeholder}
                            autoComplete='off'
                        />
                    ))}
                    <button className="auth-modal__button--submit" type='submit'>
                        {currStep.buttonText}
                    </button>
                    {currStepIndex === 1 &&
                        <button onClick={ () => setCurrStepIndex(2) }className="auth-modal__button--reset">Забыли пароль? Восстановить пароль</button>
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