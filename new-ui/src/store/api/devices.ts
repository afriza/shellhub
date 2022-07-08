import http from '../helpers/http';


export const postTag = async (data: any) => http().post(`/devices/${data.uid}/tags`, { name: data.name });

export const fetchDevices = async (
  perPage: any,
  page : any,
  search : any,
  status : any,
  sortStatusField : any,
  sortStatusString : any,
) => {
  let query = `/devices?per_page=${perPage}&page=${page}&status=${status}`;

  if (search !== null) {
    query += `&filter=${search}`;
  }

  if (sortStatusField !== null) {
    query += `&sort_by=${sortStatusField}&order_by=${sortStatusString}`;
  }
  return http().get(query);
};

export const getDevice = async (uid : any) => http().get(`/devices/${uid}`);

export const renameDevice = async (data : any) => http().patch(`/devices/${data.uid}`, { name: data.name });

export const acceptDevice = async (uid : any) => http().patch(`/devices/${uid}/accept`);

export const rejectDevice = async (uid : any) => http().patch(`/devices/${uid}/reject`);

export const updateDeviceTag = async (data : any) => http().put(`/devices/${data.uid}/tags`, { tags: data.tags });

export const removeDevice = async (uid : any) => http().delete(`/devices/${uid}`);
