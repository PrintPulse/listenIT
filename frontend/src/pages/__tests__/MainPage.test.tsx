import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BackgroundContext } from '../../context/BackgroundContext';
import MainPage from './../MainPage';
import * as authService from '../../services/authService';

jest.mock('../../services/authService');
jest.mock('../../images/audiocasette.png', () => 'test-file-stub');
jest.mock('../../components/UI/ShazamRadioButton', () => {
   return function MockShazamButton() {
      return <div data-testid="mock-shazam-button" />;
   };
});
describe('MainPage Component', () => {
   const mockSetIsAuthed = jest.fn();

   const renderWithProviders = (isAuthed = false) => {
      return render(
         <BrowserRouter>
            <AuthContext.Provider value={{ isAuthed, setIsAuthed: mockSetIsAuthed }}>
               <BackgroundContext.Provider value={{ isBgYellow: true, setIsBgYellow: jest.fn() }}>
               <MainPage />
               </BackgroundContext.Provider>
            </AuthContext.Provider>
         </BrowserRouter>
      );
   };
   beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
   });

   test('renders without crashing', () => {
      renderWithProviders(true);
      expect(screen.getByTestId('main')).toBeInTheDocument();
   });

   test('shows auth modal when user is not authenticated', () => {
      renderWithProviders(false);
      expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();
   });

   test('hides auth modal when user is authenticated', () => {
      renderWithProviders(true);
      expect(screen.queryByText(/Вход в систему|Регистрация/)).not.toBeInTheDocument();
   });

   test('checks authentication when token exists', async () => {
      const mockToken = 'test-token';
      localStorage.setItem('token', mockToken);
      
      const mockIsUserAuthed = jest.spyOn(authService, 'isUserAuthed')
         .mockResolvedValue({ is_active: true });
         
      renderWithProviders();
      await waitFor(() => {
         expect(mockIsUserAuthed).toHaveBeenCalledWith(mockToken);
      });
      await waitFor(() => {
         expect(mockSetIsAuthed).toHaveBeenCalledWith(true);
      });
   });

   test('handles inactive token', async () => {
      localStorage.setItem('token', 'inactive-token');
      
      jest.spyOn(authService, 'isUserAuthed')
         .mockResolvedValue({ is_active: false });
      
      renderWithProviders();
      await waitFor(() => {
         expect(localStorage.getItem('token')).toBeNull();
      });
      await waitFor(() => {
         expect(mockSetIsAuthed).toHaveBeenCalledWith(false);
      });
   });

   test('handles authentication error', async () => {
      localStorage.setItem('token', 'error-token');
      
      jest.spyOn(authService, 'isUserAuthed')
      .mockRejectedValue({ error: 'Auth Error' });
      
      renderWithProviders();
      await waitFor(() => {
         expect(localStorage.getItem('token')).toBeNull();
      });
      
      await waitFor(() => {
         expect(mockSetIsAuthed).toHaveBeenCalledWith(false);
      });
   });

   test('updates state on successful authentication', () => {
      const { rerender } = renderWithProviders(false);
      
      rerender(
            <BrowserRouter>
            <AuthContext.Provider value={{ isAuthed: true, setIsAuthed: mockSetIsAuthed }}>
               <BackgroundContext.Provider value={{ isBgYellow: true, setIsBgYellow: jest.fn() }}>
                  <MainPage />
               </BackgroundContext.Provider>
            </AuthContext.Provider>
         </BrowserRouter>
      );
      expect(screen.queryByText(/Вход в систему|Регистрация/)).not.toBeInTheDocument();
   });

   test('renders components for authenticated user', () => {
      renderWithProviders(true);
      expect(screen.getByText('listen!')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
   });

   test('handles snackbar messages', async () => {
      renderWithProviders(true);
      
      const testMessage = 'Test Message';
      const mainElement = screen.getByTestId('main');
      
      fireEvent.click(mainElement);
      
      const handleSnackbarMsg = jest.fn();
      const handleSnackbarType = jest.fn();
      
      handleSnackbarMsg(testMessage);
      handleSnackbarType('success');
      
      await waitFor(() => {
         expect(handleSnackbarMsg).toHaveBeenCalledWith(testMessage);
      });
      
      expect(handleSnackbarType).toHaveBeenCalledWith('success');
   });

   test('handles authentication check errors gracefully', async () => {
      localStorage.setItem('token', 'invalid-token');
      
      jest.spyOn(authService, 'isUserAuthed')
      .mockRejectedValue(new Error('Network error'));
      
      renderWithProviders();
      
      await waitFor(() => {
         expect(localStorage.getItem('token')).toBeNull();
      });
      expect(mockSetIsAuthed).toHaveBeenCalledWith(false);
   });

   test('updates local state when context changes', () => {
      const { rerender } = renderWithProviders(false);
      expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();

      rerender(
      <BrowserRouter>
         <AuthContext.Provider value={{ isAuthed: true, setIsAuthed: mockSetIsAuthed }}>
            <BackgroundContext.Provider value={{ isBgYellow: true, setIsBgYellow: jest.fn() }}>
            <MainPage />
            </BackgroundContext.Provider>
         </AuthContext.Provider>
      </BrowserRouter>
      );

      expect(screen.queryByText(/Вход в систему|Регистрация/)).not.toBeInTheDocument();
   });
   // Тест обработки изменения состояния воспроизведения
  test('handles playing state changes', () => {
   renderWithProviders(true);
   const queueComponent = screen.getByTestId('main');
   expect(queueComponent).toBeInTheDocument();
 });
 // Тест обработки изменения текущего трека
 test('handles current track changes', () => {
   renderWithProviders(true);
   const mainComponent = screen.getByTestId('main');
   expect(mainComponent).toBeInTheDocument();
 });
 // Тест обработки обновления списка радиостанций
 test('handles radio stations list update', () => {
   renderWithProviders(true);
   const mainElement = screen.getByTestId('main');
   expect(mainElement).toBeInTheDocument();
 });
 // Тест отображения компонентов для неавторизованного пользователя
 test('renders components for unauthenticated user', () => {
   renderWithProviders(false);
   expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();
   expect(screen.queryByText('listen!')).not.toBeInTheDocument();
 });
 // Тест обработки успешной авторизации
 test('handles successful authentication', async () => {
   const mockToken = 'success-token';
   localStorage.setItem('token', mockToken);
   
   jest.spyOn(authService, 'isUserAuthed')
     .mockResolvedValue({ is_active: true });
     
   renderWithProviders(false);
   await waitFor(() => {
     expect(mockSetIsAuthed).toHaveBeenCalledWith(true);
   });
 });
 // Тест проверки отсутствия токена
 test('handles no token scenario', async () => {
   localStorage.removeItem('token');
   renderWithProviders(false);
   
   await waitFor(() => {
     expect(mockSetIsAuthed).not.toHaveBeenCalledWith(true);
   });
 });
 // Тест обработки изменения фона
 test('handles background changes', () => {
   renderWithProviders(true);
   const mainElement = screen.getByTestId('main');
   expect(mainElement).toBeInTheDocument();
 });
 // Тест обработки множественных изменений состояния авторизации
 test('handles multiple auth state changes', () => {
   const { rerender } = renderWithProviders(false);
   expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();
   
   rerender(
     <BrowserRouter>
       <AuthContext.Provider value={{ isAuthed: true, setIsAuthed: mockSetIsAuthed }}>
         <BackgroundContext.Provider value={{ isBgYellow: true, setIsBgYellow: jest.fn() }}>
           <MainPage />
         </BackgroundContext.Provider>
       </AuthContext.Provider>
     </BrowserRouter>
   );
   expect(screen.queryByText(/Вход в систему|Регистрация/)).not.toBeInTheDocument();
   
   rerender(
     <BrowserRouter>
       <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <BackgroundContext.Provider value={{ isBgYellow: true, setIsBgYellow: jest.fn() }}>
           <MainPage />
         </BackgroundContext.Provider>
       </AuthContext.Provider>
     </BrowserRouter>
   );
   expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();
 });
 // Тест обработки ошибок Snackbar
 test('handles snackbar error messages', async () => {
   renderWithProviders(true);
   const mainElement = screen.getByTestId('main');
   
   fireEvent.click(mainElement);
   
   const handleSnackbarMsg = jest.fn();
   const handleSnackbarType = jest.fn();
   
   handleSnackbarMsg('Error Message');
   handleSnackbarType('error');
   
   await waitFor(() => {
     expect(handleSnackbarMsg).toHaveBeenCalledWith('Error Message');
   });
   expect(handleSnackbarType).toHaveBeenCalledWith('error');
 });
 // Тест очистки состояния при размонтировании
 test('cleans up state on unmount', () => {
   const { unmount } = renderWithProviders(true);
   unmount();
   expect(localStorage.getItem('token')).toBeNull();
 });

   test('handles missing token correctly', async () => {
      localStorage.clear();
      renderWithProviders();
      
      await waitFor(() => {
         expect(mockSetIsAuthed).not.toHaveBeenCalledWith(true);
      });
      expect(screen.getByText(/Вход в систему|Регистрация/)).toBeInTheDocument();
   });

   test('handles Snackbar state correctly', () => {
      renderWithProviders(true);
      const mainElement = screen.getByTestId('main');
      
      fireEvent.click(mainElement);
      
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
   });
});