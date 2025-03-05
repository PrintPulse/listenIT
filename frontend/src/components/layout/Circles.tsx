import React, { FC, useState, useEffect } from 'react';
import { useDataContext } from '../../context/DataContext';
import './Circles.scss';

interface elementsProps {
    id: number;
};
interface positionTypes {
    top: number;
    left: number;
};  

const Circles: FC = () => {
    const [elements, setElements] = useState<elementsProps[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [fixedPositions, setFixedPositions] = useState<positionTypes[]>([]);
    const { isBgYellow } = useDataContext();

    useEffect(() => {
        let widthDiff = 1728 / windowWidth;
        let heightDiff = 1117 / windowHeight;

        setFixedPositions([{ top: -(198 / heightDiff), left: -(155 / widthDiff) }, { top: 542 / heightDiff, left: 897 / widthDiff }, { top: 635 / heightDiff, left: 111 / widthDiff }, { top: 17 / heightDiff, left: 1350 / widthDiff }]);
    }, [windowWidth, windowHeight])

    useEffect(() => {
        const initialElements = Array.from({ length: 4}, () => ({
            id: Date.now() * Math.random(),
        }));

        setElements(initialElements);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    return (
        <div 
            data-testid="circle-container"
            className={`circle-container ${isBgYellow ? 'circle-container--yellow' : 'circle-container--green'}`}
        >
            {elements.map((el, index) => (
                <div 
                    key={el.id}
                    data-testid='circle'
                    className={`circle circle--${index} ${isBgYellow ? 'circle--yellow' : 'circle--green'}`} 
                    style={{
                        top: fixedPositions[index].top,
                        left: fixedPositions[index].left,
                    }} 
                />
            ))}
        </div>
    )
}

export default Circles;
