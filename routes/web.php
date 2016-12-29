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

//Default
Route::get('/', 'WelcomeController@index');

//Auth
Auth::routes();

//NFL
Route::get('/NFL', 'ApplicationController@NFL');
Route::post('/NFL/saveSettings', 'ApplicationController@saveNFLSettings');
Route::post('/NFL/loadSavedSettings', 'ApplicationController@loadNFLSettings');
Route::post('/NFL/loadSavedSettingsDetails', 'ApplicationController@loadNFLSavedSettingsDetails');

//NBA
Route::get('/NBA', 'ApplicationController@NBA');
Route::post('/NBA/saveSettings', 'ApplicationController@saveNBASettings');
Route::post('/NBA/loadSave', 'ApplicationController@loadNBASave');
Route::post('/NBA/loadHistory', 'ApplicationController@loadNBAHistory');
Route::post('/NBA/deleteSave', 'ApplicationController@deleteNBASave');
Route::post('/NBA/updateTitle', 'ApplicationController@updateNBATitle');

//NHL
Route::get('/NHL', 'ApplicationController@NHL');
Route::post('/NHL/saveSettings', 'ApplicationController@saveNHLSettings');
Route::post('/NHL/loadSavedSettings', 'ApplicationController@loadNHLSettings');
Route::post('/NHL/loadSavedSettingsDetails', 'ApplicationController@loadNHLSavedSettingsDetails');
