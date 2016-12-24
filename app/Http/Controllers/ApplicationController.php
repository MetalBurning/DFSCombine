<?php

namespace App\Http\Controllers;

use Auth;
use Response;
use DB;
use Illuminate\Http\Request;

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
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function NFL()
    {
        return view('NFL');
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function NBA()
    {
        return view('NBA');
    }

    public function saveNBASettings(Request $request)
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
                ['userID' => $userID, 'userSaveJSON' => $postObject, 'title' => $title]
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
    public function loadNBASettings(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'id' => 'required|integer'
          ]);
          $idToLoad = $request->input('id');
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')]])->first();
          return response()->json($savedJSON);
      }
      else
      {
        $errorMessage = array('errorMessage' => 'Not Authorized');
        return Response::json($errorMessage, 500);
      }
    }
    public function loadNBASavedSettingsDetails(Request $request)
    {
      if(Auth::check()) {
          $userID = Auth::user()->id;

          $this->validate($request, [
              'endIndex' => 'required|integer|max:11'
          ]);

          $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title')->where('userID', Auth::user()->id)->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
          return Response::json($savedJSON, 200);
      }
      else
      {
        $errorMessage = array('errorMessage' => 'Not Authorized');
        return Response::json($errorMessage, 500);
      }
    }
}
