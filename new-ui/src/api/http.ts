import * as axiosTs from "./client";
import { Configuration } from "./client";

const configuration = new Configuration();
// configuration.basePath = `${window.location.protocol}//${window.location.host}`;
configuration.basePath = `${window.location.protocol}//localhost:4010`;
configuration.accessToken = localStorage.getItem("cloud_token") || "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW50b255IiwiYWRtaW4iOnRydWUsInRlbmFudCI6IjAwMDAwMDAwLTAwMDAtNDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImlkIjoiNjJjODY1NzhjNTg3YWMxNjQzZTQ2MzY4Iiwicm9sZSI6Im93bmVyIiwiY2xhaW1zIjoidXNlciIsImV4cCI6MTY1NzgyODcxOX0.PT07Nevna1Zz6LPUmwIolfyZr1STBE1JSYGkwDNfZyGP8AU9eg_TMuBueLl75lEnlSbaiS-N8k5rOUE7f7m1ZzcjAiSlAEm9mriTsGOiRKVuNy_gyKOeb0fOn1q53dO-k8PswzQb_LURZNiDDr46g9XEBaCUBuiQse9i63UJ3JuMku5oyyB3nBXITb4V0nrwlqi_dXEQw60lYGR3_akPIj05XO4Y3jk6jk-9tGqFTjqiuKXYz9mgVXrzNdzmiN9Yv4fBCp9UIEOsm9EC6VB5Qh8m45B7x7MjABLmN9dAn3m-M7lBZ9oxZe4lyFbpJzvgsYw_WD1iyf9nAGATDk1xww";

const sessionsApi = new axiosTs.SessionsApi(configuration);
const devicesApi = new axiosTs.DevicesApi(configuration);
const defaultApi = new axiosTs.DefaultApi(configuration);
const namespacesApi = new axiosTs.NamespacesApi(configuration);
const sshApi = new axiosTs.SshApi(configuration);
const tagsApi = new axiosTs.TagsApi(configuration);
const usersApi = new axiosTs.UsersApi(configuration);

export { sessionsApi, devicesApi, defaultApi, namespacesApi, sshApi, tagsApi, usersApi };
