import http from "../helpers/http";
import { sessionsApi } from "../../api/http";

export const fetchSessions = async (page: any, perPage: any) => {
  return sessionsApi.getSessions(page, perPage);
};

export const getSession = async (uid: string) => sessionsApi.getSession(uid);

export const deleteSessionLogs = async (uid: string) =>
  sessionsApi.clsoeSession(uid); // http().delete(`/sessions/${uid}/record`);

export const closeSession = async (session: any) =>
  http().post(`/sessions/${session.uid}/close`, { device: session.device_uid }); // TODO

export const getLog = async (uid: string) =>
  http().get(`/sessions/${uid}/play`);
