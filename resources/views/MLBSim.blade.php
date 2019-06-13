@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/MLBSIM/MLB.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/MLBSIM/MLBController.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/MLBSIM/MLBControllerHelpers.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/MLBSIM/MLBSimPlayerController.js?v={{str_random(40)}}"></script>

<script type="text/javascript">
DateObj = {             // make it global for easy access
    Date: '{{$Date}}'
};
</script>

<div  ng-app="MLBApp">
    <div class="container" ng-controller="MLBController as mlb">

        <div class="row">
            <div class="col-xs-12" id="messages">
              <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
            </div>
        </div>
        <div class="row">

          <div class="col-xs-12">
            <div class="panel panel-default" >
              <div class="panel-heading">
                Controls
              </div>
              <div class="panel-body" >
                <div class="col-xs-6">
                  <div class="row">
                    <div class="col-xs-8">
                      <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1">Number Simulations: </span>
                        <input type="text" class="form-control" ng-model="Number_Simulations" >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-8">
                      <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1">League Regression: </span>
                        <input type="text" class="form-control" ng-model="League_Regression" >
                        <span class="input-group-addon">PA's</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-8">
                      <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1">Current Season Hitter Regression: </span>
                        <input type="text" class="form-control" ng-model="Recent_Hitter_Regression" >
                        <span class="input-group-addon">%</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-8">
                      <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1">Current Season Pitcher Regression: </span>
                        <input type="text" class="form-control" ng-model="Recent_Pitcher_Regression" >
                        <span class="input-group-addon">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="row">
                    <div class="col-xs-12">
                      <button type="button" class="btn btn-primary" ng-hide="Sim_Building" ng-click="Start_All_Simulations()" >Start All Simulations</button>
                      <button type="button" class="btn btn-danger" ng-show="Sim_Building" ng-click="End_All_Simulations()" >Cancel</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">
                      <button type="button" class="btn btn-primary" ng-click="Download_Projections()">Download Player Projections</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">
                      <button type="button" class="btn btn-primary" ng-click="View_Projections()">View Player Projections</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div  ng-repeat="Game in Games" class="col-sm-12" >

            <div class="panel panel-default" >
              <div class="panel-heading">
                @{{Game.Away_Team}} @ @{{Game.Home_Team}}
              </div>
              <div class="panel-body" >
                <div class="row">
                  <div class="col-xs-6">
                      <button type="button" class="btn btn-xs btn-info" ng-hide="Sim_Building" ng-click="Start_Simulation(Game)" >Start Simulation</button>
                      <button type="button" class="btn btn-xs btn-danger" ng-show="Sim_Building" ng-click="End_All_Simulations()" >Cancel</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-6">
                    <table class="table table-hover">
                        <thead>
                          <tr>
                            Sim Score: @{{Game.Away_Score_AVG}} | Sim Win Percentage: @{{Game.Away_Win_Percent}}
                          </tr>
                            <tr>
                                <th>Players</th>
                                <th>Batting Order</th>
                                <th>Team</th>
                                <th>Sim FD Points</th>
                                <th>Sim DK Points</th>
                                <th>Sim Y Points</th>
                            </tr>
                        </thead>
                        <tbody ng-repeat="away_player in Game.Away_Players | orderBy:'Batting_Order'">
                            <tr>
                                <td>@{{away_player.Name}}</td>
                                <td>@{{away_player.Batting_Order}}</td>
                                <td>@{{away_player.Team}}</td>
                                <td>@{{away_player.Sim_FD_Points}}</td>
                                <td>@{{away_player.Sim_DK_Points}}</td>
                                <td>@{{away_player.Sim_Y_Points}}</td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                  <div class="col-xs-6">
                    <table class="table table-hover">
                        <thead>
                          <tr>
                            Sim Score: @{{Game.Home_Score_AVG}} | Sim Win Percentage: @{{Game.Home_Win_Percent}}
                          </tr>
                            <tr>
                                <th>Players</th>
                                <th>Batting Order</th>
                                <th>Team</th>
                                <th>Sim FD Points</th>
                                <th>Sim DK Points</th>
                                <th>Sim Y Points</th>
                            </tr>
                        </thead>
                        <tbody ng-repeat="home_player in Game.Home_Players | orderBy:'Batting_Order'">
                            <tr>
                                <td>@{{home_player.Name}}</td>
                                <td>@{{home_player.Batting_Order}}</td>
                                <td>@{{home_player.Team}}</td>
                                <td>@{{home_player.Sim_FD_Points}}</td>
                                <td>@{{home_player.Sim_DK_Points}}</td>
                                <td>@{{home_player.Sim_Y_Points}}</td>

                            </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>



    </div>
</div>
@endsection
