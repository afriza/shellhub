import http from '../helpers/http';

export const postNamespace = async (data : any) => http().post('/namespaces', {
  name: data.name,
});

export const fetchNamespaces = async () => http().get('/namespaces');

export const getNamespace = async (id : any) => http().get(`/namespaces/${id}`);

export const removeNamespace = async (id : any) => http().delete(`/namespaces/${id}`);

export const putNamespace = async (data : any) => http().put(`/namespaces/${data.id}`, {
  name: data.name,
});

export const addUserToNamespace = async (data : any) => http().post(`/namespaces/${data.tenant_id}/members`, {
  username: data.username,
  role: data.role,
});

export const editUserToNamespace = async (data : any) => http().patch(`/namespaces/${data.tenant_id}/members/${data.user_id}`, {
  role: data.role,
});

export const removeUserFromNamespace = async (data : any) => http().delete(`/namespaces/${data.tenant_id}/members/${data.user_id}`);
export const tenantSwitch = async (data : any) => http().get(`/auth/token/${data.tenant_id}`);
