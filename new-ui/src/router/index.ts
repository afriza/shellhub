import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "../views/Dashboard.vue";
import Devices from "../views/Devices.vue";
import { envVariables } from "../envVariables";
import DeviceList from "../components/Devices/DeviceList.vue";
import DevicePendingList from "../components/Devices/DevicePendingList.vue";
import DeviceRejectedList from "../components/Devices/DeviceRejectedList.vue";
import DetailsDevice from "../views/DetailsDevice.vue";
import Sessions from "../views/Sessions.vue";
import DetailsSessions from "../views/DetailsSessions.vue";
import FirewallRules from "../views/FirewallRules.vue";
import PublicKeys from "../views/PublicKeys.vue";
import Settings from "../views/Settings.vue";
import SettingProfile from "../components/Setting/SettingProfile.vue";
import SettingNamespace from "../components/Setting/SettingNamespace.vue";
import SettingPrivateKeys from "../components/Setting/SettingPrivateKeys.vue";
import SettingTags from "../components/Setting/SettingTags.vue";
import SettingBilling from "../components/Setting/SettingBilling.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/forgot-pass",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/devices",
    name: "devices",
    component: Devices,
    redirect: {
      name: "listDevices",
    },
    children: [
      {
        path: "",
        name: "listDevices",
        component: DeviceList,
      },
      {
        path: "pending",
        name: "pendingDevices",
        component: DevicePendingList,
      },
      {
        path: "rejected",
        name: "rejectedDevices",
        component: DeviceRejectedList,
      },
    ],
  },
  {
    path: "/device/:id",
    name: "detailsDevice",
    component: DetailsDevice,
  },
  {
    path: "/sessions",
    name: "Sessions",
    component: Sessions,
  },
  {
    path: "/sessions/:id",
    name: "detailsSession",
    component: DetailsSessions,
  },
  {
    path: "/firewall/rules",
    name: "firewalls",
    component: FirewallRules,
  },
  {
    path: "/sshkeys/public-keys",
    name: "publicKeys",
    component: PublicKeys,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    redirect: {
      name: "profileSettings",
    },
    children: [
      {
        path: "profile",
        name: "profileSettings",
        component: SettingProfile,
      },
      {
        path: "namespace-manager",
        name: "namespaceSettings",
        component: SettingNamespace,
      },
      {
        path: "private-keys",
        name: "privateKeysSettings",
        component: SettingPrivateKeys,
      },
      {
        path: "tags",
        name: "tagsSettings",
        component: SettingTags,
      },
      {
        path: "billing",
        name: "billingSettings",
        beforeEnter: (to, from, next) => {
          const enabled = envVariables.billingEnable;
          if (enabled) {
            next();
          } else {
            next("/invalid");
          }
        },
        component: SettingBilling,
      },
    ],
  },
  {
    path: "/teste",
    name: "Teste",
    component: () => import("../views/Teste.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
