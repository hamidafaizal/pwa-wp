import React, { useState, useEffect } from 'react';
import { FaTrash, FaCopy, FaCheck } from 'react-icons/fa';
import { getMessages, deleteMessage, deleteAllMessages, checkDeviceStatus } from '../api.js';

const ChatPage = ({ deviceName, deviceUuid, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil pesan dari server
  const fetchMessages = async () => {
    if (!deviceUuid) return;
    try {
      const response = await getMessages(deviceUuid);
      setMessages(response.data);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  // useEffect untuk memuat data dan polling pesan
  useEffect(() => {
    fetchMessages();
    const messageIntervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(messageIntervalId);
  }, [deviceUuid]);

  // useEffect untuk memeriksa status perangkat secara berkala
  useEffect(() => {
    const checkStatus = async () => {
      if (!deviceUuid) return;
      try {
        const response = await checkDeviceStatus(deviceUuid);
        if (response.data.status === 'deleted') {
          // Hapus alert() dan langsung panggil onLogout
          onLogout(false); // Panggil onLogout tanpa konfirmasi
        }
      } catch (error) {
        // Jika perangkat tidak ditemukan (404), server juga akan menganggapnya 'deleted'
        // jadi kita bisa logout juga di sini.
        if (error.response && error.response.status === 404) {
            onLogout(false);
        } else {
            console.error("Gagal memeriksa status perangkat:", error);
        }
      }
    };

    const statusIntervalId = setInterval(checkStatus, 5000); // Cek status setiap 5 detik

    return () => clearInterval(statusIntervalId);
  }, [deviceUuid, onLogout]);


  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessage(id);
      fetchMessages();
    } catch (error) {
      console.error("Gagal menghapus pesan:", error);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua pesan?")) {
        try {
            await deleteAllMessages(deviceUuid);
            setMessages([]);
        } catch (error) {
            console.error("Gagal menghapus semua pesan:", error);
        }
    }
  };

  const handleCopyAll = () => {
    if (messages.length === 0) {
      alert("Tidak ada pesan untuk disalin.");
      return;
    }
    try {
      const allLinks = messages
        .map(msg => JSON.parse(msg.content))
        .flat()
        .join('\n');
        
      navigator.clipboard.writeText(allLinks).then(() => {
        alert("Semua link berhasil disalin!");
      }).catch(err => {
        console.error('Gagal menyalin semua link: ', err);
        alert('Gagal menyalin semua link.');
      });
    } catch (error) {
        console.error("Gagal memproses pesan untuk disalin:", error);
        alert("Beberapa pesan memiliki format yang tidak valid dan tidak bisa disalin.");
    }
  };

  const handleManualLogout = () => {
    // Fungsi ini sekarang hanya memanggil onLogout, konfirmasi ditangani di App.jsx
    onLogout(true);
  }

  return (
    <div className="font-sans bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex-1 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{deviceName}</h1>
        </div>
        <button onClick={handleManualLogout} className="text-sm text-red-500 hover:underline px-4 py-2">
          Logout
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <p className="text-gray-500">Memuat pesan...</p>
          ) : messages.length > 0 ? (
            messages.map(msg => (
              <ChatBubble 
                key={msg.id} 
                message={msg} 
                onDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
              <p>Tidak ada pesan.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 p-4 shadow-up sticky bottom-0">
          <div className="max-w-lg mx-auto flex justify-center space-x-4">
              <button onClick={handleCopyAll} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                  <FaCopy />
                  <span>Salin Semua</span>
              </button>
              <button onClick={handleDeleteAllMessages} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                  <FaTrash />
                  <span>Hapus Semua</span>
              </button>
          </div>
      </footer>
    </div>
  );
};

const ChatBubble = ({ message, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      const textToCopy = JSON.parse(message.content).join('\n');
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
        alert('Gagal menyalin link.');
      });
    } catch (e) {
      console.error("Gagal mem-parsing konten pesan:", e);
      alert("Konten pesan tidak valid.");
    }
  };

  let contentToRender;
  try {
    contentToRender = JSON.parse(message.content).map((link, index) => (
      <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate mb-1">
        {link}
      </a>
    ));
  } catch (e) {
    contentToRender = <p className="text-red-500 text-xs">Konten pesan tidak valid: {message.content}</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md max-w-lg w-full">
      <div className="flex flex-col">
        {contentToRender}
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(message.created_at).toLocaleTimeString('id-ID')}</span>
        <div className="flex space-x-3">
          <button onClick={handleCopy} className="text-gray-500 dark:text-gray-400 hover:text-blue-500">
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
          <button onClick={() => onDelete(message.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-500">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
