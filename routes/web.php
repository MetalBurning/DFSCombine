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
Route::post('/NFL/loadHistory', 'ApplicationController@loadNFLHistory');

Route::post('/NFL/buildDraft', 'ApplicationController@buildDraftNFL');

Route::post('/NFL/create', 'ApplicationController@createNFL');
Route::post('/NFL/read', 'ApplicationController@readNFL');
Route::post('/NFL/update', 'ApplicationController@updateNFL');
Route::post('/NFL/delete', 'ApplicationController@deleteNFL');

Route::post('/NFL/updateTitle', 'ApplicationController@updateTitleNFL');

//NBA
Route::get('/NBA', 'ApplicationController@NBA');
Route::post('/NBA/loadHistory', 'ApplicationController@loadNBAHistory');

Route::post('/NBA/buildDraft', 'ApplicationController@buildDraftNBA');

Route::post('/NBA/create', 'ApplicationController@createNBA');
Route::post('/NBA/read', 'ApplicationController@readNBA');
Route::post('/NBA/update', 'ApplicationController@updateNBA');
Route::post('/NBA/delete', 'ApplicationController@deleteNBA');

Route::post('/NBA/updateTitle', 'ApplicationController@updateTitleNBA');

//NHL
Route::get('/NHL', 'ApplicationController@NHL');
Route::post('/NHL/saveSettings', 'ApplicationController@saveNHLSettings');
Route::post('/NHL/loadSavedSettings', 'ApplicationController@loadNHLSettings');
Route::post('/NHL/loadSavedSettingsDetails', 'ApplicationController@loadNHLSavedSettingsDetails');
