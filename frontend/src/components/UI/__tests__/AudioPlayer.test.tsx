import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AudioPlayer from '../AudioPlayer';

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = jest.fn().mockImplementation(() => {});
  Object.defineProperty(window.HTMLMediaElement.prototype, 'volume', {
    writable: true,
    value: 0.5
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AudioPlayer Component', () => {
  const mockOnPlayingChange = jest.fn();
  const mockOnShazamDetect = jest.fn();

  // Добавляем недостающие атрибуты handleSnackbarMsg и handleSnackbarType
  const defaultProps = {
    streamUrl: 'http://test-stream.com/audio&#39',
    isPlaying: false,
    onPlayingChange: mockOnPlayingChange,
    onShazamDetect: mockOnShazamDetect,
    handleSnackbarMsg: jest.fn(),     // mock для сообщения snackbar
    handleSnackbarType: jest.fn()     // mock для типа snackbar
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByTestId('audio-container')).toBeInTheDocument();
  });

  it('initializes with correct volume', () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeInput = screen.getByTestId('volume-input') as HTMLInputElement;
    expect(volumeInput.value).toBe('0.5');
  });

  it('handles play/pause button click', () => {
    render(<AudioPlayer {...defaultProps} />);
    const playButton = screen.getByTestId('play-button') as HTMLButtonElement;
    fireEvent.click(playButton);
    expect(mockOnPlayingChange).toHaveBeenCalledWith(true);
  });

  it('updates volume when slider changes', () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeInput = screen.getByTestId('volume-input') as HTMLInputElement;
    fireEvent.change(volumeInput, { target: { value: '0.7' } });
    expect(volumeInput.value).toBe('0.7');
  });

  it('handles Shazam button click', () => {
    render(<AudioPlayer {...defaultProps} />);
    const shazamButton = screen.getByTestId('shazam-button') as HTMLButtonElement;
    fireEvent.click(shazamButton);
    expect(mockOnShazamDetect).toHaveBeenCalled();
  });

  it('handles audio play success', async () => {
    render(<AudioPlayer {...defaultProps} />);
    const audio = screen.getByTestId('audio-element') as HTMLAudioElement;
    const playButton = screen.getByTestId('play-button');
    fireEvent.click(playButton);
    expect(audio.play).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnPlayingChange).toHaveBeenCalledWith(true);
    });
  });

  it('updates volume marker rotation', () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeControl = screen.getByTestId('volume-control') as HTMLDivElement;
    const volumeInput = screen.getByTestId('volume-input') as HTMLInputElement;
    fireEvent.change(volumeInput, { target: { value: '0.75' } });
    // Предположим, что вычисленная ротация равна '45'
    expect(volumeControl.style.getPropertyValue('--rotation')).toBe('45');
  });

  it('adds muted class when volume is 0', () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeInput = screen.getByTestId('volume-input') as HTMLInputElement;
    fireEvent.change(volumeInput, { target: { value: '0' } });
    expect(volumeInput.classList.contains('muted')).toBe(true);
  });
});