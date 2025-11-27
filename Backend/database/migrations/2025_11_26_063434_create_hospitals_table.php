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
        Schema::create('hospitals', function (Blueprint $table) {
            $table->id();
            $table->string('hospitalName');
            $table->string('registrationId')->unique();
            $table->string('hospitalType');
            $table->integer('yearEstablished');
            $table->string('address');
            $table->string('city');
            $table->string('district');
            $table->string('email')->unique();
            $table->string('contactNumber');
            $table->string('emergencyHotline')->nullable();
            $table->string('hasBloodBank');
            $table->json('availableBloodGroups')->nullable();
            $table->string('password');
            $table->string('role')->default('hospital');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospitals');
    }
};
