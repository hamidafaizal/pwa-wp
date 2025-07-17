<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // Menambahkan kolom untuk menyimpan ID perangkat yang memiliki pesan ini.
            $table->unsignedBigInteger('device_id'); 
            
            // Kolom untuk menyimpan konten pesan (kumpulan link)
            $table->text('content');
            
            $table->timestamps();

            // Membuat relasi ke tabel 'devices'
            // Ini tidak wajib untuk fungsionalitas dasar, tapi praktik yang baik.
            // $table->foreign('device_id')->references('id')->on('devices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
};
