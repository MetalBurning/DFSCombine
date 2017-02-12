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
Route::get('/NFL', 'NFLController@NFL');
Route::post('/NFL/loadFanDuelPlayers', 'NFLController@loadFanDuelPlayers');
Route::post('/NFL/loadHistory', 'NFLController@loadHistory');

Route::post('/NFL/buildDraft', 'NFLController@buildDraft');
Route::post('/NFL/downloadDrafts', 'NFLController@downloadDrafts');

Route::post('/NFL/create', 'NFLController@create');
Route::post('/NFL/read', 'NFLController@read');
Route::post('/NFL/update', 'NFLController@update');
Route::post('/NFL/delete', 'NFLController@delete');

Route::post('/NFL/updateTitle', 'NFLController@updateTitle');

//NBA
Route::get('/NBA', 'NBAController@NBA');
Route::post('/NBA/loadFanDuelPlayers', 'NBAController@loadFanDuelPlayers');
Route::post('/NBA/loadDraftKingsPlayers', 'NBAController@loadDraftKingsPlayers');
Route::post('/NBA/loadHistory', 'NBAController@loadHistory');

Route::post('/NBA/buildDraft', 'NBAController@buildDraft');
Route::post('/NBA/downloadDrafts', 'NBAController@downloadDrafts');

Route::post('/NBA/create', 'NBAController@create');
Route::post('/NBA/read', 'NBAController@read');
Route::post('/NBA/update', 'NBAController@update');
Route::post('/NBA/delete', 'NBAController@delete');

Route::post('/NBA/updateTitle', 'NBAController@updateTitle');


//NBA DK
Route::get('/NBADK', 'NBAController@NBADK');

//NHL
Route::get('/NHL', 'ApplicationController@NHL');
Route::post('/NHL/saveSettings', 'ApplicationController@saveNHLSettings');
Route::post('/NHL/loadSavedSettings', 'ApplicationController@loadNHLSettings');
Route::post('/NHL/loadSavedSettingsDetails', 'ApplicationController@loadNHLSavedSettingsDetails');
