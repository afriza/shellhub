import { usersApi, defaultApi } from "../../api/http";

export const login = async (user: any) =>  usersApi.login(user);

export const info = async () => defaultApi.getInfo();
