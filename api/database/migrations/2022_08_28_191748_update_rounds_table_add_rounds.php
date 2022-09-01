<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateRoundsTableAddRounds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rounds', function (Blueprint $table) {
            $table->longText('rounds');
        });

        Schema::table('rounds', function (Blueprint $table) {
            $table->dropColumn('hole');
            $table->dropColumn('par');
            $table->dropColumn('score');
            $table->dropColumn('yards');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
