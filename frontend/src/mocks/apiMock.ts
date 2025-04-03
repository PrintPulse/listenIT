import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { IRadioItem } from '../types';

const mock = new MockAdapter(axios);
const BASE_URL = 'http://localhost:8000';

// Моки для radioService
const mockRadioStations: IRadioItem[] = [
  { id: 1, name: "Radio 1", source: "http://example.com/stream1" },
  { id: 2, name: "Radio 2", source: "http://example.com/wwwwwwwww2" },
  { id: 3, name: "Radio 3", source: "http://example.com/emkvckermvkm3" }
];

mock.onGet(`${BASE_URL}/radio`).reply(200, mockRadioStations);
mock.onGet(`${BASE_URL}/favorite`).reply((config) => {
  const token = config.headers?.['Authorization'];
  if (token) {
    return [200, mockRadioStations.slice(0, 2)];
  }
  return [401, { detail: "ошибка, пользователь не авторизован" }];
});

mock.onPost(`${BASE_URL}/favorite`).reply((config) => {
  const token = config.headers?.['Authorization'];
  if (token) {
    return [200, mockRadioStations];
  }
  return [401, { detail: "ошибка, пользователь не авторизован" }];
});

mock.onDelete(`${BASE_URL}/favorite`).reply((config) => {
  const token = config.headers?.['Authorization'];
  if (token) {
    return [200, mockRadioStations];
  }
  return [401, { detail: "ошибка, пользователь не авторизован" }];
});

// Моки для authService
mock.onGet(`${BASE_URL}/users/me`).reply((config) => {
  const token = config.headers?.['Authorization'];
  if (token) {
    return [200, { is_active: true }];
  }
  return [401, { detail: "Could not validate credentials" }];
});

mock.onPost(`${BASE_URL}/auth/jwt/login`).reply((config) => {
   const formData = new URLSearchParams(config.data);
   const username = formData.get('username');
   const password = formData.get('password');
   const grantType = formData.get('grant_type');

   if (grantType === 'password' && username === 'test@test.com' && password === 'password') {
     return [200, { access_token: 'mock_token' }];
   }
   return [400, { detail: "LOGIN_BAD_CREDENTIALS" }];
 });

mock.onPost(`${BASE_URL}/auth/jwt/logout`).reply((config) => {
  const token = config.headers?.['Authorization'];
  if (token) {
    return [200, {}];
  }
  return [401, { detail: "Could not validate credentials" }];
});

mock.onPost(`${BASE_URL}/auth/register`).reply((config) => {
  const { email, password } = JSON.parse(config.data);
  if (email && password) {
    return [201, { is_active: true }];
  }
  return [422, { detail: [{ msg: "Invalid input" }] }];
});

mock.onPost(`${BASE_URL}/auth/forgot-password`).reply((config) => {
  const { email } = JSON.parse(config.data);
  if (email) {
    return [200, { token: 'reset_token' }];
  }
  return [422, { detail: [{ msg: "Invalid email" }] }];
});

mock.onPost(`${BASE_URL}/auth/reset-password`).reply((config) => {
  const { token, password } = JSON.parse(config.data);
  if (token && password) {
    return [200, {}];
  }
  return [400, { detail: "Invalid token" }];
});
export { mock };