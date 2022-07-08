import http from '../helpers/http';

export const postFirewall = async (data : any) => http().post('/firewall/rules', {
  priority: parseInt(data.priority, 10),
  action: data.policy,
  active: data.status === 'active',
  filter: data.filter,
  source_ip: data.source_ip,
  username: data.username,
});

export const fetchFirewalls = async (perPage : any, page : any) => http().get(`/firewall/rules?per_page=${perPage}&page=${page}`);

export const getFirewall = async (id : any) => http().get(`/firewall/rules/${id}`);

export const putFirewall = async (data : any) => http().put(`/firewall/rules/${data.id}`, {
  priority: parseInt(data.priority, 10),
  action: data.policy,
  filter: data.filter,
  active: data.status === 'active',
  source_ip: data.source_ip,
  username: data.username,
});

export const removeFirewall = async (id : any) => http().delete(`/firewall/rules/${id}`);
