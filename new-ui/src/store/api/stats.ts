import http from '../helpers/http';

export default async () => http().get('/stats');
