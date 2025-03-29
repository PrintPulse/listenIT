import axios from "axios";
import { IRadioItem } from "../types";

interface IRadioResponse {
   stations: IRadioItem[];
   error?: string;
};

class RadioService {
   private readonly baseUrl: string = 'http://localhost:8000';

   async getRadio(): Promise<IRadioResponse> {
      try {
         const response = await axios.get(`${this.baseUrl}/radio`);
         return { stations: response.data };
      }
      catch (e) {
         return { stations: [], error: 'ошибка при получении списка радио' };
      }
   };
   async getFavorites(): Promise<IRadioResponse> {
      const token = localStorage.getItem('token');

      if (token) {
         try {
            const response = await axios.get(`${this.baseUrl}/favorite`,
               {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json'
                  }
               }
            );
            return { stations: response.data };
         }
         catch (e) {
            const axiosError = e as any;
            if (axiosError.response?.data?.detail) {
               return { stations: [], error: axiosError.response.data.detail };
            }
            return { stations: [], error: 'ошибка при получении избранного радио' };
         }
      }
      else {
         throw new Error('ошибка, пользователь не авторизован');
      }
   };
   async postFavorites(name: string): Promise<IRadioResponse> {
      const token = localStorage.getItem('token');

      if (token) {
         try {
            const response = await axios.post(`${this.baseUrl}/favorite`, 
               { name },
               {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json'
                  }
               }
            );
            return { stations: response.data };
         }
         catch (e) {
            const axiosError = e as any;
            if (axiosError.response?.data?.detail) {
               return { stations: [], error: axiosError.response.data.detail };
            }
            return { stations: [], error: 'ошибка при добавлении радио в избранное' };
         }
      }
      else {
         throw new Error('ошибка, пользователь не авторизован');
      }
   };
   async deleteFavorite(name: string): Promise<IRadioResponse> {
      const token = localStorage.getItem('token');

      if (token) {
         try {
            const response = await axios.delete(`${this.baseUrl}/favorite`, {
               data: { name },
               headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
               }
            });
            return { stations: response.data };
         }
         catch (e) {
            const axiosError = e as any;
            if (axiosError.response?.data?.detail) {
               return { stations: [], error: axiosError.response.data.detail };
            }
            return { stations: [], error: 'ошибка при удалении радио из избранного' };
         }
      }
      else {
         throw new Error('ошибка, пользователь не авторизован');
      }
   };
};

export const radioService = new RadioService();