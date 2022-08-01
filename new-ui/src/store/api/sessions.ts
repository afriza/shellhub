import http from '../helpers/http';
import { sessionsApi } from "../../api/http";

export const fetchSessions = async (
    page : any,
    perPage: any,
    filter : any,
  ) => {
    if (filter) return sessionsApi.getSessions(filter, page, perPage);
  
    return sessionsApi.getSessions(filter, page, perPage);
  };

export const getSession = async (uid : string) =>  sessionsApi.getSession(uid);


export const deleteSessionLogs = async (uid : any) => sessionsApi.clsoeSession(uid); // http().delete(`/sessions/${uid}/record`);

export const closeSession = async (session : any) => http().post(`/sessions/${session.uid}/close`, { device: session.device_uid }); // TODO

export const getLog = async (uid : any) => sessionsApi.recordSession(uid); // http().get(`/sessions/${uid}/play`);
