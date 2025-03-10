import axios, { AxiosError } from 'axios';

interface IUser {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
};

const isUserAuthed = async (token: string): Promise<IUser> => {
    try {
        const response = await axios.get<IUser>('http://localhost:8000/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }
    catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw new Error('ошибка получения данных пользователя');
        } 
        else {
            console.error('ошибка:', axiosError.message);
            throw new Error('ошибка получения данных пользователя');
        }
    }
};

export { isUserAuthed };