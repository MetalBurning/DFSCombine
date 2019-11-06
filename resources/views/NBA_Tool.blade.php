@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NBA/NBA_Tool_Controller.js?v={{str_random(40)}}"></script>
<div ng-app="NBAApp">
    <div class="container" ng-controller="NBAToolController as nba">

        <div class="row">
            <div class="col-xs-12" id="messages">
              <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">
                <uib-tabset active="activeJustified" justified="true">
                    <uib-tab index="1" heading="@{{Title}}">


                      <div class="row" ng-repeat="singleTeam in AllTeams">
                        <div class="col-xs-12">
                            <table class="table table-bordered">
                              <thead>
                                <th>@{{singleTeam}}</th>
                                <th>Projection</th>
                                <th>Salary</th>
                                <th>Value</th>
                                <th>Pos Ownership</th>
                                <th>PG</th>
                                <th>SG</th>
                                <th>SF</th>
                                <th>PF</th>
                                <th>C</th>
                              </thead>
                              <tbody>
                                <tr  ng-repeat="singlePlayer in AllPlayers |playersOnTeam:(singleTeam)">
                                  <td>@{{singlePlayer.PlayerName}}</td>
                                  <td>@{{(singlePlayer.PlayerPerMinFDPoints * singlePlayer.PlayerMinutes).toFixed(2)}}</td>
                                  <td>@{{singlePlayer.PlayerSalary}}</td>
                                  <td style="background-color: @{{ getGradientColor(0, getMaxValue(), singlePlayer.PlayerValue) }}">@{{singlePlayer.PlayerValue.toFixed(2)}}</td>
                                  <td style="background-color: @{{ getGradientColor(0, getMaxOwnershipPosition(singlePlayer.PlayerPosition), singlePlayer.PlayerOwnership) }}">@{{singlePlayer.PlayerOwnership.toFixed(1)}}</td>

                                  <td ng-if="singlePlayer.PlayerPosition === 'PG'" ><input class="form-control actualPoints"  ng-model="singlePlayer.PlayerMinutes" type="number" ng-change="updatePlayerMinutes(singlePlayer.PlayerName)" ></td>
                                  <td ng-if="singlePlayer.PlayerPosition !== 'PG'">-</td>

                                  <td ng-if="singlePlayer.PlayerPosition === 'SG'"><input class="form-control actualPoints"  ng-model="singlePlayer.PlayerMinutes" type="number" ng-change="updatePlayerMinutes(singlePlayer.PlayerName)" ></td>
                                  <td ng-if="singlePlayer.PlayerPosition !== 'SG'">-</td>

                                  <td ng-if="singlePlayer.PlayerPosition === 'SF'"><input class="form-control actualPoints"  ng-model="singlePlayer.PlayerMinutes" type="number" ng-change="updatePlayerMinutes(singlePlayer.PlayerName)" ></td>
                                  <td ng-if="singlePlayer.PlayerPosition !== 'SF'">-</td>

                                  <td ng-if="singlePlayer.PlayerPosition === 'PF'"><input class="form-control actualPoints"  ng-model="singlePlayer.PlayerMinutes" type="number" ng-change="updatePlayerMinutes(singlePlayer.PlayerName)" ></td>
                                  <td ng-if="singlePlayer.PlayerPosition !== 'PF'">-</td>

                                  <td ng-if="singlePlayer.PlayerPosition === 'C'"><input class="form-control actualPoints"  ng-model="singlePlayer.PlayerMinutes" type="number" ng-change="updatePlayerMinutes(singlePlayer.PlayerName)" ></td>
                                  <td ng-if="singlePlayer.PlayerPosition !== 'C'">-</td>
                                </tr>
                                <tr>
                                  <th>Position Minute Totals</th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th>@{{ calcPositionMins(singleTeam , 'PG') }}</th>
                                  <th>@{{ calcPositionMins(singleTeam , 'SG') }}</th>
                                  <th>@{{ calcPositionMins(singleTeam , 'SF') }}</th>
                                  <th>@{{ calcPositionMins(singleTeam , 'PF') }}</th>
                                  <th>@{{ calcPositionMins(singleTeam , 'C') }}</th>
                                </tr>
                                <tr>
                                  <th>Total Team Minutes</th>
                                    <th>@{{ calcMins(singleTeam) }}</th>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xs-12">
                            <table class="table table-bordered">
                              <thead>
                                <th>Name</th>
                                <th>Projection</th>
                                <th>Minutes</th>
                                <th>Ownership</th>
                              </thead>
                              <tbody>
                                <tr  ng-repeat="singlePlayer in AllPlayers ">
                                  <td>@{{singlePlayer.PlayerName}}</td>
                                  <td>@{{(singlePlayer.PlayerPerMinFDPoints * singlePlayer.PlayerMinutes).toFixed(2)}}</td>
                                  <td>@{{singlePlayer.PlayerMinutes}}</td>

                                  <td>@{{singlePlayer.PlayerOwnership}}</td>
                                </tr>
                              </tbody>
                            </table>
                        </div>

                      </div>
                    </uib-tab>
                    <uib-tab  index="2" heading="DataBase" ng-click="loadPastSettings()">

                      <div class="panel panel-default" >
                          <div class="panel-heading">
                            <div class='btn-toolbar pull-right'>
                              <div class="btn-group">
                                <button type="button" class="btn btn-xs btn-primary" ng-disabled="_AllPlayers.length == 0" ng-click="save()" ><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                              </div>
                              <label class="btn btn-primary btn-file btn-xs">
                                  Add Projections File (1st)<input type="file" style="display: none;" custom-on-change="loadProjections">
                              </label>
                              <label class="btn btn-primary btn-file btn-xs">
                                  Add Ownership File (2nd)<input type="file" style="display: none;" custom-on-change="loadOwnership">
                              </label>
                            </div>
                            <h3 class="panel-title">Load Saved History</h3>
                          </div>
                          <div class="panel-body" set-height id="savedHistory">
                            <div class="row">
                              <div class="col-xs-12">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Draft #</th>
                                            <th>Title</th>
                                            <th>Draft Created Date</th>
                                            <th>Load</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="savedSettings in savedPastSettings">
                                      <tr>
                                        <td class="col-md-1">@{{$index+1}}</td>
                                        <td class="col-md-3"><input class="form-control" type="text" ng-model="savedSettings.Title"></td>
                                        <td class="col-md-2">@{{savedSettings.Date}}</td>
                                        <td class="col-md-4">
                                          <button class="btn btn-sm btn-primary" ng-click="read(savedSettings.Title)">Load</button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                              </div>
                            </div>

                          </div>
                      </div>


                      <!-- <div class="row">
                        <div class="col-xs-12">
                          <label class="btn btn-primary btn-file btn-lg">
                              Add Projections File (1st)<input type="file" style="display: none;" custom-on-change="loadProjections">
                          </label>
                          <label class="btn btn-primary btn-file btn-lg">
                              Add Ownership File (2nd)<input type="file" style="display: none;" custom-on-change="loadOwnership">
                          </label>
                        </div>
                      </div>
                      <div class="row">
                          <div class="col-xs-12" id="messages">
                            <div class="input-group">
                              <span class="input-group-addon" id="basic-addon1">Title: </span>
                              <input type="text" class="form-control" placeholder="Title Here" aria-describedby="basic-addon1" ng-model="Title">
                            </div>

                          </div>
                      </div> -->
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>




    </div>
</div>
@endsection
