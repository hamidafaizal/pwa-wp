import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// -- Device --
export const registerDevice = (uuid, name) => apiClient.post('/register-device', { uuid, name });

// -- Messages --
export const getMessages = (deviceUuid) => apiClient.get('/messages', { params: { device_uuid: deviceUuid } });
export const deleteMessage = (id) => apiClient.delete(`/messages/${id}`);
export const deleteAllMessages = (deviceUuid) => apiClient.delete('/messages/all', { data: { device_uuid: deviceUuid } });

export default apiClient;
