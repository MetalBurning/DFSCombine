<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Response;
use stdClass;

class UserController extends Controller
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
    public function index()
    {
        return view('account');
    }

    public function read()
    {
      if(Auth::check()) {

        $user = new stdClass();
        $user->email = Auth::user()->email;
        $user->created_at = Auth::user()->created_at;
        $user->trial_ends_at = Auth::user()->trial_ends_at;

        $user->subscribed = Auth::user()->subscribed('main');
        if($user->subscribed) {
          $user->onTrial = Auth::user()->subscription('main')->onTrial();
          $user->cancelled = Auth::user()->subscription('main')->cancelled();
          $user->onGracePeriod = Auth::user()->subscription('main')->onGracePeriod();
        }


        return Response::json($user, 200);
      } else {
        $errorMessage = array('error' => 'Unauthenticated.');
        return Response::json($errorMessage, 500);
      }
    }
}
