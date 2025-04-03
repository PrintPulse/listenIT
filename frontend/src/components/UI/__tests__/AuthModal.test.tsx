import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../../context/AuthContext';
import AuthModal from '../AuthModal';
import * as authService from '../../../services/authService';

jest.mock('../../../services/authService');

describe('AuthModal', () => {
   const mockOnSuccess = jest.fn();
   const mockHandleSnackbarMsg = jest.fn();
   const mockHandleSnackbarType = jest.fn();
   const mockSetIsAuthed = jest.fn();
   const defaultProps = {
      onSuccess: mockOnSuccess,
      handleSnackbarMsg: mockHandleSnackbarMsg,
      handleSnackbarType: mockHandleSnackbarType
   };
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('renders correctly in registration mode', () => {
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      expect(screen.getByText('Регистрация')).toBeInTheDocument();
   });

   it('switches between registration and login modes', () => {
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      
      fireEvent.click(screen.getByText('Уже есть аккаунт? Войти в систему'));
      expect(screen.getByText('Вход в систему')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Нет аккаунта? Зарегистрироваться'));
      expect(screen.getByText('Регистрация')).toBeInTheDocument();
   });

   it('handles input changes', () => {
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Пароль');
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(emailInput).toHaveValue('test@test.com');
      expect(passwordInput).toHaveValue('password123');
   });

   it('handles successful registration', async () => {
      const mockRegisterResponse = { is_active: true };
      (authService.registerUser as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Зарегистрироваться'));
      await waitFor(() => {
         expect(screen.getByText('Вы успешно зарегистрированы, войдите в аккаунт')).toBeInTheDocument();
      });
   });

   it('handles successful login', async () => {
      const mockLoginResponse = { access_token: 'test-token' };
      (authService.loginUser as jest.Mock).mockResolvedValueOnce(mockLoginResponse);
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      fireEvent.click(screen.getByText('Уже есть аккаунт? Войти в систему'));
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Войти'));
      await waitFor(() => {
         expect(mockSetIsAuthed).toHaveBeenCalledWith(true);
      });
      await waitFor(() => {
         expect(mockOnSuccess).toHaveBeenCalled();
      });
      await waitFor(() => {
         expect(mockHandleSnackbarMsg).toHaveBeenCalledWith('Вы успешно авторизованы');
      });
      await waitFor(() => {
         expect(mockHandleSnackbarType).toHaveBeenCalledWith('success');
      });
   });

   it('handles password reset flow', async () => {
      const mockResetResponse = { token: 'reset-token' };
      (authService.resetPassStep1 as jest.Mock).mockResolvedValueOnce(mockResetResponse);
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );

      fireEvent.click(screen.getByText('Уже есть аккаунт? Войти в систему'));
      fireEvent.click(screen.getByText('Забыли пароль? Восстановить пароль'));
      
      fireEvent.change(screen.getByPlaceholderText('Введите ваш Email'), { target: { value: 'test@test.com' } });
      fireEvent.click(screen.getByText('Отправить'));
      await waitFor(() => {
         expect(screen.getByText('Успех, перейдите к следующему этапу')).toBeInTheDocument();
      });
   });

   it('handles errors appropriately', async () => {
      const mockError = { error: 'Тестовая ошибка' };
      (authService.loginUser as jest.Mock).mockResolvedValueOnce(mockError);
      render(
         <AuthContext.Provider value={{ isAuthed: false, setIsAuthed: mockSetIsAuthed }}>
         <AuthModal {...defaultProps} />
         </AuthContext.Provider>
      );
      fireEvent.click(screen.getByText('Уже есть аккаунт? Войти в систему'));
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Войти'));
      await waitFor(() => {
         expect(screen.getByText('Тестовая ошибка')).toBeInTheDocument();
      });
   });
});