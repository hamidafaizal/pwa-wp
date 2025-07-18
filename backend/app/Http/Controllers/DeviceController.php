<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    /**
     * Menampilkan semua perangkat yang terdaftar.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Device::latest()->get();
    }

    /**
     * Mendaftarkan perangkat baru berdasarkan UUID dan nama.
     * Jika perangkat sudah ada, data akan diperbarui.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $device = Device::updateOrCreate(
            ['uuid' => $request->input('uuid')],
            ['name' => $request->input('name')]
        );

        return response()->json([
            'message' => 'Perangkat berhasil terdaftar.',
            'device' => $device,
        ], 200);
    }

    /**
     * Menghapus perangkat.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $device = Device::find($id);
        if (!$device) {
            return response()->json(['message' => 'Perangkat tidak ditemukan'], 404);
        }
        $device->delete();
        return response()->json(null, 204);
    }
}
