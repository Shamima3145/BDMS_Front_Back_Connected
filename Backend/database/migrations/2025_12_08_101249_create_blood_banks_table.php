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
        Schema::create('blood_banks', function (Blueprint $table) {
            $table->id();
            $table->string('hospital_name');
            $table->integer('a_positive')->default(0);
            $table->integer('a_negative')->default(0);
            $table->integer('b_positive')->default(0);
            $table->integer('b_negative')->default(0);
            $table->integer('ab_positive')->default(0);
            $table->integer('ab_negative')->default(0);
            $table->integer('o_positive')->default(0);
            $table->integer('o_negative')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_banks');
    }
};
