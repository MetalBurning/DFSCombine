@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/MLB/MLB.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/MLB/MLBController.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/MLB/MLBControllerHelpers.js?v={{str_random(40)}}"></script>
<div  ng-app="MLBApp">
    <div class="container" ng-controller="MLBController as mlb">

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
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('P')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'P']">P</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('C')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('1B')" ng-class="{true: 'active', false: ''}[SelectedPosition === '1B']">1B</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('2B')" ng-class="{true: 'active', false: ''}[SelectedPosition === '2B']">2B</button>
                                                  </div>
                                                </div>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('3B')" ng-class="{true: 'active', false: ''}[SelectedPosition === '3B']">3B</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SS')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SS']">SS</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('OF1')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'OF1']">OF1</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('OF2')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'OF2']">OF2</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('OF3')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'OF3']">OF3</button>
                                                  </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 visible-sm visible-xs">
                                              <h4>Filter Positions</h4>
                                              <select class="form-control" ng-model="SelectedPosition" >
                                                <option value="P">P</option>
                                                <option value="C">C</option>
                                                <option value="1B">1B</option>
                                                <option value="2B">2B</option>
                                                <option value="3B">3B</option>
                                                <option value="SS">SS</option>
                                                <option value="OF1">OF1</option>
                                                <option value="OF2">OF2</option>
                                                <option value="OF3">OF3</option>
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
                                                            <th colspan="4">P <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PPlayers in _PPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PPlayers, 'P')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PPlayers)">@{{PPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(PPlayers, 'P')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PPlayers)">@{{PPlayers._Team}}<br /><abbr title="Player FPPG">@{{PPlayers._FPPG}}</abbr></td>
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
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">1B <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_1BPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="firstBPlayers in _1BPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(firstBPlayers, '1B')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(firstBPlayers)">@{{firstBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(firstBPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(firstBPlayers, '1B')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(firstBPlayers)">@{{firstBPlayers._Team}}<br /><abbr title="Player FPPG">@{{firstBPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">2B <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_2BPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="secondBPlayers in _2BPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(secondBPlayers, '2B')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(secondBPlayers)">@{{secondBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(secondBPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(secondBPlayers, '2B')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(secondBPlayers)">@{{secondBPlayers._Team}}<br /><abbr title="Player FPPG">@{{secondBPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">3B <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_3BPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="thirdBPlayers in _3BPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(thirdBPlayers, '3B')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(thirdBPlayers)">@{{thirdBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(thirdBPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(thirdBPlayers, '3B')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(thirdBPlayers)">@{{thirdBPlayers._Team}}<br /><abbr title="Player FPPG">@{{thirdBPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SS <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SSPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SSPlayers in _SSPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SSPlayers, 'SS')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SSPlayers)">@{{SSPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SSPlayers)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(SSPlayers, 'SS')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SSPlayers)">@{{SSPlayers._Team}}<br /><abbr title="Player FPPG">@{{SSPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">OF1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_OF1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="OF1Players in _OF1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(OF1Players, 'OF1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(OF1Players)">@{{OF1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(OF1Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(OF1Players, 'OF1')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(OF1Players)">@{{OF1Players._Team}}<br /><abbr title="Player FPPG">@{{OF1Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">OF2 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_OF2PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="OF2Players in _OF2PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(OF2Players, 'OF2')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(OF2Players)">@{{OF2Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(OF2Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(OF2Players, 'OF2')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(OF2Players)">@{{OF2Players._Team}}<br /><abbr title="Player FPPG">@{{OF2Players._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">OF3 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_OF3PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="OF3Players in _OF3PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(OF3Players, 'OF3')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(OF3Players)">@{{OF3Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(OF3Players)"><abbr title="Player percent in this position">@{{getPlayerPercentInPosition(OF3Players, 'OF3')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(OF3Players)">@{{OF3Players._Team}}<br /><abbr title="Player FPPG">@{{OF3Players._FPPG}}</abbr></td>
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
                                                <button type="button" class="btn btn-xs btn-info" ng-click="openAdvanced()">Advanced</button>
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
                                                  <h4>Build Drafts - Remove Dups: <input type="checkbox" class="form-inline" ng-model="mlb.removeDups"></h4>
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
                                                  <h4><abbr title="Top range to keep.">@{{ (parseFloat(mlb.TopRange)).toFixed(2) }}</abbr> => Drafts => <abbr title="Bottom range to keep.">@{{ (parseFloat(mlb.BottomRange)).toFixed(2) }}</abbr></h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <form class="form-inline">
                                                    <div class="input-group">
                                                      <span class="input-group-btn">
                                                        <button class="btn btn-primary" type="button" ng-click="removeCalcDrafts()" ng-disabled="mlb.TopRange === -1 || mlb.BottomRange === -1">Select Range</button>
                                                      </span>
                                                      <input type="number" class="form-control input" ng-model="mlb.TopRange">
                                                      <span class="input-group-btn" style="width:0px;"></span>
                                                      <input type="number" class="form-control input" ng-model="mlb.BottomRange">
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
                                                      <button class="btn btn-primary" type="button" ng-click="removeAllButTopN()">SelectTop</button>
                                                    </span>
                                                    <input type="number" class="form-control" ng-model="mlb.TopLimit"  >
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
