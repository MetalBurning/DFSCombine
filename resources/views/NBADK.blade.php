@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NBA/NBADraftKingsController.js?v={{str_random(40)}}"></script>
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
                            <div class="col-xs-12  col-sm-offset-0 col-sm-8 col-lg-offset-0 col-lg-8" >
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
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PG')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PG']">PG</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SG')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SG']">SG</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SF')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SF']">SF</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PF')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PF']">PF</button>
                                                  </div>
                                                </div>
                                                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('C')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('G')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G']">G</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F']">F</button>
                                                  </div>
                                                  <div class="btn-group" role="group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('UTIL')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'UTIL']">UTIL</button>
                                                  </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 visible-sm visible-xs">
                                              <h4>Filter Positions</h4>
                                              <select class="form-control" ng-model="SelectedPosition" >
                                                <option value="PG">PG</option>
                                                <option value="SG">SG</option>
                                                <option value="SF">SF</option>
                                                <option value="PF">PF</option>
                                                <option value="C">C</option>
                                                <option value="G">G</option>
                                                <option value="F">F</option>
                                                <option value="UTIL">UTIL</option>
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
                                              <div ng-if="_AllTeams.length < 8 ">
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
                                                            <th colspan="4">PG <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PGPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PGPlayers in _PGPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PGPlayers, 'PG')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PGPlayers)">@{{PGPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PGPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(PGPlayers, 'PG')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PGPlayers)">@{{PGPlayers._Team}}<br /><abbr title="Player FPPG">@{{PGPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SG <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SGPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SGPlayers in _SGPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SGPlayers, 'SG')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SGPlayers)">@{{SGPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SGPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(SGPlayers, 'SG')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SGPlayers)">@{{SGPlayers._Team}}<br /><abbr title="Player FPPG">@{{SGPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">SF <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_SFPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="SFPlayers in _SFPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SFPlayers, 'SF')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(SFPlayers)">@{{SFPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(SFPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(SFPlayers, 'SF')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(SFPlayers)">@{{SFPlayers._Team}}<br /><abbr title="Player FPPG">@{{SFPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">PF <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PFPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PFPlayers in _PFPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PFPlayers, 'PF')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PFPlayers)">@{{PFPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PFPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(PFPlayers, 'PF')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(PFPlayers)">@{{PFPlayers._Team}}<br /><abbr title="Player FPPG">@{{PFPlayers._FPPG}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(CPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(CPlayers, 'C')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)">@{{CPlayers._Team}}<br /><abbr title="Player FPPG">@{{CPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">G <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_GPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="GPlayers in _GPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(GPlayers, 'G')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)">@{{GPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(GPlayers, 'G')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)">@{{GPlayers._Team}}<br /><abbr title="Player FPPG">@{{GPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">F <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_FPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="FPlayers in _FPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(FPlayers, 'F')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(FPlayers)">@{{FPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(FPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(FPlayers, 'F')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(FPlayers)">@{{FPlayers._Team}}<br /><abbr title="Player FPPG">@{{FPlayers._FPPG}}</abbr></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">UTIL <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_UTILPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="UTILPlayers in _UTILPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(UTILPlayers, 'UTIL')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(UTILPlayers)">@{{UTILPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(UTILPlayers)"><abbr title="Percentage in total generated drafts">@{{getPlayerPercentInPosition(UTILPlayers, 'UTIL')}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(UTILPlayers)">@{{UTILPlayers._Team}}<br /><abbr title="Player FPPG">@{{UTILPlayers._FPPG}}</abbr></td>
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
                            <div class="col-xs-12  col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
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
                                            <div class="col-xs-12"  >
                                                  @include('draftTable')
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </uib-tab>

                    <uib-tab index="1" heading="DataBase" ng-click="loadHistory()">
                      @include('databaseDK')
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>
    </div>
</div>
@endsection
