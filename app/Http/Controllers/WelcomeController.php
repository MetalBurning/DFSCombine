<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }
    public function privacypolicy()
    {
      return view('privacypolicy');
    }
    public function termsofservice()
    {
      return view('termsofservice');
    }
}
