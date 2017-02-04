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
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams">
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
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player, SelectedPosition)" ng-click="addPlayerToPool(player, SelectedPosition)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player, SelectedPosition)" ng-click="removePlayerFromPool(player, SelectedPosition)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                            <th colspan="4">PG1 <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_PG1PlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="PG1Players in _PG1PlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PG1Players, 'PG1')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(PG1Players)">@{{PG1Players._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(PG1Players)"><abbr title="Percentage in total generated drafts">@{{PG1Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(PG2Players)"><abbr title="Percentage in total generated drafts">@{{PG2Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SG1Players)"><abbr title="Percentage in total generated drafts">@{{SG1Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SG2Players)"><abbr title="Percentage in total generated drafts">@{{SG2Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SF1Players)"><abbr title="Percentage in total generated drafts">@{{SF1Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(SF2Players)"><abbr title="Percentage in total generated drafts">@{{SF2Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(PF1Players)"><abbr title="Percentage in total generated drafts">@{{PF1Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(PF2Players)"><abbr title="Percentage in total generated drafts">@{{PF2Players._PercentInDrafts}}%</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(CPlayers)"><abbr title="Percentage in total generated drafts">@{{CPlayers._PercentInDrafts}}%</abbr></td>
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
                                                  <h4>Build Drafts - Remove Dups: <input type="checkbox" class="form-inline" ng-model="nba.removeDups"></h4>
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
                                                  <h4><abbr title="Top range to keep.">@{{ (parseFloat(nba.TopRange)).toFixed(2) }}</abbr> => Drafts => <abbr title="Bottom range to keep.">@{{ (parseFloat(nba.BottomRange)).toFixed(2) }}</abbr></h4>
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
                                          Add Actual CSV File <input type="file" style="display: none;" custom-on-change="loadActual">
                                      </label>
                                      <label class="btn btn-primary btn-file btn-xs">
                                          Add Fanduel Player CSV File <input type="file" style="display: none;" custom-on-change="loadPlayers">
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
