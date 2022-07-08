import http from '../helpers/http';

export const postPublicKey = async (data : any) => http().post('/sshkeys/public-keys', data);

export const fetchPublicKeys = async (perPage : any, page : any) => http().get(`/sshkeys/public-keys?per_page=${perPage}&page=${page}`);

export const getPublicKey = async (fingerprint : any) => http().get(`/sshkeys/public-keys/${fingerprint}`);

export const putPublicKey = async (data : any) => http().put(`/sshkeys/public-keys/${data.fingerprint}`, data);

export const removePublicKey = async (fingerprint : any) => http().delete(`/sshkeys/public-keys/${fingerprint}`);
