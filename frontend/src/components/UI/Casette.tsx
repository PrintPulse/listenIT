import React, { FC, useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import audocassete from '../../images/audiocassete.png';
import './Casette.scss';

const Casette: FC = () => {
    const [currInput, setCurrInput] = useState<string>('');
    const { isBgYellow, setIsBgYellow } = useDataContext();

    const prevBtnClickHandle = () => {

    };

    const nextBtnClickHandle = () => {

    };

    return (
        <>{isBgYellow}
            <main className='main'>
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
                            }}>
                        </button>
                        <div className="main__input-container">
                            <input 
                                value={ currInput } 
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setCurrInput(e.target.value) }
                                type="text" name="url" id='url' className='main__input' title='Нажмите Enter для поиска' placeholder=' '
                            />
                            <label htmlFor="url" 
                                className={`main__label ${currInput ? 'invisible' : ''} ${currInput ? '' : 'transparent'}`}
                            >
                                Вставьте url-ссылку на радио...
                            </label>
                        </div>
                        <button className="main__button main__button--next" aria-label='next' title='Следующий'
                            onClick={() => {
                                nextBtnClickHandle();
                                setIsBgYellow((prev: boolean) => !prev);
                            }}>
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
};

export default Casette;
