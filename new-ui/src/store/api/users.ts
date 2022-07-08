import http from '../helpers/http';

export const signUp = async (data : any) => http().post('/register', {
  name: data.name,
  email: data.email,
  username: data.username,
  password: data.password,
});

export const postResendEmail = async (username : any) => http().post('/user/resend_email', {
  username,
});

export const postRecoverPassword = async (email : any) => http().post('/user/recover_password', {
  email,
});

export const postValidationAccount = async (data : any) => http().get(
  `/user/validation_account?email=${data.email}&token=${data.token}`,
);

export const postUpdatePassword = async (data : any) => http().post(`/user/${data.id}/update_password`, {
  password: data.password,
  token: data.token,
});

export const patchUserData = async (data : any) => http().patch(`/users/${data.id}/data`, {
  name: data.name,
  username: data.username,
  email: data.email,
});

export const patchUserPassword = async (data : any) => http().patch(`/users/${data.id}/password`, {
  current_password: data.currentPassword,
  new_password: data.newPassword,
});

export const putSecurity = async (data : any) => http().put(`/users/security/${data.id}`, {
  session_record: data.status,
});

export const getSecurity = async () => http().get('/users/security');
