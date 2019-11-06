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
Route::get('/privacypolicy', 'WelcomeController@privacypolicy');
Route::get('/termsofservice', 'WelcomeController@termsofservice');
//account
Route::get('/account', 'UserController@index');
Route::post('/accountDetails', 'UserController@read');
Route::post('/startSubscription', 'UserController@startSubscription');
Route::post('/cancelSubscription', 'UserController@cancelSubscription');
Route::post('/resumeSubscription', 'UserController@resumeSubscription');
Route::post('/update', 'UserController@update');
//BrainTree
Route::post(
    'braintree/webhook',
    '\Laravel\Cashier\Http\Controllers\WebhookController@handleWebhook'
);

//admin
Route::get('/admin', 'AdminController@admin');
Route::post('/admin/loadFDSlate', 'AdminController@loadFDSlate');
Route::post('/admin/uploadBDBFile', 'AdminController@uploadBDBFile');

//Auth
Auth::routes();

//NFL
Route::get('/NFL', 'NFLController@NFL');
Route::get('/NFL_2018', 'NFLController@NFL_2018');

Route::post('/NFL/getSlates', 'NFLController@getSlates');
Route::post('/NFL/getSlates_2018', 'NFLController@getSlates_2018');
Route::post('/NFL/getPlayersFromSlate', 'NFLController@getPlayersFromSlate');

Route::post('/NFL/loadFanDuelPlayers', 'NFLController@loadFanDuelPlayers');
Route::post('/NFL/loadDraftKingsPlayers', 'NFLController@loadDraftKingsPlayers');
Route::post('/NFL/loadDraftKingsFPPG', 'NFLController@loadDraftKingsFPPG');
Route::post('/NFL/loadHistory', 'NFLController@loadHistory');

Route::post('/NFL/buildDraft', 'NFLController@buildDraft');
Route::post('/NFL/downloadDrafts', 'NFLController@downloadDrafts');

Route::post('/NFL/create', 'NFLController@create');
Route::post('/NFL/read', 'NFLController@read');
Route::post('/NFL/update', 'NFLController@update');
Route::post('/NFL/delete', 'NFLController@delete');

Route::post('/NFL/updateTitle', 'NFLController@updateTitle');

//NFL DK
Route::get('/NFLDK', 'NFLController@NFLDK');

//NBA
Route::get('/NBA', 'NBAController@NBA');
Route::post('/NBA/loadFanDuelPlayers', 'NBAController@loadFanDuelPlayers');
Route::post('/NBA/loadDraftKingsPlayers', 'NBAController@loadDraftKingsPlayers');
Route::post('/NBA/loadDraftKingsFPPG', 'NBAController@loadDraftKingsFPPG');
Route::post('/NBA/loadHistory', 'NBAController@loadHistory');

Route::post('/NBA/buildDraft', 'NBAController@buildDraft');
Route::post('/NBA/downloadDrafts', 'NBAController@downloadDrafts');

Route::post('/NBA/create', 'NBAController@create');
Route::post('/NBA/read', 'NBAController@read');
Route::post('/NBA/update', 'NBAController@update');
Route::post('/NBA/delete', 'NBAController@delete');

Route::post('/NBA/updateTitle', 'NBAController@updateTitle');
Route::get('/NBA/NBA_Tool', 'NBAController@NBA_Tool');

//WNBA
Route::get('/WNBA', 'WNBAController@WNBA');
Route::post('/WNBA/loadFanDuelPlayers', 'WNBAController@loadFanDuelPlayers');
Route::post('/WNBA/loadDraftKingsPlayers', 'WNBAController@loadDraftKingsPlayers');
Route::post('/WNBA/loadDraftKingsFPPG', 'WNBAController@loadDraftKingsFPPG');
Route::post('/WNBA/loadHistory', 'WNBAController@loadHistory');

Route::post('/WNBA/buildDraft', 'WNBAController@buildDraft');
Route::post('/WNBA/downloadDrafts', 'WNBAController@downloadDrafts');

Route::post('/WNBA/create', 'WNBAController@create');
Route::post('/WNBA/read', 'WNBAController@read');
Route::post('/WNBA/update', 'WNBAController@update');
Route::post('/WNBA/delete', 'WNBAController@delete');

Route::post('/WNBA/updateTitle', 'WNBAController@updateTitle');

//NBA DK
Route::get('/NBADK', 'NBAController@NBADK');

Route::post('/NBA/specialLineup', 'NBAController@specialLineup');

//NHL
Route::get('/NHL', 'NHLController@NHL');
Route::post('/NHL/loadFanDuelPlayers', 'NHLController@loadFanDuelPlayers');
Route::post('/NHL/loadDraftKingsPlayers', 'NHLController@loadDraftKingsPlayers');
Route::post('/NHL/loadDraftKingsFPPG', 'NHLController@loadDraftKingsFPPG');
Route::post('/NHL/loadHistory', 'NHLController@loadHistory');

Route::post('/NHL/buildDraft', 'NHLController@buildDraft');
Route::post('/NHL/downloadDrafts', 'NHLController@downloadDrafts');

Route::post('/NHL/create', 'NHLController@create');
Route::post('/NHL/read', 'NHLController@read');
Route::post('/NHL/update', 'NHLController@update');
Route::post('/NHL/delete', 'NHLController@delete');

Route::post('/NHL/updateTitle', 'NHLController@updateTitle');

//NHL DK
Route::get('/NHLDK', 'NHLController@NHLDK');

//MLB Sim
Route::get('/MLBSim', 'MLBController@MLBSim');
Route::post('/MLBSimGetPlayers', 'MLBController@MLBSimGetPlayers');

//MLB
Route::get('/MLB', 'MLBController@MLB');
Route::post('/MLB/loadFanDuelPlayers', 'MLBController@loadFanDuelPlayers');
Route::post('/MLB/loadDraftKingsPlayers', 'MLBController@loadDraftKingsPlayers');
Route::post('/MLB/loadDraftKingsFPPG', 'MLBController@loadDraftKingsFPPG');
Route::post('/MLB/loadHistory', 'MLBController@loadHistory');

Route::post('/MLB/buildDraft', 'MLBController@buildDraft');
Route::post('/MLB/downloadDrafts', 'MLBController@downloadDrafts');

Route::post('/MLB/create', 'MLBController@create');
Route::post('/MLB/read', 'MLBController@read');
Route::post('/MLB/update', 'MLBController@update');
Route::post('/MLB/delete', 'MLBController@delete');

Route::post('/MLB/updateTitle', 'MLBController@updateTitle');

//NBA DK
Route::get('/MLBDK', 'MLBController@MLBDK');
