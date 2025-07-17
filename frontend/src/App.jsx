import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import { registerDevice } from './api.js'; // Impor fungsi register
import './index.css';

function App() {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedInfo = localStorage.getItem('deviceInfo');
      if (storedInfo) {
        setDeviceInfo(JSON.parse(storedInfo));
      }
    } catch (error) {
      console.error("Gagal mem-parsing data dari localStorage", error);
      localStorage.removeItem('deviceInfo');
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = async (name, uuid) => {
    setIsLoading(true);
    try {
      // Daftarkan perangkat ke backend
      await registerDevice(uuid, name);
      const info = { name, uuid };
      localStorage.setItem('deviceInfo', JSON.stringify(info));
      setDeviceInfo(info);
    } catch (error) {
      console.error("Gagal mendaftarkan perangkat:", error);
      alert("Gagal mendaftarkan perangkat ke server. Pastikan backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem('deviceInfo');
      setDeviceInfo(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Memuat Aplikasi...</div>;
  }

  return (
    <>
      {deviceInfo ? (
        <ChatPage 
          deviceName={deviceInfo.name} 
          deviceUuid={deviceInfo.uuid} 
          onLogout={handleLogout} 
        />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
