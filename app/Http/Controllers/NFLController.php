<?php

namespace App\Http\Controllers;

use Auth;
use Response;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use stdClass;

class NFLController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
      $this->middleware('auth');
      $this->middleware('subscribed');
  }
  /**
   * Show the application dashboard.
   *
   * @return \Illuminate\Http\Response
   */
  public function NFL()
  {
      return view('NFL');
  }

  public function loadFanDuelPlayers(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
        'csvFile' => 'required|file|mimes:csv,txt'
      ]);

      $file = $request->file('csvFile');

      $firstLine = true;
      $players = [];
      try {
        $fileRead = fopen($file,"r");
        while(!feof($fileRead))
        {
          if(!$firstLine) {
            $data = fgetcsv($fileRead);

            $player = new stdClass();
            $player->playerID = $data[0];
            $player->_Position = $data[1];
            $player->_Name = $data[2] . " " . $data[4];
            $player->_FPPG = $data[5];
            $player->_GamesPlayed = $data[6];
            $player->_Salary = $data[7];
            $player->_Game = $data[8];
            $player->_Team = $data[9];
            $player->_Opponent = $data[10];
            if (strlen($data[11]) > 0) {
              $player->_playerInjured = $data[11];
            } else {
              $player->_playerInjured = '';
            }

            $player->_playerInjuryDetails = $data[12];
            $player->_TimesInValidDrafts = 0;
            $player->_TimesInDrafts = 0;
            $player->_PercentInDrafts = -1;

            $players[] = $player;

          } else {
            $firstLine = false;
            fgetcsv($fileRead);
          }
        }
        fclose($fileRead);
      } catch(\Exception $e) {
        $errorMessage = array('error' => 'Incorrect file structure.');
        return Response::json($errorMessage, 500);
      }
      DB::table('UserActions')->insert(
          ['userID' => Auth::user()->id, 'sport' => 'NFL', 'action' => 'playerLoad', 'actionDetails' =>  count($players), 'actionDetailsLarge' =>  json_encode($players)]
      );
      return Response::json($players, 200);
  }
  public function downloadDrafts(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
        'downloadDrafts' => 'required|integer'
      ]);

      DB::table('UserActions')->insert(
          ['userID' => Auth::user()->id, 'sport' => 'NFL', 'action' => 'downloadDrafts', 'actionDetails' => $request->input('downloadDrafts')]
      );
  }
  public function loadHistory(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
          'endIndex' => 'required|integer'
      ]);

      $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title', 'site')->where([['userID', '=', Auth::user()->id],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
      return Response::json($savedJSON, 200);
  }

  public function buildDraft(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
        'builtDrafts' => 'required|integer'
      ]);

      $currentTime = Carbon::now();

      DB::table('UserActions')->insert(
          ['userID' => Auth::user()->id, 'sport' => 'NFL', 'action' => 'build', 'actionDetails' =>  $request->input('builtDrafts')]
      );
  }

  public function saveSettings(Request $request)
  {
      if($request->input() != NULL) {

        $userID = Auth::user()->id;


        $this->validate($request, [
            'postObject' => 'required|json',
            'title' => 'string|nullable|max:255'
        ]);
        $postObject = $request->input('postObject');
        $title = $request->input('title');
        if(strlen($title) > 0) {
          DB::table('UserSaveData')->insert(
              ['userID' => $userID, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'NFL']
          );
        }
        else {
          DB::table('UserSaveData')->insert(
              ['userID' => $userID, 'userSaveJSON' => $postObject]
          );
        }

      }
  }
  public function create(Request $request)
  {
    if($request->input() != NULL) {

      $userID = Auth::user()->id;

      $this->validate($request, [
          'postObject' => 'required|json',
          'title' => 'required|string|max:255',
          'site' => 'required|string|max:45'
      ]);
      $postObject = $request->input('postObject');
      $title = $request->input('title');
      $site = $request->input('site');

      $id = DB::table('UserSaveData')->insertGetId(
          ['userID' => $userID, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'NFL', 'site' => $site]
      );
      $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=', $id],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
      return Response::json($savedJSON, 200);
    }
  }
  public function read(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
          'id' => 'required|integer'
      ]);
      $idToLoad = $request->input('id');
      $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
      return response()->json($savedJSON);
  }
  public function update(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
          'id' => 'required|integer',
          'title' => 'required|string|max:255',
          'postObject' => 'json',
      ]);

      $currentTime = Carbon::now();

      DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
      DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['userSaveJSON' => $request->input('postObject') ]);
      $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=',  $request->input('id')],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
      return Response::json($savedJSON, 200);
  }
  public function delete(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
          'id' => 'required|integer'
      ]);

      $currentTime = Carbon::now();

      $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['deleted_at' => $currentTime->toDateTimeString()]);
      return Response::json($savedJSON, 200);
  }

  public function updateTitle(Request $request)
  {
      $userID = Auth::user()->id;

      $this->validate($request, [
          'id' => 'required|integer',
          'title' => 'required|string|max:255'
      ]);

      $currentTime = Carbon::now();

      $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
      return Response::json($savedJSON, 200);
  }
}
