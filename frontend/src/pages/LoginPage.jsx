import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FaQrcode, FaCheckCircle } from 'react-icons/fa';

const LoginPage = ({ onLoginSuccess }) => {
    const [deviceName, setDeviceName] = useState('');
    const [scannedUuid, setScannedUuid] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (!isScanning) {
            return;
        }

        const scanner = new Html5QrcodeScanner(
            "qr-reader-container",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const handleScanSuccess = (decodedText) => {
            try {
                scanner.clear();
            } catch (error) {
                console.error("Gagal membersihkan scanner.", error);
            }
            setScannedUuid(decodedText);
            setIsScanning(false);
        };

        const handleScanError = (error) => {
            // Error bisa diabaikan untuk tidak mengganggu pengguna
        };

        scanner.render(handleScanSuccess, handleScanError);

        return () => {
            // Pastikan scanner sudah berjalan sebelum mencoba membersihkannya
            if (scanner && scanner.getState() === "SCANNING") {
                 scanner.clear().catch(err => {
                    console.error("Gagal membersihkan Html5QrcodeScanner.", err);
                });
            }
        };
    }, [isScanning]);

    const handleLogin = () => {
        if (!deviceName.trim() || !scannedUuid.trim()) {
            alert("Nama HP dan hasil scan QR tidak boleh kosong.");
            return;
        }
        // Panggil callback untuk memberitahu App.jsx bahwa login berhasil
        onLoginSuccess(deviceName, scannedUuid);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Daftarkan Perangkat</h1>
                
                <div>
                    <label htmlFor="device-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nama HP
                    </label>
                    <input
                        id="device-name"
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="Masukkan nama HP"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                    />
                </div>

                {isScanning ? (
                    <div id="qr-reader-container" className="w-full"></div>
                ) : (
                    <button
                        onClick={() => setIsScanning(true)}
                        className="w-full flex justify-center items-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <FaQrcode />
                        <span>Pindai QR Code</span>
                    </button>
                )}

                {scannedUuid && (
                    <p className="flex items-center justify-center text-sm text-center text-green-500">
                        <FaCheckCircle className="mr-2" />
                        QR Berhasil Dipindai!
                    </p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={!deviceName || !scannedUuid}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Masuk
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
