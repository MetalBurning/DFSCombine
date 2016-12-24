<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', 'WelcomeController@index');

Route::get('/NFL', 'ApplicationController@NFL');
Route::post('/NFL/saveSettings', 'ApplicationController@saveNFLSettings');

Route::get('/NBA', 'ApplicationController@NBA');
Route::post('/NBA/saveSettings', 'ApplicationController@saveNBASettings');
Route::post('/NBA/loadSavedSettings', 'ApplicationController@loadNBASettings');
Route::post('/NBA/loadSavedSettingsDetails', 'ApplicationController@loadNBASavedSettingsDetails');
Auth::routes();
