import React from 'react';
import { render, screen } from '@testing-library/react';
import Circles from '../components/layout/Circles';
import { DataContext } from '../context/DataContext';
import { DataProvider } from '../context/DataContext';

test('render Circles component', () => {
    const mockSetIsBgYellow = jest.fn();

    const { container } = render(
        <DataContext.Provider value={{ isBgYellow: false, setIsBgYellow: mockSetIsBgYellow }}>
            <Circles />
        </DataContext.Provider>
    );
    expect(container).toBeInTheDocument();
});

test('initial state of elements', () => {
    const mockSetIsBgYellow = jest.fn();

    render(
        <DataContext.Provider value={{ isBgYellow: false, setIsBgYellow: mockSetIsBgYellow }}>
            <Circles />
        </DataContext.Provider>
    );

    const circles = screen.getAllByTestId('circle');
    expect(circles.length).toBe(4);
});

test('correct classes applied based on isBgYellow state', () => {
    render(
        <DataProvider>
            <Circles />
        </DataProvider>
    );
    const circleContainer = screen.getByTestId('circle-container');
    expect(circleContainer).toHaveClass('circle-container--yellow');
});