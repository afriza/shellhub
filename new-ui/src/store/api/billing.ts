import http from '../helpers/http';
// TODO
export const subscritionPaymentMethod = async (data: any) => http().post('/billing/subscription', data);

export const postDevicesChooser = async (data: any) => http().post('/billing/devices-choice', data);

export const getSubscriptionInfo = async () => http().get('/billing/subscription');

export const getDevicesMostUsed = async () => http().get('/billing/devices-most-used');

export const updatePaymentMethod = async (id : string) => http().patch(`/billing/${id}/payment-method`);

export const addPaymentMethod = async (id : string) => http().post(`/billing/${id}/payment-method`);

export const removePaymentMethod = async (id : string) => http().delete(`/billing/${id}/payment-method`);

export const cancelSubscription = async () => http().delete('/billing/subscription');
