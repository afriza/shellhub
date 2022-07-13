import http from '../helpers/http';
import { devicesApi, tagsApi } from "../../api/http";


export const postTag = async (data: any) => tagsApi.createDeviceTag(data.uid, data.name);

export const fetchDevices = async (
  page : any,
  perPage: any,
  filter : any,
  status : any,
  sortStatusField : any,
  sortStatusString : any,
) => {
  if (filter) return devicesApi.getDevices(filter, page, perPage);

  if (status) return devicesApi.getDevices(filter, page, perPage. status);

  if (sortStatusField && sortStatusString) {
    return devicesApi.getDevices(
      filter,
      page,
      perPage,
      status,
      sortStatusField,
      sortStatusString,
    );
  }

  return devicesApi.getDevices(filter, page, perPage);
};

export const getDevice = async (uid : any) =>  devicesApi.getDevice(uid);


export const renameDevice = async (data : any) =>  devicesApi.updateDeviceName(data.uid, data.name);

export const acceptDevice = async (uid : any) => http().patch(`/devices/${uid}/accept`); // TODO

export const rejectDevice = async (uid : any) => http().patch(`/devices/${uid}/reject`); // TODO

export const updateDeviceTag = async (data : any) => devicesApi.updateTagsDevice(data.uid, data.tags);

export const removeDevice = async (uid : any) => devicesApi.deleteDevice(uid);
