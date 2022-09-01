<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\RoundController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::post('/create/course', [CourseController::class, 'store']);
Route::put('/update/course', [CourseController::class, 'update']);
Route::get('/read/course', [CourseController::class, 'index']);
Route::get('/read/course/{id}', [CourseController::class, 'search']);
Route::delete('/delete/course/{id}', [CourseController::class, 'destroy']);

Route::post('/create/rounds', [RoundController::class, 'store']);
Route::post('/read/rounds', [RoundController::class, 'search']);


require __DIR__.'/auth.php';
