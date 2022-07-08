import http from '../helpers/http';

export const login = async (user : any) => http().post('/login', user);

export const info = async () => http().get('/auth/user');
