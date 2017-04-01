@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NFL/NFL.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NFL/NFLDraftKingsController.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NFL/NFLControllerHelpers.js?v={{str_random(40)}}"></script>
<div  ng-app="NFLApp">
    <div class="container" ng-controller="NFLController as nfl">

        <div class="row">
          <div class="col-xs-12" id="messages">
            <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
          </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <uib-tabset active="activeJustified" justified="true">
                    <uib-tab index="0" heading="@{{mainTabHeading}}" >
                        <!-- start player selection -->
                        <div class="row">
                            <div class="col-sm-8">
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                          <div class="btn-group">
                                            <button type="button" class="btn btn-xs btn-primary" ng-disabled="_AllPlayers.length == 0" ng-click="openSaveDialog()"><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                                          </div>
                                            <div class='btn-group'>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="addSalaryImpliedPts()" >Salary Implied Pts</button>
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
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('QB')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'QB']">QB</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('RB1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'RB1']">RB1</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('RB2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'RB2']">RB2</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('WR1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'WR1']">WR1</button>
                                                </div>
                                              </div>
                                              <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('WR2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'WR2']">WR2</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('WR3')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'WR3']">WR3</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('TE')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'TE']">TE</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('FLEX')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'FLEX']">FLEX</button>
                                                </div>
                                                <div class="btn-group" role="group">
                                                  <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('DST')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'DST']">DST</button>
                                                </div>
                                              </div>
                                          </div>
                                          <div class="col-sm-6 visible-sm visible-xs">
                                            <h4>Filter Positions</h4>
                                            <select class="form-control" ng-model="SelectedPosition" >
                                              <option value="QB">QB</option>
                                              <option value="RB1">RB1</option>
                                              <option value="RB2">RB2</option>
                                              <option value="WR1">WR1</option>
                                              <option value="WR2">WR2</option>
                                              <option value="WR3">WR3</option>
                                              <option value="TE">TE</option>
                                              <option value="FLEX">FLEX</option>
                                              <option value="DST">DST</option>
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
                                        @include('playersDK')
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
                                                            <th colspan="4">QB <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_QBPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="QBPlayers in _QBPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(QBPlayers, 'QB')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(QBPlayers, 'QB')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Team}}<br /><abbr title="Player FPPG">@{{QBPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">RB1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_RB1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="RB1Players in _RB1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(RB1Players, 'RB1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(RB1Players)">@{{RB1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(RB1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(RB1Players, 'RB1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(RB1Players)">@{{RB1Players._Team}}<br /><abbr title="Player FPPG">@{{RB1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">RB2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_RB2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="RB2Players in _RB2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SG1Players, 'RB2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(RB2Players)">@{{RB2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(RB2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(RB2Players, 'RB2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(RB2Players)">@{{RB2Players._Team}}<br /><abbr title="Player FPPG">@{{RB2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">WR1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WR1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WR1Players in _WR1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WR1Players, 'WR1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WR1Players)">@{{WR1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WR1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(WR1Players, 'WR1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(WR1Players)">@{{WR1Players._Team}}<br /><abbr title="Player FPPG">@{{WR1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">WR2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WR2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WR2Players in _WR2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WR2Players, 'WR2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WR2Players)">@{{WR2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WR2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(WR2Players, 'WR2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(WR2Players)">@{{WR2Players._Team}}<br /><abbr title="Player FPPG">@{{WR2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">WR3 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WR3PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WR3Players in _WR3PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WR3Players, 'WR3')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WR3Players)">@{{WR3Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WR3Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(WR3Players, 'WR3')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(WR3Players)">@{{WR3Players._Team}}<br /><abbr title="Player FPPG">@{{WR3Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">TE <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_TEPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="TEPlayers in _TEPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(TEPlayers, 'TE')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(TEPlayers, 'TE')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Team}}<br /><abbr title="Player FPPG">@{{TEPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">FLEX <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_FLEXPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="FLEXPlayers in _FLEXPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(FLEXPlayers, 'FLEX')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(FLEXPlayers)">@{{FLEXPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(FLEXPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(FLEXPlayers, 'FLEX')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(FLEXPlayers)">@{{FLEXPlayers._Team}}<br /><abbr title="Player FPPG">@{{FLEXPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">DST <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_DSTPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="DSTPlayers in _DSTPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(DSTPlayers, 'DST')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(DSTPlayers, 'DST')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Team}}<br /><abbr title="Player FPPG">@{{DSTPlayers._FPPG}}</abbr></td>
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
                            <div class="col-sm-12">
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class='btn-group'>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="DownloadDraftCSV()">Download</button>
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearDrafts()">Clear Drafts</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Generated Drafts (150 Display Cap)</h3>
                                    </div>
                                    <div class="panel-body" set-height id="generatedDrafts">
                                      <div class="row">
                                        <div class="col-sm-3">
                                          <div class="row">
                                            <div class="col-xs-12">
                                              <h4>Build Drafts - Remove Dups: <input type="checkbox" class="form-inline" ng-model="nfl.removeDups"></h4>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-xs-12">
                                              <button type="button" class="btn btn-primary" ng-click="buildDrafts()" >ReBuild Drafts</button>
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
                                              <h4><abbr title="Top range to keep.">@{{ (parseFloat(nfl.TopRange)).toFixed(2) }}</abbr> => Drafts => <abbr title="Bottom range to keep.">@{{ (parseFloat(nfl.BottomRange)).toFixed(2) }}</abbr></h4>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-xs-12">
                                              <form class="form-inline">
                                                <div class="input-group">
                                                  <span class="input-group-btn">
                                                    <button class="btn btn-primary" type="button" ng-click="removeCalcDrafts()" ng-disabled="nfl.TopRange === -1 || nfl.BottomRange === -1">Select Range</button>
                                                  </span>
                                                  <input type="number" class="form-control input" ng-model="nfl.TopRange">
                                                  <span class="input-group-btn" style="width:0px;"></span>
                                                  <input type="number" class="form-control input" ng-model="nfl.BottomRange">
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
                                                <input type="number" class="form-control" ng-model="nfl.TopLimit"  >
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                @include('draftTable')
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </uib-tab>
                    <uib-tab index="1" heading="DataBase"  ng-click="loadHistory()">
                      @include('databaseDK')
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>
    </div>
</div>
@endsection
