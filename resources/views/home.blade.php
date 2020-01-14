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

    <div class="col-xs-12">
      <h2 class="featurette-heading"> Discontinued</h2>
        <p>This project grew from a love of Full-Stack development and fantasy sports data. Eventually I found other similar projects that were already to market and were projects that I loved using.</p>
        <p>Therefore, I have decided to stop working on this website and pursue other ventures.</p>
        <p>The following links will guide you to some of the projects that exist on this website. You need to login to interact with them, I've added a default user that has credentials automatically filled, just hit the login button. </p>
        <ul>
          <li>MLB Simulator: <a href="/MLBSim?Date=2019-07-07">http://dfscombine.com/MLBSim?Date=2019-07-07</a></li>
          <li>Fanduel NBA brute-force optimizer (2018-2019 rules): <a href="/NBA">http://dfscombine.com/NBA</a></li>
          <li>Fanduel MLB brute-force optimizer (2017-2018 rules): <a href="/MLB">http://dfscombine.com/MLB</a></li>
        </ul>
        <p>If you'd like to view my github or are interested in hiring me for work, feel free to follow the links below.</p>
        <ul>
          <li><a href="https://github.com/MetalBurning">https://github.com/MetalBurning</a></li>
          <li><a href="https://www.linkedin.com/in/jacob-r/">https://www.linkedin.com/in/jacob-r/</a></li>
        </ul>
        <p>This project was a blast to work on and I learned a ton from the iterations I put into it. I hope you enjoy it! </p>
    </div>
  </div>
  <hr class="featurette-divider">

  <div class="row featurette">
    <div class="col-sm-6">
      <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="/images/singlegame_DFSCombine.png" data-holder-rendered="true">
    </div>
    <div class="col-sm-6">
      <h2 class="featurette-heading"> DFS Simulator: <strike>$5.99/month</strike> FREE</h2>
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
