import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import QueueList from '../QueueList';
import { radioService } from '../../../services/radioService';

jest.mock('../../../services/radioService', () => ({
   radioService: {
      getFavorites: jest.fn(),
      deleteFavorite: jest.fn(),
      postFavorites: jest.fn(),
   }
}));

describe('QueueList Component', () => {
   const mockProps = {
      queue: [
         { id: 1, name: 'Radio 1', source: 'source1' },
         { id: 2, name: 'Radio 2', source: 'source2' }
      ],
      currTrack: 'source1',
      handleSnackbarMsg: jest.fn(),
      handleSnackbarType: jest.fn()
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });
   
   it('renders queue list correctly', () => {
      render(<QueueList {...mockProps} />);
      
      expect(screen.getByText('Очередь радио:')).toBeInTheDocument();
      expect(screen.getByText('Radio 1')).toBeInTheDocument();
      expect(screen.getByText('Radio 2')).toBeInTheDocument();
   });
   
      it('marks current playing track', () => {
         render(<QueueList {...mockProps} />);

      const listItems = screen.getAllByRole('listitem');
      const playingItem = listItems.find(item => 
         within(item).queryByText('Radio 1')
      );

      expect(playingItem).toBeDefined();
      expect(playingItem).toHaveClass('queue-list__item--playing');
   });

   it('loads favorites on mount', async () => {
      const mockFavorites = {
         stations: [
         { id: 1, name: 'Favorite 1', source: 'source1' }
         ]
      };
      
      (radioService.getFavorites as jest.Mock).mockResolvedValue(mockFavorites);
      
      render(<QueueList {...mockProps} />);
      
      await waitFor(() => {
         expect(screen.getByText('Favorite 1')).toBeInTheDocument();
      });
   });

   it('handles getFavorites error', async () => {
      const mockError = { error: 'Failed to load favorites' };
      (radioService.getFavorites as jest.Mock).mockResolvedValue(mockError);
      
      render(<QueueList {...mockProps} />);
      
      await waitFor(() => {
         expect(mockProps.handleSnackbarMsg).toHaveBeenCalledWith(mockError.error);
      });
      await waitFor(() => {
         expect(mockProps.handleSnackbarType).toHaveBeenCalledWith('error');

         });
   });

   it('handles like button click for non-liked item', async () => {
      (radioService.getFavorites as jest.Mock).mockResolvedValue({ stations: [] });
      (radioService.postFavorites as jest.Mock).mockResolvedValue({});
      
      render(<QueueList {...mockProps} />);
      
      const likeButton = screen.getAllByRole('button')[0];
      fireEvent.click(likeButton);
      
      await waitFor(() => {
         expect(radioService.postFavorites).toHaveBeenCalledWith('Radio 1');
      });
   });

   it('handles like/unlike errors', async () => {
      const mockError = { error: 'Operation failed' };
      (radioService.postFavorites as jest.Mock).mockResolvedValue(mockError);
      
      render(<QueueList {...mockProps} />);
      
      const likeButton = screen.getAllByRole('button')[0];
      fireEvent.click(likeButton);
      
      await waitFor(() => {
         expect(mockProps.handleSnackbarMsg).toHaveBeenCalledWith(mockError.error);
      });
      await waitFor(() => {
         expect(mockProps.handleSnackbarType).toHaveBeenCalledWith('error');

      });
   });
});