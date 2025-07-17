<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    /**
     * Mendaftarkan perangkat baru berdasarkan UUID dan nama.
     * Jika perangkat sudah ada, data akan diperbarui.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // 1. Validasi input dari PWA, sekarang termasuk 'name'
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cari device berdasarkan UUID, atau buat baru jika tidak ada.
        //    Jika sudah ada, perbarui namanya.
        $device = Device::updateOrCreate(
            ['uuid' => $request->input('uuid')],
            ['name' => $request->input('name')] // Simpan atau perbarui nama perangkat
        );

        // 3. Beri respons sukses
        return response()->json([
            'message' => 'Perangkat berhasil terdaftar.',
            'device' => $device, // Kirim kembali data perangkat yang sudah terdaftar
        ], 200);
    }
}
