<?php

namespace App\Http\Controllers;

use App\User;
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
        $user = new stdClass();
        $user->email = Auth::user()->email;
        $user->created_at = Auth::user()->created_at;
        $user->trial_ends_at = Auth::user()->trial_ends_at;

        $user->subscribed = Auth::user()->subscribed('main');
        if($user->subscribed) {
          $user->onTrial = Auth::user()->subscription('main')->onTrial();
          $user->cancelled = Auth::user()->subscription('main')->cancelled();
          $user->onGracePeriod = Auth::user()->subscription('main')->onGracePeriod();
          $user->ends_at = Auth::user()->subscription('main')->ends_at;
        }
        return Response::json($user, 200);
    }
    public function update(Request $request)
    {
      $this->validate($request, [
        'email' =>  'required|email|max:255|unique:users,email'
      ]);
      $id = Auth::user()->id;
      $user = User::find($id);
      $user->fill(array('email' => $request['email']));
      $user->save();
      return Response::json($user->email);
    }
    public function startSubscription(Request $request) {
      if(!Auth::user()->subscribed('main')) {
        $this->validate($request, [
          'stripeToken' => 'required|alpha_dash'
        ]);
        $userEmail =  Auth::user()->email;
        $userID = Auth::user()->id;
        $stripeToken = $request['stripeToken'];
        Auth::user()->newSubscription('main', 'main')->create($stripeToken, [
            'email' => $userEmail,
            'id' => $userID,
        ]);
      }
      return redirect('/account');
    }
    public function cancelSubscription() {
      if(Auth::user()->subscribed('main')) {
        Auth::user()->subscription('main')->cancel();
        return Response::json(Auth::user()->subscription('main')->ends_at);
      }
    }
    public function resumeSubscription() {
      if(Auth::user()->subscribed('main')) {
        if(Auth::user()->subscription('main')->cancelled()) {
          Auth::user()->subscription('main')->resume();
          return Response::json(true);
        }
      }
    }
}
