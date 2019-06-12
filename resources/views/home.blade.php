@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="jumbotron">
      <h1>DFSCombine.com - Daily Fantasy Sports Tools</h1>
      <p>Calculate all possible fantasy drafts from the players of your choosing.</p>
      <p><a class="btn btn-primary btn-lg" href="#how" role="button">Learn more</a></p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/singleDraft.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6">
      <h2 class="featurette-heading"> DFS Package: $9.99/month</h2>
        <p>Gain access to the following sports: NBA, NFL, NHL, and MLB.</p>
        <p>Supported Sites: DraftKings, FanDuel</p>
        @if (Auth::guest())
          <p><a class="btn btn-primary" href="/register" role="button">Sign Up »</a></p>
        @endif

    </div>
  </div>
  <hr class="featurette-divider" id="how">
  <div class="row featurette">
    <div class="col-sm-6 col-sm-push-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/selectPlayers.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6 col-sm-pull-6">
      <h2 class="featurette-heading" >How does it work?</h2>
        <p>You add players that you want to play to each position that you want them to be in. Then calculate all possible drafts between each combination of player. </p>
        <p>This app works similarly to "<a href="https://en.wikipedia.org/wiki/Proof_by_exhaustion">Brute Forcing - Proof by exhaustion</a>".</p>
        @if (Auth::guest())
          <p><a class="btn btn-primary" href="/register" role="button">Register »</a></p>
        @endif
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/database.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6">
      <h2 class="featurette-heading">Save all your data.</h2>
        <p>Store every single setup you create. Come back later and see how your setup performed.</p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6 col-sm-push-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/playerPools.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6 col-sm-pull-6">
      <h2 class="featurette-heading">Player Pools</h2>
        <p>Fill up each positional pool with players you'd like at those positions. After computing all possible drafts you'll be able to see how often a player is used.</p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/playerDrafts.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6">
      <h2 class="featurette-heading">Multiple Drafts</h2>
        <p>The web-app will generate all possible drafts.</p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-6 col-sm-push-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/fanduelCSVExample.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6 col-sm-pull-6">
      <h2 class="featurette-heading">FanDuel & DraftKings CSV File</h2>
        <p>In order to use the app properly you need to upload the respective Fanduel or DraftKings CSV file.</p>
        <p>Both of these files are provided by FanDuel & DraftKings.</p>
    </div>
  </div>
  <hr class="featurette-divider">
  <div class="row featurette">
    <div class="col-sm-12">
      <h2 class="featurette-heading">Cancel at anytime.</h2>
        <p>Just press the 'Cancel Subscription' button on your <a href="/account">account page</a> and your cancelled, no strings whatsoever.</p>
    </div>
  </div>
</div>
<hr class="featurette-divider">
</div>
@endsection
