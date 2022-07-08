import { Module } from "vuex";
import { State } from "./../index";

import * as apiDevice from "../api/devices";
import * as apiBilling from "../api/billing";

export interface DevicesState {
  devices: Array<any>;
  device: any;
  numberDevices: number;
  page: number;
  perPage: number;
  filter: null | string;
  status: string;
  sortStatusField: null | string;
  sortStatusString: string;
  deviceChooserStatus: boolean;
  devicesForUserToChoose: any;
  numberdevicesForUserToChoose: number;
  devicesSelected: any;
}

export const devices: Module<DevicesState, State> = {
  namespaced: true,
  state: {
    devices: [],
    device: {},
    numberDevices: 0,
    page: 0,
    perPage: 0,
    filter: null,
    status: "",
    sortStatusField: null,
    sortStatusString: "",
    deviceChooserStatus: false,
    devicesForUserToChoose: [],
    numberdevicesForUserToChoose: 0,
    devicesSelected: [],
  },

  getters: {
    list: (state) => state.devices,
    get: (state) => state.device,
    getNumberDevices: (state) => state.numberDevices,
    getPage: (state) => state.page,
    getPerPage: (state) => state.perPage,
    getFilter: (state) => state.filter,
    getStatus: (state) => state.status,
    getFirstPending: (state) => state.device,
    getDeviceChooserStatus: (state) => state.deviceChooserStatus,
    getDevicesForUserToChoose: (state) => state.devicesForUserToChoose,
    getNumberForUserToChoose: (state) => state.numberdevicesForUserToChoose,
    getDevicesSelected: (state) => state.devicesSelected,
  },

  mutations: {
    setDevices: (state, res) => {
      state.devices = res.data;
      state.numberDevices = parseInt(res.headers["x-total-count"], 10);
    },

    removeDevice: (state, uid) => {
      state.devices.splice(
        state.devices.findIndex((d) => d.uid === uid),
        1
      );
    },

    renameDevice: (state, data) => {
      const { device } = state;
      device.name = data.name;
      state.device = device;
    },

    setDevice: (state, data) => {
      state.device = data;
    },

    setPagePerpageFilter: (state, data) => {
      state.page = data.page;
      state.perPage = data.perPage;
      state.filter = data.filter;
      state.status = data.status;
      state.sortStatusField = data.sortStatusField;
      state.sortStatusString = data.sortStatusString;
    },

    setFilter: (state, filter) => {
      state.filter = filter;
    },

    setDeviceChooserStatus: (state, status) => {
      state.deviceChooserStatus = status;
    },

    setDevicesForUserToChoose: (state, res) => {
      state.devicesForUserToChoose = res.data;
      state.numberdevicesForUserToChoose = parseInt(
        res.headers["x-total-count"],
        10
      );
    },

    setDevicesSelected: (state, data) => {
      state.devicesSelected = data;
    },

    clearListDevices: (state) => {
      state.devices = [];
      state.numberDevices = 0;
    },

    clearObjectDevice: (state) => {
      state.device = [];
    },

    clearListDevicesForUserToChoose: (state) => {
      state.devicesForUserToChoose = [];
      state.numberdevicesForUserToChoose = 0;
    },
  },

  actions: {
    fetch: async (context, data) => {
      try {
        const res = await apiDevice.fetchDevices(
          data.perPage,
          data.page,
          data.filter,
          data.status,
          data.sortStatusField,
          data.sortStatusString
        );
        context.commit("setDevices", res);
        context.commit("setPagePerpageFilter", data);
      } catch (error) {
        context.commit("clearListDevices");
        throw error;
      }
    },

    remove: async (context, uid) => {
      await apiDevice.removeDevice(uid);
    },

    rename: async (context, data) => {
      await apiDevice.renameDevice(data);
      context.commit("renameDevice", data);
    },

    get: async (context, uid) => {
      try {
        const res = await apiDevice.getDevice(uid);
        context.commit("setDevice", res.data);
      } catch (error) {
        context.commit("clearObjectDevice");
        throw error;
      }
    },

    accept: async (context, uid) => {
      await apiDevice.acceptDevice(uid);
    },

    reject: async (context, uid) => {
      await apiDevice.rejectDevice(uid);
    },

    setFilter: async (context, filter) => {
      context.commit("setFilter", filter);
    },

    refresh: async ({ commit, state }) => {
      try {
        const res = await apiDevice.fetchDevices(
          state.perPage,
          state.page,
          state.filter,
          state.status,
          state.sortStatusField,
          state.sortStatusString
        );
        commit("setDevices", res);
      } catch (error) {
        commit("clearListDevices");
        throw error;
      }
    },

    setFirstPending: async (context) => {
      try {
        const res = await apiDevice.fetchDevices(
          1,
          1,
          null,
          "pending",
          null,
          ""
        );
        context.commit("setDevice", res.data[0]);
      } catch (error) {
        context.commit("clearObjectDevice");
        throw error;
      }
    },

    setDeviceChooserStatus: async (context, status) => {
      context.commit("setDeviceChooserStatus", status);
    },

    setDevicesForUserToChoose: async (context, data) => {
      try {
        const res = await apiDevice.fetchDevices(
          data.perPage,
          data.page,
          data.filter,
          data.status,
          data.sortStatusField,
          data.sortStatusString
        );
        context.commit("setDevicesForUserToChoose", res);
        context.commit("setPagePerpageFilter", data);
      } catch (error) {
        context.commit("clearListDevicesForUserToChoose");
        throw error;
      }
    },

    setDevicesSelected: (context, data) => {
      context.commit("setDevicesSelected", data);
    },

    postDevicesChooser: async (context, data) => {
      await apiBilling.postDevicesChooser(data);
    },

    getDevicesMostUsed: async (context) => {
      try {
        const res = await apiBilling.getDevicesMostUsed();
        context.commit("setDevicesForUserToChoose", res);
      } catch (error) {
        context.commit("clearListDevicesForUserToChoose");
        throw error;
      }
    },

    resetListDevices: async (context) => {
      context.commit("clearListDevices");
    },

    updateDeviceTag: async (context, data) => {
      await apiDevice.updateDeviceTag(data);
    },
  },
};
