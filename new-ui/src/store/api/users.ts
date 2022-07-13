import http from '../helpers/http';
import { usersApi } from "../../api/http";

export const signUp = async (data : any) => usersApi.registerUser({
  name: data.name,
  email: data.email,
  username: data.username,
  password: data.password,
});

export const postResendEmail = async (username : any) => usersApi.resendEmail(username);

export const postRecoverPassword = async (email : any) => usersApi.recoverPassword(email);

export const postValidationAccount = async (data : any) => usersApi.getValidateAccount({email : data.email, token : data.token});

// TODO
export const putSecurity = async (data : any) => http().put(`/users/security/${data.id}`, {
  session_record: data.status,
});

export const getSecurity = async () => http().get('/users/security'); // TODO

export const postUpdatePassword = async (data : any) =>usersApi.updateUserPassword(data.id, {
  current_password: data.password,
  new_password: data.new_password,
} );

export const patchUserData = async (data : any) => usersApi.updateUserData(data.id, {
  name: data.name,
  username: data.username,
  email: data.email,
});

export const patchUserPassword = async (data : any) => usersApi.updateUserPassword(data.id,{
  current_password: data.currentPassword,
  new_password: data.newPassword,
});
