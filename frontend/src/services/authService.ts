import axios, { AxiosError } from 'axios';

interface IErrorResponse {
   detail?: string;
   description?: string;
};

interface IValidationError {
   loc?: (string | number)[];
   msg?: string;
   type?: string;
   reason?: string;
};

interface IHTTPValidationError {
   detail: IValidationError[];
};

const isUserAuthed = async (token: string) => {
   try {
      const response = await axios.get('http://localhost:8000/users/me', {
         headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
         },
      });

      return { is_active: response.data.is_active };
   }
   catch (error) {
      const errorMessage = handleAxiosError(error);
      return { error: errorMessage };
   }
};

const loginUser = async (username: string, password: string) => {
   try {
      const response = await axios.post('http://localhost:8000/auth/jwt/login',
         new URLSearchParams({ username, password, grant_type: 'password' }), 
         {
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
         }
      );

      return { access_token: response.data.access_token };
   }
   catch (error) {
      const errorMessage = handleValidationError(error);
      return { error: errorMessage };
   }
};

const logoutUser = async (token: string) => {
   try {
      const response = await axios.post('http://localhost:8000/auth/jwt/logout', {}, {
         headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
         }
      });
      
      return response.data;
   }
   catch (error) {
      return { error: error };
   }
};

const registerUser = async (email: string, password: string) => {
   try {
      const response = await axios.post('http://localhost:8000/auth/register', 
         { email: email, password: password }, 
         {
               headers: {
                  'Content-Type': 'application/json',
               }
         }
      );
      
      return { is_active: response.data.is_active };
   }
   catch (error) {
      const errorMessage = handleAxiosError(error);
      return { error: errorMessage };
   }
};

const resetPassStep1 = async (email: string) => {
   try {
      const response = await axios.post('http://localhost:8000/auth/forgot-password', 
         { email: email }, 
         {
               headers: {
                  'Content-Type': 'application/json',
               }
         }
      );
      
      return {token: response.data.token};
   }
   catch (error) {
      const errorMessage = handleValidationError(error);
      return { error: errorMessage };
   }
};

const resetPassStep2 = async (token: string, password: string) => {
   try {
      const response = await axios.post('http://localhost:8000/auth/reset-password', 
         { token: token, password: password }, 
         {
               headers: {
                  'Content-Type': 'application/json',
               }
         }
      );
      
      return response.data;
   }
   catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
         let errorMessage;

         if (axiosError.response.status === 400) {
               handleAxiosError(error);
         } 
         else if (axiosError.response.status === 422) {
               handleValidationError(error);
         }
         return { error: errorMessage };
      }

      return { error: 'ошибка, попробуйте еще раз' };
   }
};

const handleAxiosError = (error: unknown) => {
   const axiosError = error as AxiosError;

   if (axiosError.response) {
      const errorData = axiosError.response.data as IErrorResponse;
      return (errorData.detail ?? errorData.description) || 'ошибка, попробуйте еще раз';
   }
   return 'ошибка, попробуйте еще раз';
};

const handleValidationError = (error: unknown) => {
   const axiosError = error as AxiosError;

   if (axiosError.response) {
      const errorData = axiosError.response.data as IHTTPValidationError;
      const messages = errorData.detail.map(err => err.msg).join(', ') || errorData.detail.map(err => err.reason).join(', ') || 'ошибка, попробуйте еще раз';
      return messages;
   }
   return 'ошибка, попробуйте еще раз';
}

export { isUserAuthed, loginUser, logoutUser, registerUser, resetPassStep1, resetPassStep2 };