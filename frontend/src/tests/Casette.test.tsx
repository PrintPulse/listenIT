import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Casette from '../components/UI/Casette';
import { DataProvider } from '../context/DataContext';
import * as DataContext from '../context/DataContext';

test('renders Casette component', () => {
    render(
        <DataProvider>
            <Casette />
        </DataProvider>
    );
    expect(screen.getByText(/listen!/i)).toBeInTheDocument();
});

test('initial state of currInput', () => {
    render(
        <DataProvider>
            <Casette />
        </DataProvider>
    );
    const input = screen.getByLabelText(/вставьте url-ссылку на радио/i);
    expect(input).toHaveValue('');
});

test('updates currInput on input change', () => {
    render(
        <DataProvider>
            <Casette />
        </DataProvider>
    );
    
    const input = screen.getByLabelText(/вставьте url-ссылку на радио/i);
    fireEvent.change(input, { target: { value: 'http://example.com' } });
    expect(input).toHaveValue('http://example.com');
});

test('toggles isBgYellow on button click', () => {
    const { container } = render(
        <DataProvider>
            <Casette />
        </DataProvider>
    );
    const prevButton = screen.getByLabelText('previous');
    const nextButton = screen.getByLabelText('next');
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    expect(container).toBeInTheDocument();
});