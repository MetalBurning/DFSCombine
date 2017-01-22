<?php

namespace App\Http\Controllers;

use Auth;
use Response;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ApplicationController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    //#################################################################
    //################################################################# - NBA
    //#################################################################

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function NBA()
    {
        return view('NBA');
    }


    public function loadNBAHistory(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'endIndex' => 'required|integer'
          ]);

          $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title')->where([['userID', '=', Auth::user()->id],['sport' ,'=', 'NBA']])->whereNull('deleted_at')->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function buildDraftNBA(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
            'builtDrafts' => 'required|integer'
          ]);

          $currentTime = Carbon::now();

          DB::table('UserBuilds')->insert(
              ['userID' => Auth::user()->id, 'sport' => 'NBA', 'drafts' =>  $request->input('builtDrafts')]
          );
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function createNBA(Request $request)
    {
      if(Auth::check()) {
        if($request->input() != NULL) {

          $this->validate($request, [
              'postObject' => 'required|json',
              'title' => 'required|string|max:255'
          ]);
          $postObject = $request->input('postObject');
          $title = $request->input('title');

          $id = DB::table('UserSaveData')->insertGetId(
              ['userID' => Auth::user()->id, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'NBA']
          );
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=', $id],['sport' ,'=', 'NBA']])->whereNull('deleted_at')->first();
          return Response::json($savedJSON, 200);
        }
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function readNBA(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);
          $idToLoad = $request->input('id');
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')],['sport' ,'=', 'NBA']])->whereNull('deleted_at')->first();
          return response()->json($savedJSON);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function updateNBA(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer',
              'title' => 'required|string|max:255',
              'postObject' => 'json',
          ]);

          $currentTime = Carbon::now();

          DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NBA'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
          DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NBA'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['userSaveJSON' => $request->input('postObject') ]);
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=',  $request->input('id')],['sport' ,'=', 'NBA']])->whereNull('deleted_at')->first();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function updateTitleNBA(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer',
              'title' => 'required|string|max:255'
          ]);

          $currentTime = Carbon::now();

          $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NBA'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function deleteNBA(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);

          $currentTime = Carbon::now();

          $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NBA'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['deleted_at' => $currentTime->toDateTimeString()]);
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    //#################################################################
    //################################################################# - NFL
    //#################################################################


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function NFL()
    {
        return view('NFL');
    }

    public function loadNFLHistory(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'endIndex' => 'required|integer'
          ]);

          $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title')->where([['userID', '=', Auth::user()->id],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function buildDraftNFL(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
            'builtDrafts' => 'required|integer'
          ]);

          $currentTime = Carbon::now();

          DB::table('UserBuilds')->insert(
              ['userID' => Auth::user()->id, 'sport' => 'NFL', 'drafts' =>  $request->input('builtDrafts')]
          );
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function saveNFLSettings(Request $request)
    {
      if(Auth::check()) {
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
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function createNFL(Request $request)
    {
      if(Auth::check()) {
        if($request->input() != NULL) {

          $userID = Auth::user()->id;


          $this->validate($request, [
              'postObject' => 'required|json',
              'title' => 'required|string|max:255'
          ]);
          $postObject = $request->input('postObject');
          $title = $request->input('title');

          $id = DB::table('UserSaveData')->insertGetId(
              ['userID' => $userID, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'NFL']
          );
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=', $id],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
          return Response::json($savedJSON, 200);
        }
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function readNFL(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);
          $idToLoad = $request->input('id');
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
          return response()->json($savedJSON);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function updateNFL(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer',
              'title' => 'required|string|max:255',
              'postObject' => 'json',
          ]);

          $currentTime = Carbon::now();

          DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
          DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['userSaveJSON' => $request->input('postObject') ]);
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id')->where([['userID', '=', Auth::user()->id],['id', '=',  $request->input('id')],['sport' ,'=', 'NFL']])->whereNull('deleted_at')->first();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
    public function deleteNFL(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);

          $currentTime = Carbon::now();

          $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['deleted_at' => $currentTime->toDateTimeString()]);
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }

    public function updateTitleNFL(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer',
              'title' => 'required|string|max:255'
          ]);

          $currentTime = Carbon::now();

          $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'NFL'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }



    //#################################################################
    //################################################################# - NHL
    //#################################################################

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function NHL()
    {
        return view('NHL');
    }

    public function saveNHLSettings(Request $request)
    {
      if(Auth::check()) {
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
                ['userID' => $userID, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'NHL']
            );
          }
          else {
            DB::table('UserSaveData')->insert(
                ['userID' => $userID, 'userSaveJSON' => $postObject]
            );
          }

        }
      }
      else
      {
        $errorMessage = array('errorMessage' => 'Not Authorized');
        return Response::json($errorMessage, 500);
      }
    }
    public function loadNHLSettings(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);
          $idToLoad = $request->input('id');
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')],['sport' ,'=', 'NHL']])->first();
          return response()->json($savedJSON);
      }
      else
      {
        $errorMessage = array('errorMessage' => 'Not Authorized');
        return Response::json($errorMessage, 500);
      }
    }
    public function loadNHLSavedSettingsDetails(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'endIndex' => 'required|integer'
          ]);

          $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title')->where([['userID', '=', Auth::user()->id],['sport' ,'=', 'NHL']])->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('errorMessage' => 'Not Authorized');
        return Response::json($errorMessage, 500);
      }
    }
}
