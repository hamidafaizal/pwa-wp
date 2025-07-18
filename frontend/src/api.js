import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Menggunakan URL lokal
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// -- Device --
export const getDevices = () => apiClient.get('/devices');
export const registerDevice = (uuid, name) => apiClient.post('/register-device', { uuid, name });
export const deleteDevice = (id) => apiClient.delete(`/devices/${id}`);
export const checkDeviceStatus = (uuid) => apiClient.get(`/devices/status/${uuid}`); // Fungsi baru ditambahkan

// -- Messages --
export const getMessages = (deviceUuid) => apiClient.get('/messages', { params: { device_uuid: deviceUuid } });
export const deleteMessage = (id) => apiClient.delete(`/messages/${id}`);
export const deleteAllMessages = (deviceUuid) => apiClient.delete('/messages/all', { data: { device_uuid: deviceUuid } });

export default apiClient;
