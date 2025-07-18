import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import SenderPage from './pages/SenderPage.jsx';
import { registerDevice } from './api.js';
import './index.css';

// Komponen ini menangani logika PWA (login, chat, dll.)
const PwaContainer = () => {
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

  const handleLogout = useCallback((withConfirm = true) => {
    const doLogout = () => {
        localStorage.removeItem('deviceInfo');
        setDeviceInfo(null);
    };

    if (withConfirm) {
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            doLogout();
        }
    } else {
        doLogout();
    }
  }, []); // useCallback akan memastikan fungsi ini tidak dibuat ulang di setiap render

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Memuat Aplikasi...</div>;
  }

  return deviceInfo ? (
    <ChatPage 
      deviceName={deviceInfo.name} 
      deviceUuid={deviceInfo.uuid} 
      onLogout={handleLogout} 
    />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  );
};

// Komponen App utama sekarang hanya mengatur routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<PwaContainer />} />
      <Route path="/sender" element={<SenderPage />} />
    </Routes>
  );
}

export default App;
