import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { getDevices, deleteDevice } from '../api';
import { FaTrash } from 'react-icons/fa';

const SenderPage = () => {
    const [messageContent, setMessageContent] = useState('');
    const [targetUuid, setTargetUuid] = useState('');
    const [status, setStatus] = useState('');
    const [statusClass, setStatusClass] = useState('');
    const canvasRef = useRef(null);
    const [devices, setDevices] = useState([]);

    const apiUrl = 'http://localhost:8000/api/messages';

    const generateQRCode = (uuid) => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, uuid, { width: 200 }, (error) => {
                if (error) console.error(error);
            });
        }
        const uuidDisplay = document.getElementById('uuid-display');
        if (uuidDisplay) {
            uuidDisplay.textContent = uuid;
        }
        setTargetUuid(uuid);
    };

    const createNewIdentity = () => {
        const newUuid = crypto.randomUUID();
        localStorage.setItem('senderTargetUUID', newUuid);
        generateQRCode(newUuid);
    };

    const fetchDevices = async () => {
        try {
            const response = await getDevices();
            setDevices(response.data);
        } catch (error) {
            console.error("Gagal mengambil daftar perangkat:", error);
            setStatus('Gagal memuat daftar perangkat.');
            setStatusClass('text-red-500');
        }
    };

    useEffect(() => {
        let existingUuid = localStorage.getItem('senderTargetUUID');
        if (!existingUuid) {
            createNewIdentity();
        } else {
            generateQRCode(existingUuid);
        }
        fetchDevices();
    }, []);

    const handleSend = async () => {
        if (!messageContent.trim() || !targetUuid) {
            setStatus('Target UUID dan Konten tidak boleh kosong.');
            setStatusClass('text-red-500');
            return;
        }
        const linksArray = messageContent.split('\n').filter(link => link.trim() !== '');
        const jsonContent = JSON.stringify(linksArray);
        setStatus('Mengirim...');
        setStatusClass('text-gray-500');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ content: jsonContent, device_uuid: targetUuid }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
            }
            setStatus('Pesan berhasil terkirim!');
            setStatusClass('text-green-500');
            setMessageContent('');
        } catch (error) {
            console.error('Error:', error);
            setStatus('Gagal mengirim pesan. Pastikan perangkat sudah terdaftar.');
            setStatusClass('text-red-500');
        }
    };

    const handleDeleteDevice = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) {
            try {
                await deleteDevice(id);
                fetchDevices(); // Refresh the device list
                setStatus('Perangkat berhasil dihapus.');
                setStatusClass('text-green-500');
            } catch (error) {
                console.error("Gagal menghapus perangkat:", error);
                setStatus('Gagal menghapus perangkat.');
                setStatusClass('text-red-500');
            }
        }
    };
    
    // Meng-handle perubahan dari dropdown
    const handleDeviceSelectChange = (event) => {
        setTargetUuid(event.target.value);
    };

    return (
        <div className="bg-gray-100 flex flex-col lg:flex-row items-start justify-center min-h-screen p-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center sticky top-4">
                <h1 className="text-2xl font-bold mb-4">Identitas Perangkat</h1>
                <p className="text-gray-600 mb-6">Gunakan PWA untuk memindai QR Code di bawah ini. ID akan tersimpan di browser ini.</p>
                <div className="flex justify-center items-center p-4 border rounded-lg min-w-[232px] min-h-[232px] mx-auto">
                    <canvas ref={canvasRef}></canvas>
                </div>
                <p id="uuid-display" className="text-xs text-gray-500 mt-2 break-all"></p>
                <div className="mt-6">
                    <button onClick={createNewIdentity} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg">
                        Buat ID Perangkat Baru
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-lg">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                    <h1 className="text-2xl font-bold mb-4">Pengirim Pesan</h1>
                    <p className="text-gray-600 mb-6">Pilih perangkat dari daftar atau pindai QR code baru untuk mengisi UUID target.</p>
                    
                    {/* Dropdown untuk memilih perangkat */}
                    <div className="mb-4">
                        <label htmlFor="device-select" className="block text-sm font-medium text-gray-700">Pilih Perangkat Target:</label>
                        <select
                            id="device-select"
                            value={targetUuid}
                            onChange={handleDeviceSelectChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                        >
                            <option value="" disabled>-- Pilih perangkat --</option>
                            {devices.map(device => (
                                <option key={device.id} value={device.uuid}>
                                    {device.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="target-uuid" className="block text-sm font-medium text-gray-700">Target UUID:</label>
                        <input
                            id="target-uuid"
                            type="text"
                            value={targetUuid}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="message-content" className="block text-sm font-medium text-gray-700">Konten Pesan (Link):</label>
                        <textarea
                            id="message-content"
                            rows="8"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            placeholder="https://example.com/product/1&#10;https://example.com/product/2"
                        ></textarea>
                    </div>
                    <div className="mt-6">
                        <button onClick={handleSend} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">
                            Kirim Pesan
                        </button>
                    </div>
                    <div id="status-sender" className={`mt-4 text-center text-sm ${statusClass}`}>{status}</div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                    <h1 className="text-2xl font-bold mb-4">Kelola Perangkat Terdaftar</h1>
                    <div className="max-h-96 overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {devices.length > 0 ? devices.map(device => (
                                <li key={device.id} className="py-3 flex justify-between items-center">
                                    <div className="flex-grow mr-4">
                                        <p className="font-semibold text-gray-800">{device.name}</p>
                                        <p className="text-xs text-gray-500 break-all">{device.uuid}</p>
                                    </div>
                                    <button onClick={() => handleDeleteDevice(device.id)} className="text-red-500 hover:text-red-700 p-2 flex-shrink-0">
                                        <FaTrash />
                                    </button>
                                </li>
                            )) : (
                                <p className="text-gray-500 text-center py-4">Tidak ada perangkat terdaftar.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SenderPage;
