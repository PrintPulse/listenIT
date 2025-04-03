import axios from 'axios';
import {
  isUserAuthed,
  loginUser,
  logoutUser,
  registerUser,
  resetPassStep1,
  resetPassStep2,
} from '../authService';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('isUserAuthed', () => {
    it('должна возвращать { is_active: true } при успешной проверке токена', async () => {
      // Мокаем успешный ответ сервера
      mockedAxios.get.mockResolvedValueOnce({ data: { is_active: true } });
      
      const result = await isUserAuthed('test-token');
      expect(result).toEqual({ is_active: true });
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/users/me', {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      });
    });
    it('должна обрабатывать ошибку и возвращать объект с error', async () => {
      const errorMessage = 'ошибка авторизации';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      const result = await isUserAuthed('test-token');
      expect(result).toEqual({ error: errorMessage });
    });
  });
  describe('loginUser', () => {
    it('должна возвращать access token при успешном логине', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { access_token: 'test-token' } });
      
      const result = await loginUser('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/jwt/login',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    });
    it('должна обрабатывать ошибку логина', async () => {
      const errorResponse = { msg: 'ошибка, попробуйте ещё раз' };
      mockedAxios.post.mockRejectedValueOnce({ response: { data: errorResponse } });
      
      const result = await loginUser('test@test.com', 'wrong-password');
      expect(result).toEqual({ error: 'ошибка, попробуйте ещё раз' });
    });
  });
  describe('logoutUser', () => {
    it('должна успешно разлогинить пользователя', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });
      
      const result = await logoutUser('test-token');
      expect(result).toEqual({});
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/jwt/logout',
        {},
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });
    it('должна обрабатывать ошибку logout', async () => {
      const error = new Error('Logout failed');
      mockedAxios.post.mockRejectedValueOnce(error);
      
      const result = await logoutUser('test-token');
      expect(result).toEqual({ error });
    });
  });
  describe('registerUser', () => {
    it('должна успешно регистрировать пользователя', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { is_active: true } });
      
      const result = await registerUser('test@test.com', 'password');
      expect(result).toEqual({ is_active: true });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/register',
        { email: 'test@test.com', password: 'password' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
    it('должна обрабатывать ошибку регистрации', async () => {
      const errorResponse = { msg: 'пользователь уже существует' };
      mockedAxios.post.mockRejectedValueOnce({ response: { data: errorResponse } });
      
      const result = await registerUser('test@test.com', 'password');
      expect(result).toEqual({ error: 'ошибка, попробуйте ещё раз' });
    });
  });
  describe('resetPassStep1', () => {
    it('должна успешно инициировать сброс пароля', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { token: 'reset-token' } });
      
      const result = await resetPassStep1('test@test.com');
      expect(result).toEqual({ token: 'reset-token' });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/forgot-password',
        { email: 'test@test.com' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
    it('должна обрабатывать ошибку инициирования сброса пароля', async () => {
      const errorResponse = { msg: 'ошибка, попробуйте ещё раз' };
      mockedAxios.post.mockRejectedValueOnce({ response: { data: errorResponse } });
      
      const result = await resetPassStep1('nonexistent@test.com');
      expect(result).toEqual({ error: 'ошибка, попробуйте ещё раз' });
    });
  });
  describe('resetPassStep2', () => {
    it('должна успешно сбросить пароль', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });
      
      const result = await resetPassStep2('reset-token', 'new-password');
      expect(result).toEqual({});
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/reset-password',
        { token: 'reset-token', password: 'new-password' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
    it('должна обрабатывать ошибку сброса пароля', async () => {
      const errorResponse = { msg: 'Invalid token' };
      mockedAxios.post.mockRejectedValueOnce({ response: { data: errorResponse } });
      
      const result = await resetPassStep2('invalid-token', 'new-password');
      expect(result).toEqual({ error: 'ошибка, попробуйте ещё раз' });
    });
  });
});