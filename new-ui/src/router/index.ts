import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "../views/Dashboard.vue";
import Devices from "../views/Devices.vue";

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
    component: () => import("../views/Devices.vue"),
    redirect: {
      name: "listDevices",
    },
    children: [
      {
        path: "",
        name: "listDevices",
        component: () => import("../components/Devices/DeviceList.vue"),
      },
      {
        path: "pending",
        name: "pendingDevices",
        component: () => import("../components/Devices/DevicePendingList.vue"),
      },
      {
        path: "rejected",
        name: "rejectedDevices",
        component: () => import("../components/Devices/DeviceRejectedList.vue"),
      },
    ],
  },
  {
    path: '/device/:id',
    name: 'detailsDevice',
    component: () => import('../views/DetailsDevice.vue'),
  },
  {
    path: "/sessions",
    name: "Sessions",
    component: () => import("../views/Sessions.vue"),
  },
  {
    path: '/sessions/:id',
    name: 'detailsSession',
    component: () => import('../views/DetailsSessions.vue'),
  },
  {
    path: '/firewall/rules',
    name: 'firewalls',
    component: () => import('../views/FirewallRules.vue'),
  },
  {
    path: '/sshkeys/public-keys',
    name: 'publicKeys',
    component: () => import('../views/PublicKeys.vue'),
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
