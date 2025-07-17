<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Device; // Tambahkan model Device

class MessageController extends Controller
{
    /**
     * Menampilkan semua pesan untuk perangkat tertentu.
     */
    public function index(Request $request)
    {
        $request->validate(['device_uuid' => 'required|uuid|exists:devices,uuid']);
        
        $device = Device::where('uuid', $request->input('device_uuid'))->first();

        return $device->messages()->latest()->get();
    }

    /**
     * Menyimpan pesan baru untuk perangkat tertentu.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'device_uuid' => 'required|uuid|exists:devices,uuid',
        ]);

        $device = Device::where('uuid', $request->input('device_uuid'))->first();

        $message = $device->messages()->create([
            'content' => $request->input('content'),
        ]);

        return response()->json($message, 201);
    }

    /**
     * Menghapus satu pesan spesifik berdasarkan ID.
     */
    public function destroy($id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Pesan tidak ditemukan'], 404);
        }
        $message->delete();
        return response()->json(null, 204);
    }

    /**
     * Menghapus semua pesan untuk perangkat tertentu.
     */
    public function destroyAll(Request $request)
    {
        $request->validate(['device_uuid' => 'required|uuid|exists:devices,uuid']);
        $device = Device::where('uuid', $request->input('device_uuid'))->first();
        $device->messages()->delete();

        return response()->json(['message' => 'Semua pesan berhasil dihapus'], 200);
    }
}
