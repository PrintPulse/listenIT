import React, { FC, useState } from 'react';
import audocassete from '../images/audiocassete.png';
import './MainPage.scss';

const MainPage: FC = () => {
    const [currInput, setCurrInput] = useState<string>('');

    return (
        <main className='main'>
            <div className="main__top">
                <h2 className="main__title">listen!</h2>
            </div>
            <div className="main__bottom">
                <img src={ audocassete } className="main__image" alt='vintage audio cassette tape'/>
                <div className="main__inner">
                    <button className='main__button main__button--prev' aria-label='previous'></button>
                    <div className="main__input-container">
                        <input 
                            value={ currInput } 
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setCurrInput(e.target.value) }
                            type="text" name="url" id='url' className='main__input'
                        />
                        <label htmlFor="url" className="main__label">Вставьте url-ссылку на радио...</label>
                    </div>
                    <button className="main__button main__button--next" aria-label='next'></button>
                </div>
            </div>
        </main>
    )
};

export default MainPage;
