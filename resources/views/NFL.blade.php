@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NFL/NFL.js?v={{str_random(40)}}"></script>
<script src="/js/AngularControllers/NFL/NFLController.js?v={{str_random(40)}}"></script>
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
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopActualPlayers()" >Top Actual</button>
                                              <button type="button" class="btn btn-xs btn-info" ng-click="selectTopFPPGPlayers()" >Top FPPG</button>
                                              <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-xs-12">

                                                <div class="row">
                                                  <div class="col-xs-6">
                                                      <h4>Filter Position</h4>
                                                      <div class="btn-group">
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = '';" ng-class="{true: 'active', false: ''}[SelectedPosition === '']">All</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'QB';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'QB']">QB</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'RB';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'RB']">RB</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'WR';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'WR']">WR</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'TE';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'TE']">TE</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'K';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'K']">K</button>
                                                          <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'DST';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'DST']">DST</button>
                                                      </div>
                                                  </div>
                                                  <div class="col-xs-6">
                                                    <h4>Filter Teams</h4>
                                                      <div class="btn-group">
                                                          <button type="button" class="btn btn-primary" ng-repeat="team in _AllTeams" ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeams.indexOf(team) > -1]">@{{team}}</button>
                                                      </div>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Add</th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Name'; sortReverse = !sortReverse">
                                                                    Name
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Team'; sortReverse = !sortReverse">
                                                                    Team
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Opponent'; sortReverse = !sortReverse">
                                                                    Opp
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Game'; sortReverse = !sortReverse">
                                                                    Game
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Position'; sortReverse = !sortReverse">
                                                                    Pos
                                                               </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_FPPG'; sortReverse = !sortReverse">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_ActualFantasyPoints'; sortReverse = !sortReverse">
                                                                    Actual
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_Salary'; sortReverse = !sortReverse">
                                                                    Salary
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortType = '_ProjectedPointsPerDollar'; sortReverse = !sortReverse">
                                                                    Pts/Salary
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams">
                                                        <tr class="@{{player._playerInjured}}">
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player)" ng-click="addPlayerToPool(player)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player)" ng-click="removePlayerFromPool(player)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Team}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Opponent}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Game}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Position}}</td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._FPPG" type="number" ></td>
                                                            <td><input class="form-control actualPoints"  ng-model="player._ActualFantasyPoints" type="number" ></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Salary}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._ProjectedPointsPerDollar}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                    </div>



                                </div>
                            </div>
                            <div class="col-sm-4">
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
                                        <h3 class="panel-title">Player Pools</h3>
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
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(QBPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)"><abbr title="Percentage in total generated drafts">@{{QBPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Team}}<br />@{{QBPlayers._FPPG}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">RB <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_RBPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="RBPlayers in _RBPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(RBPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_RBPlayerLocked.indexOf(RBPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(RBPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)"><abbr title="Percentage in total generated drafts">@{{RBPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Team}}<br />@{{RBPlayers._FPPG}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">WR <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WRPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WRPlayers in _WRPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(WRPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_WRPlayerLocked.indexOf(WRPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WRPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)"><abbr title="Percentage in total generated drafts">@{{WRPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Team}}<br />@{{WRPlayers._FPPG}}</td>
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
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(TEPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)"><abbr title="Percentage in total generated drafts">@{{TEPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Team}}<br />@{{TEPlayers._FPPG}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">K <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_KPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="KPlayers in _KPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(KPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)"><abbr title="Percentage in total generated drafts">@{{KPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Team}}<br />@{{KPlayers._FPPG}}</td>
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
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(DSTPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)"><abbr title="Percentage in total generated drafts">@{{DSTPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Team}}<br />@{{DSTPlayers._FPPG}}</td>
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
                                                <h4>Build Drafts</h4>
                                              </div>
                                            </div>
                                            <div class="row">
                                              <div class="col-xs-12">
                                                <button type="button" class="btn btn-primary" ng-click="buildDrafts()" >Build Drafts</button>
                                                Possible: @{{TotalValidDrafts}}
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
                                                <h4><abbr title="Top range to keep.">@{{ (parseFloat(nfl.TopRange)).toFixed(2) }}</abbr> => Drafts <= <abbr title="Bottom range to keep.">@{{ (parseFloat(nfl.BottomRange)).toFixed(2) }}</abbr></h4>
                                              </div>
                                            </div>
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <button type="button" class="btn btn-primary" ng-click="removeCalcDrafts()" ng-disabled="nfl.TopRange === -1 || nfl.BottomRange === -1">Select Range</button>
                                              </div>
                                              <div class="col-xs-4">
                                                  <input type="number" class="form-control" ng-model="nfl.TopRange" >
                                              </div>
                                              <div class="col-xs-4">
                                                  <input type="number" class="form-control" ng-model="nfl.BottomRange">
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
                                                <input type="number" class="form-control" ng-model="nfl.TopLimit" >
                                              </div>
                                            </div>

                                          </div>
                                      </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Draft</th>
                                                            <th>
                                                                <span class="fake-link" ng-click="setDraftSortTypeAndReverse('FPPG')">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="setDraftSortTypeAndReverse('Actual')">
                                                                    Actual Pts
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="draft in _AllDisplayedDraftData | orderBy:sortTypeDraft:sortReverseDraft | checkValidOnly:SelectedValidDrafts">
                                                        <tr ng-click="openCloseDraftDetails(draft);">
                                                            <td>@{{$index + 1}}</td>
                                                            <td>@{{draft.FPPG}}</td>
                                                            <td>@{{draft.Actual}}</td>
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
                    <uib-tab index="1" heading="DataBase"  ng-click="loadHistory()">
                      <div class="row">
                          <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
                            <div class="panel panel-default" >
                                <div class="panel-heading">
                                  <div class='btn-toolbar pull-right'>
                                    <label class="btn btn-primary btn-file btn-xs">
                                        Add Fanduel Player CSV File <input type="file" multiple style="display: none;" custom-on-change="loadPlayers">
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
                                              <td>@{{$index+1}}</td>
                                              <td><input class="form-control" type="text" ng-model="savedSettings.title"></td>
                                              <td>@{{savedSettings.created_at}}</td>
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
