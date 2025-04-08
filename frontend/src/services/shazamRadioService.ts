import axios from "axios";

export interface IShazamResponse {
   message: string;
}; 

class shazamRadioService {
   private readonly baseUrl: string = 'http://localhost:8000';

   async recognize(radio_url: string, token: string): Promise<IShazamResponse> {
      try {
         const response = await axios.get(`${this.baseUrl}/recognize`, {
            params: { radio_url: radio_url },
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
            }
         });
         if (response?.data?.message) return { message: response.data.message }
         return {message: 'К сожалению, мы пока не знаем такого трека' };
      }
      catch (e) {
         return { message: 'К сожалению, мы пока не знаем такого трека' };
      }
   };
};

export const shazamRadio = new shazamRadioService();