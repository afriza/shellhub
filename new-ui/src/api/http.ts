import * as axiosTs from "./client";
import { Configuration } from "./client";

const configuration = new Configuration();
// configuration.basePath = `${window.location.protocol}//${window.location.host}`;
configuration.basePath = `${window.location.protocol}//localhost:4010`;
configuration.accessToken = localStorage.getItem("token") || "";

const sessionsApi = new axiosTs.SessionsApi(configuration);
const devicesApi = new axiosTs.DevicesApi(configuration);
const defaultApi = new axiosTs.DefaultApi(configuration);
const namespacesApi = new axiosTs.NamespacesApi(configuration);
const sshApi = new axiosTs.SshApi(configuration);
const tagsApi = new axiosTs.TagsApi(configuration);
const usersApi = new axiosTs.UsersApi(configuration);
const billingApi = new axiosTs.BillingApi(configuration);

export { sessionsApi, devicesApi, defaultApi, namespacesApi, sshApi, tagsApi, usersApi, billingApi };
