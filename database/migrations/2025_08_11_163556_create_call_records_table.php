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
        Schema::create('call_records', function (Blueprint $table) {
            $table->id();
            $table->timestamp('call_time');
            $table->string('call_id')->unique();
            $table->string('from');
            $table->string('to');
            $table->string('direction');  // incoming/outgoing
            $table->string('status');     // answered/unanswered etc
            $table->integer('ringing')->nullable();  // seconds
            $table->integer('talking')->nullable();  // seconds
            $table->decimal('cost', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_records');
    }
};
