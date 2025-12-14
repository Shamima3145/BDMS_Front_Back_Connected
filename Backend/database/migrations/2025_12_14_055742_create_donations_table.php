<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->dateTime('donated_at');
            $table->string('blood_group');
            $table->integer('units')->default(1); // in units (e.g., 450ml = 1 unit)
            $table->string('type')->default('Whole Blood'); // Whole Blood, Plasma, Platelets
            $table->string('center_name');
            $table->enum('status', ['Completed', 'In Process', 'Deferred', 'Cancelled'])->default('Completed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
