import axios, { AxiosError } from 'axios';

interface ErrorResponse {
    detail?: string;
}

const isUserAuthed = async (token: string): Promise<boolean> => {
    try {
        const response = await axios.get('http://localhost:8000/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.is_active;
    }
    catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            throw new Error('ошибка получения данных пользователя');
        } 
        throw new Error(axiosError.message);
    }
};

const loginUser = async (username: string, password: string): Promise<string> => {
    try {
        const response = await axios.post('http://localhost:8000/auth/jwt/login',
            new URLSearchParams({ username, password, grant_type: 'password'}), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.access_token;
    }
    catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            throw new Error('ошибка получения данных пользователя');
        } 
        throw new Error(axiosError.message);
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
        
        return response.data
    }
    catch (error) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
            throw new Error(`ошибка: ${error}`);
        } 
        throw new Error(axiosError.message);
    }
};

const registerUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://localhost:8000/auth/register', 
            { email: email, password: password }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        return response.data.is_active;
    }
    catch (error) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
            throw new Error(`ошибка: ${error}`);
        } 
        throw new Error(axiosError.message);
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
        
        return response.data.token;
    }
    catch (error) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
            throw new Error(`ошибка: ${error}`);
        } 
        throw new Error(axiosError.message);
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
            const errorData = axiosError.response.data as ErrorResponse;
            return errorData.detail || `ошибка ${error}`;
        } 
        return axiosError.message || `ошибка ${error}`;
    }
};

export { isUserAuthed, loginUser, logoutUser, registerUser, resetPassStep1, resetPassStep2 };