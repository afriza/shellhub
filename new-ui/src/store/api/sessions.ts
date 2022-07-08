import http from '../helpers/http';

export const fetchSessions = async (perPage : any, page : any) => http().get(`/sessions?per_page=${perPage}&page=${page}`);

export const getSession = async (uid : any) => http().get(`/sessions/${uid}`);

export const deleteSessionLogs = async (uid : any) => http().delete(`/sessions/${uid}/record`);

export const closeSession = async (session : any) => http().post(`/sessions/${session.uid}/close`, { device: session.device_uid });

export const getLog = async (uid : any) => http().get(`/sessions/${uid}/play`);
