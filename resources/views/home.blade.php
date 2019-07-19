@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="jumbotron">
      <h1>DFSCombine.com - Daily Fantasy Sports Tools</h1>
      <p>Simulate MLB / NFL / NBA games.</p>
      <p><a class="btn btn-primary btn-lg" href="#how" role="button">Learn more</a></p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/singlegame_DFSCombine.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6">
      <h2 class="featurette-heading"> DFS Simulator: $5.99/month</h2>
        <p>Simulate games for the following sports: MLB, NFL/NBA coming soon. </p>
        <p>Supported sites: DraftKings, FanDuel, Yahoo</p>
        @if (Auth::guest())
          <p><a class="btn btn-primary" href="/register" role="button">Sign Up »</a></p>
        @endif

    </div>
  </div>
  <hr class="featurette-divider" id="how">
  <div class="row featurette">
    <div class="col-sm-6 col-sm-push-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/controls_dfscombine.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6 col-sm-pull-6">
      <h2 class="featurette-heading" >How does it work?</h2>
        <p>Use our simulation engine to run MLB games and view which players accel and which players decline based on the matchup. </p>
        <p>The engine will then auto-filter a certain percentage of games so that it matches what vegas is projecting. </p>
        <p>You can modify recency biases and league biases to how you like. </p>
        @if (Auth::guest())
          <p><a class="btn btn-primary" href="/register" role="button">Register »</a></p>
        @endif
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-12">
      <h2 class="featurette-heading">Cancel at anytime.</h2>
        <p>Just press the 'Cancel Subscription' button on your <a href="/account">account page</a> and your cancelled, no strings attached.</p>
    </div>
  </div>
</div>
<hr class="featurette-divider">
</div>
@endsection
