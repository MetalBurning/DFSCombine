@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NBA/NBAController.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NBA/NBAControllerHelpers.js?v={{str_random(40)}}"></script>
<div  ng-app="NBAApp">
    <div class="container" ng-controller="NBAController as nba">

        <div class="row">
            <div class="col-xs-12" id="messages">
              <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">
                <uib-tabset active="activeJustified" justified="true">
                    <uib-tab index="0" heading="@{{mainTabHeading}}" >
                        <!-- start player selection -->
                        <div class="row">
                            <div class="col-xs-12 col-sm-offset-0 col-sm-8 col-lg-offset-0 col-lg-8" >
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class="btn-group">
                                              <button type="button" class="btn btn-xs btn-primary" ng-disabled="_AllPlayers.length == 0" ng-click="openSaveDialog()" ><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                                            </div>
                                            <div class='btn-group'>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopSpecialPlayers()" >Top Special</button>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopActualPlayers()" >Top Actual</button>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopFPPGPlayers()" >Top FPPG</button>
                                              <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-md-5 visible-md visible-lg">
                                                <h4>Filter Positions</h4>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PG1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PG1']">PG1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PG2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PG2']">PG2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SG1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SG1']">SG1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SG2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SG2']">SG2</button>
                                                  </div>
                                                </div>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SF1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SF1']">SF1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SF2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SF2']">SF2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PF1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PF1']">PF1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PF2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PF2']">PF2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('C')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                  </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 visible-sm visible-xs">
                                              <h4>Filter Positions</h4>
                                              <select class="form-control" ng-model="SelectedPosition" >
                                                <option value="PG1">PG1</option>
                                                <option value="PG2">PG2</option>
                                                <option value="SG1">SG1</option>
                                                <option value="SG2">SG2</option>
                                                <option value="SF1">SF1</option>
                                                <option value="SF2">SF2</option>
                                                <option value="PF1">PF1</option>
                                                <option value="PF2">PF2</option>
                                                <option value="C">C</option>
                                              </select>
                                            </div>
                                            <div class="col-md-7 visible-md visible-lg">
                                                <h4>Filter Teams</h4>
                                                <div ng-if="_AllTeams.length >= 12">
                                                  <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                    <div class="btn-group" ng-repeat="team in _AllTeams|limitTo:(_AllTeams.length / 2)"  role="group">
                                                        <button type="button" class="btn btn-xs btn-primary"  ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeam === team]">@{{team}}</button>
                                                    </div>
                                                  </div>
                                                  <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                    <div class="btn-group" ng-repeat="team in _AllTeams| limitTo: ((_AllTeams.length / 2) - _AllTeams.length)"  role="group">
                                                        <button type="button" class="btn btn-xs btn-primary"  ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeam === team]">@{{team}}</button>
                                                    </div>
                                                  </div>
                                              </div>
                                              <div ng-if="_AllTeams.length < 12 && _AllTeams.length > 8">
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" ng-repeat="team in _AllTeams|limitTo:(_AllTeams.length / 2)"  role="group">
                                                      <button type="button" class="btn btn-primary"  ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeam === team]">@{{team}}</button>
                                                  </div>
                                                </div>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" ng-repeat="team in _AllTeams|limitTo: ((_AllTeams.length / 2) - _AllTeams.length)"  role="group">
                                                      <button type="button" class="btn btn-primary"  ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeam === team]">@{{team}}</button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div ng-if="_AllTeams.length < 9 ">
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" ng-repeat="team in _AllTeams|limitTo:8"  role="group">
                                                      <button type="button" class="btn btn-primary"  ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeam === team]">@{{team}}</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-6 visible-sm visible-xs">
                                              <h4>Filter Teams</h4>
                                              <select class="form-control" ng-model="SelectedTeam"  >
                                                <option value="All">All</option>
                                                <option ng-repeat="team in _AllTeams" ng-value="team">@{{team}}</option>
                                              </select>
                                            </div>

                                          </div>

                                          @include('playersFD')


                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-offset-0 col-sm-4 col-lg-offset-0 col-lg-4">
                                <!-- start Draft selection -->
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class="btn-group">
                                              <button type="button" class="btn btn-xs btn-primary" ng-disabled="_AllPlayers.length == 0" ng-click="openSaveDialog()"><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                                            </div>
                                            <div class='btn-group'>
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearPlayerPools()">Clear Pools</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Player Pools </h3>
                                    </div>
                                    <div class="panel-body" set-height id="poolsNextToPlayers">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">PG1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PG1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PG1Players in _PG1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PG1Players, 'PG1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PG1Players)">@{{PG1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PG1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(PG1Players, 'PG1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PG1Players)">@{{PG1Players._Team}}<br /><abbr title="Player FPPG">@{{PG1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">PG2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PG2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PG2Players in _PG2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PG2Players, 'PG2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PG2Players)">@{{PG2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PG2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(PG2Players, 'PG2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PG2Players)">@{{PG2Players._Team}}<br /><abbr title="Player FPPG">@{{PG2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SG1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SG1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SG1Players in _SG1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SG1Players, 'SG1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SG1Players)">@{{SG1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SG1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(SG1Players, 'SG1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SG1Players)">@{{SG1Players._Team}}<br /><abbr title="Player FPPG">@{{SG1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SG2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SG2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SG2Players in _SG2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SG2Players, 'SG2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SG2Players)">@{{SG2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SG2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(SG2Players, 'SG2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SG2Players)">@{{SG2Players._Team}}<br /><abbr title="Player FPPG">@{{SG2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SF1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SF1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SF1Players in _SF1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SF1Players, 'SF1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SF1Players)">@{{SF1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SF1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(SF1Players, 'SF1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SF1Players)">@{{SF1Players._Team}}<br /><abbr title="Player FPPG">@{{SF1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SF2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SF2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SF2Players in _SF2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SF2Players, 'SF2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SF2Players)">@{{SF2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SF2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(SF2Players, 'SF2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SF2Players)">@{{SF2Players._Team}}<br /><abbr title="Player FPPG">@{{SF2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">PF1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PF1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PF1Players in _PF1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PF1Players, 'PF1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PF1Players)">@{{PF1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PF1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(PF1Players, 'PF1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PF1Players)">@{{PF1Players._Team}}<br /><abbr title="Player FPPG">@{{PF1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">PF2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PF2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PF2Players in _PF2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PF2Players, 'PF2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PF2Players)">@{{PF2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PF2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(PF2Players, 'PF2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PF2Players)">@{{PF2Players._Team}}<br /><abbr title="Player FPPG">@{{PF2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">C <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_CPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="CPlayers in _CPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(CPlayers, 'C')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)">@{{CPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(CPlayers, 'C')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)">@{{CPlayers._Team}}<br /><abbr title="Player FPPG">@{{CPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class='btn-group'>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="DownloadDraftCSV()">Download</button>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="openCloseAdvanced()">Advanced Settings</button>
                                              <button type="button" class="btn btn-xs btn-default" ng-click="clearDrafts()">Clear Drafts</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Generated Drafts (150 Display Cap)</h3>
                                    </div>
                                    <div class="panel-body" set-height id="generatedDrafts" >
                                        <div class="row">
                                            <div class="col-sm-3">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Build Drafts</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <button type="button" class="btn btn-primary" ng-hide="DraftsBuilding" ng-click="buildDrafts()" >ReBuild Drafts</button>
                                                  <button type="button" class="btn btn-danger" ng-show="DraftsBuilding" ng-click="cancelBuild()" >Cancel</button>
                                                  <strong><abbr title="Total possible valid draft combinations, only valid combinations are displayed">Total: @{{TotalValidDrafts}}</abbr></strong>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-2">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Selected Sort:</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <strong>@{{sortTypeDraft}}</strong>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-4">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4><abbr title="Bottom range to keep.">@{{ (parseFloat(nba.BottomRange)).toFixed(2) }}</abbr> <= Drafts <= <abbr title="Top range to keep.">@{{ (parseFloat(nba.TopRange)).toFixed(2) }}</abbr></h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <form class="form-inline">
                                                    <div class="input-group">
                                                      <span class="input-group-btn">
                                                        <button class="btn btn-primary" type="button" ng-click="removeCalcDrafts()" ng-disabled="nba.TopRange === -1 || nba.BottomRange === -1">Select Range</button>
                                                      </span>
                                                      <input type="number" class="form-control input" ng-model="nba.BottomRange">
                                                      <span class="input-group-btn" style="width:0px;"></span>
                                                      <input type="number" class="form-control input" ng-model="nba.TopRange">
                                                    </div>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-3">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Draft Options</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <div class="input-group">
                                                    <span class="input-group-btn">
                                                      <button class="btn btn-primary" type="button" ng-click="removeAllButTopN()">Select Top</button>
                                                    </span>
                                                    <input type="number" class="form-control" ng-model="nba.TopLimit"  >
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                        </div>
                                        <div class="row" >
                                            <div class="col-xs-12" >
                                              @include('draftTableNBA2018')
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </uib-tab>

                    <uib-tab index="1" heading="DataBase" ng-click="loadHistory()">
                        @include('databaseFD')
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>
    </div>
</div>
@endsection
