@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NBA/WNBAController.js?v={{str_random(40)}}"></script>
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
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('G1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G1']">G1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('G2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G2']">G2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('G3')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G3']">G3</button>
                                                  </div>
                                                </div>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F1']">F1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F2']">F2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F3')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F3']">F3</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F4')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F4']">F4</button>
                                                  </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 visible-sm visible-xs">
                                              <h4>Filter Positions</h4>
                                              <select class="form-control" ng-model="SelectedPosition" >
                                                <option value="G1">G1</option>
                                                <option value="G2">G2</option>
                                                <option value="G3">G3</option>
                                                <option value="F1">F1</option>
                                                <option value="F2">F2</option>
                                                <option value="F3">F3</option>
                                                <option value="F4">F4</option>
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
                                                            <th colspan="4">G1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_G1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="G1Players in _G1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(G1Players, 'G1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(G1Players)">@{{G1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(G1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(G1Players, 'G1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(G1Players)">@{{G1Players._Team}}<br /><abbr title="Player FPPG">@{{G1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">G2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_G2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="G2Players in _G2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(G2Players, 'G2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(G2Players)">@{{G2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(G2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(G2Players, 'G2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(G2Players)">@{{G2Players._Team}}<br /><abbr title="Player FPPG">@{{G2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">G3 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_G3PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="G3Players in _G3PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(G3Players, 'G3')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(G3Players)">@{{G3Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(G3Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(G3Players, 'G3')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(G3Players)">@{{G3Players._Team}}<br /><abbr title="Player FPPG">@{{G3Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">F1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_F1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="F1Players in _F1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(F1Players, 'F1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(F1Players)">@{{F1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(F1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(F1Players, 'F1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(F1Players)">@{{F1Players._Team}}<br /><abbr title="Player FPPG">@{{F1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">F2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_F2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="F2Players in _F2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(F2Players, 'F2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(F2Players)">@{{F2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(F2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(F2Players, 'F2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(F2Players)">@{{F2Players._Team}}<br /><abbr title="Player FPPG">@{{F2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">F3 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_F3PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="F3Players in _F3PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(F3Players, 'F3')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(F3Players)">@{{F3Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(F3Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(F3Players, 'F3')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(F3Players)">@{{F3Players._Team}}<br /><abbr title="Player FPPG">@{{F3Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">F4 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_F4PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="F4Players in _F4PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(F4Players, 'F4')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(F4Players)">@{{F4Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(F4Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(F4Players, 'F4')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(F4Players)">@{{F4Players._Team}}<br /><abbr title="Player FPPG">@{{F4Players._FPPG}}</abbr></td>
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
                                                <label class="btn btn-primary btn-file btn-xs">
                                                    CSVReplace<input type="file" style="display: none;" custom-on-change="CSVReplace">
                                                </label>
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
                                                  <h4>Build Drafts - Remove Dups: <input type="checkbox" class="form-inline" ng-model="nba.removeDups"></h4>
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
                                                  <h4><abbr title="Top range to keep.">@{{ (parseFloat(nba.TopRange)).toFixed(2) }}</abbr> => Drafts => <abbr title="Bottom range to keep.">@{{ (parseFloat(nba.BottomRange)).toFixed(2) }}</abbr></h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <form class="form-inline">
                                                    <div class="input-group">
                                                      <span class="input-group-btn">
                                                        <button class="btn btn-primary" type="button" ng-click="removeCalcDrafts()" ng-disabled="nba.TopRange === -1 || nba.BottomRange === -1">Select Range</button>
                                                      </span>
                                                      <input type="number" class="form-control input" ng-model="nba.TopRange">
                                                      <span class="input-group-btn" style="width:0px;"></span>
                                                      <input type="number" class="form-control input" ng-model="nba.BottomRange">
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
                                              @include('draftTable')
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
