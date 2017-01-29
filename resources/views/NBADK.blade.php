@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js"></script>
<script src="/js/AngularControllers/NBA/NBADraftKingsController.js"></script>
<script src="/js/AngularControllers/NBA/NBAControllerHelpers.js"></script>
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
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-8 col-lg-offset-0 col-lg-8" >
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class="btn-group">
                                              <button type="button" class="btn btn-xs btn-primary" ng-disabled="_AllPlayers.length == 0" ng-click="openSaveDialog()" ><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                                            </div>
                                            <div class='btn-group'>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopActualPlayers()" >Top Actual</button>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopFPPGPlayers()" >Top FPPG</button>
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-xs-5">
                                                <h4>Filter Positions</h4>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PG')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PG']">PG</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SG')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SG']">SG</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('SF')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SF']">SF</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('PF')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PF']">PF</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('C')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('G')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G']">G</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('F')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'F']">F</button>
                                                    <button type="button" class="btn btn-primary" ng-click="setAndUnsetPosition('UTIL')" ng-class="{true: 'active', false: ''}[SelectedPosition === 'UTIL']">UTIL</button>
                                                </div>
                                            </div>
                                            <div class="col-xs-7">
                                                <h4>Filter Teams</h4>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary" ng-repeat="team in _AllTeams" ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeams.indexOf(team) > -1]">@{{team}}</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr class="visible-md visible-lg">
                                                            <th>Add</th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_Name'; sortReverse = !sortReverse">
                                                                      Name
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_Team'; sortReverse = !sortReverse">
                                                                    Team
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_Opponent'; sortReverse = !sortReverse">
                                                                      Opp
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Game'; sortReverse = !sortReverse">
                                                                    Game
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_Position'; sortReverse = !sortReverse">
                                                                    Pos
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_FPPG'; sortReverse = !sortReverse">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_ActualFantasyPoints'; sortReverse = !sortReverse">
                                                                    Actual
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Salary'; sortReverse = !sortReverse">
                                                                    Salary
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_ProjectedPointsPerDollar'; sortReverse = !sortReverse">
                                                                    Pts / $
                                                                </span>
                                                            </th>
                                                        </tr>
                                                        <tr class="visible-xs  visible-sm">
                                                            <th>Add</th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_Name'; sortReverse = !sortReverse">
                                                                      Name
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Game'; sortReverse = !sortReverse">
                                                                    Game
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_FPPG'; sortReverse = !sortReverse">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="sortType = '_ActualFantasyPoints'; sortReverse = !sortReverse">
                                                                    Actual
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Salary'; sortReverse = !sortReverse">
                                                                    Salary
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | positionDK:SelectedPosition | team:SelectedTeams">
                                                        <tr class="@{{player._playerInjured}} visible-md visible-lg">
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player, SelectedPosition)" ng-click="addPlayerToPool(player, SelectedPosition)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player, SelectedPosition)" ng-click="removePlayerFromPool(player, SelectedPosition)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Team}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Opponent}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Game}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Position}}</td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._FPPG" type="number" ng-change="updatePlayerPtsPerDollar(player)" ></td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._ActualFantasyPoints" type="number" ></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Salary}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._ProjectedPointsPerDollar}}</td>
                                                        </tr>
                                                        <tr class="@{{player._playerInjured}} visible-xs  visible-sm">
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player, SelectedPosition )" ng-click="addPlayerToPool(player, SelectedPosition)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player, SelectedPosition)" ng-click="removePlayerFromPool(player, SelectedPosition)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Game}}</td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._FPPG" type="number" ></td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._ActualFantasyPoints" type="number" ></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Salary}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                    </div>



                                </div>
                            </div>
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-4 col-lg-offset-0 col-lg-4">
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
                                                            <td ng-click="openClosePlayerDetails(PGPlayers)"><abbr title="Percentage in total generated drafts">@{{PGPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SGPlayers)"><abbr title="Percentage in total generated drafts">@{{SGPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SFPlayers)"><abbr title="Percentage in total generated drafts">@{{SFPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(PFPlayers)"><abbr title="Percentage in total generated drafts">@{{PFPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(CPlayers)"><abbr title="Percentage in total generated drafts">@{{CPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(GPlayers)"><abbr title="Percentage in total generated drafts">@{{GPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(FPlayers)"><abbr title="Percentage in total generated drafts">@{{FPlayers._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(UTILPlayers)"><abbr title="Percentage in total generated drafts">@{{UTILPlayers._PercentInDrafts}}%</abbr></td>
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
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
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
                                                  <h4>Build Drafts</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <button type="button" class="btn btn-primary" ng-click="buildDrafts()" >ReBuild Drafts</button>
                                                  <abbr title="Total possible valid draft combinations, only valid combinations are displayed">Total: @{{TotalValidDrafts}}</abbr>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-2">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Selected Sort</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  @{{sortTypeDraft}}
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-sm-4">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4><abbr title="Top range to keep.">@{{ (parseFloat(nba.TopRange)).toFixed(2) }}</abbr> => Drafts <= <abbr title="Bottom range to keep.">@{{ (parseFloat(nba.BottomRange)).toFixed(2) }}</abbr></h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-4">
                                                  <button type="button" class="btn btn-primary" ng-click="removeCalcDrafts()" ng-disabled="nba.TopRange === -1 || nba.BottomRange === -1">Select Range</button>
                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="number" class="form-control" ng-model="nba.TopRange"   >
                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="number" class="form-control" ng-model="nba.BottomRange"  >
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
                                                <div class="col-xs-5">
                                                  <button type="button" class="btn btn-primary" ng-click="removeAllButTopN()">Select Top</button>
                                                </div>
                                                <div class="col-xs-7">
                                                  <input type="number" class="form-control" ng-model="nba.TopLimit"  >
                                                </div>
                                              </div>

                                            </div>
                                        </div>
                                        <div class="row" >
                                            <div class="col-xs-12"  >
                                                <table class="table table-hover" >
                                                    <thead>
                                                        <tr>
                                                            <th>Draft</th>
                                                            <th>
                                                                <span class="fake-link" ng-click="setDraftSortTypeAndReverse('FPPG')">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('Actual')">
                                                                    Actual Pts
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        <tr ng-repeat="draft in _AllDisplayedDraftData | orderBy:sortTypeDraft:sortReverseDraft">
                                                            <td>@{{$index + 1}} <button class="btn btn-xs btn-danger" ng-click="removeDraft(draft)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.FPPG}}</td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.Actual}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </uib-tab>

                    <uib-tab index="1" heading="DataBase" ng-click="loadHistory()">
                        <div class="row">
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
                              <div class="panel panel-default" >
                                  <div class="panel-heading">
                                    <div class='btn-toolbar pull-right'>
                                      <label class="btn btn-primary btn-file btn-xs">
                                          Add Fanduel Player CSV File <input type="file" style="display: none;" custom-on-change="loadDKPlayers">
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
                                                <td class="col-md-4"><input class="form-control" type="text" ng-model="savedSettings.title"></td>
                                                <td class="col-md-3">@{{savedSettings.created_at}}</td>
                                                <td class="col-md-4">
                                                  <button class="btn btn-sm btn-primary" ng-click="read(savedSettings.id)">Load</button>
                                                  <button class="btn btn-sm btn-info" ng-click="updateTitle(savedSettings.id, savedSettings.title)">Update</button>
                                                  -
                                                  <button class="btn btn-sm btn-danger"  ng-show="!showDeleteConfirmation(savedSettings.id)" ng-click="setDeleteConfirmation(savedSettings.id)">Delete</button>
                                                  <button class="btn btn-sm btn-primary" ng-show="showDeleteConfirmation(savedSettings.id)" ng-click="delete(savedSettings.id)">Yes</button>
                                                  <button class="btn btn-sm btn-default" ng-show="showDeleteConfirmation(savedSettings.id)" ng-click="unsetDeleteConfirmation()">No</button>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-sm-12">
                                        <button class="btn btn-info" ng-click="loadHistory()" ng-disabled="savedPastSettings.length % 10 != 0">Load More</button>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>
    </div>
</div>
@endsection
