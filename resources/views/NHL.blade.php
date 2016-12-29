@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NHL/NHL.js"></script>
<script src="/js/AngularControllers/NHL/NHLController.js"></script>
<script src="/js/AngularControllers/NHL/NHLControllerHelpers.js"></script>
<div  ng-app="NHLApp">
    <div class="container" ng-controller="NHLController as nhl">

        <div class="row">
            <div class="col-xs-12" id="messages">
                <div class="alert alert-@{{_Message.messageType}}"  role="alert" ng-show="_Message.hasData">
                    <button type="button" class="close"  aria-label="Close" ng-click="resetMessage()"><span aria-hidden="true">&times;</span></button>@{{_Message.message}}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">
                <uib-tabset active="activeJustified" justified="true">
                    <uib-tab index="0" heading="Players" >
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
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                <h4>Filter Position</h4>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = '';" ng-class="{true: 'active', false: ''}[SelectedPosition === '']">All</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'C';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'W';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'W']">W</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'D';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'D']">D</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'G';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'G']">G</button>
                                                </div>
                                            </div>
                                            <div class="col-xs-6">
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
                                                        <tr>
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
                                                                    Position
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
                                                    </thead>
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams">
                                                        <tr class="@{{player._playerInjured}}">
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player)" ng-click="addPlayerToPool(player)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player)" ng-click="removePlayerFromPool(player)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Team}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Opponent}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Game}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Position}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._FPPG}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._ActualFantasyPoints}}</td>
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
                                                            <th colspan="4">C <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_CPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="CPlayers in _CPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(CPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_CPlayerLocked.indexOf(CPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(CPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)">@{{CPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)"><abbr title="Percentage in total generated drafts">@{{CPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(CPlayers)">@{{CPlayers._Team}}<br />@{{CPlayers._FPPG}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">W <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WPlayers in _WPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(WPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_WPlayerLocked.indexOf(WPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WPlayers)">@{{WPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WPlayers)"><abbr title="Percentage in total generated drafts">@{{WPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(WPlayers)">@{{WPlayers._Team}}<br />@{{WPlayers._FPPG}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">D <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_DPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="DPlayers in _DPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(DPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_DPlayerLocked.indexOf(DPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(DPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(DPlayers)">@{{DPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(DPlayers)"><abbr title="Percentage in total generated drafts">@{{DPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(DPlayers)">@{{DPlayers._Team}}<br />@{{DPlayers._FPPG}}</td>
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
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(GPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)">@{{GPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)"><abbr title="Percentage in total generated drafts">@{{GPlayers._PercentInDrafts}}%</abbr></td>
                                                            <td ng-click="openClosePlayerDetails(GPlayers)">@{{GPlayers._Team}}<br />@{{GPlayers._FPPG}}</td>
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
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearDrafts()">Clear Drafts</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Generated Drafts</h3>
                                    </div>
                                    <div class="panel-body" set-height id="generatedDrafts">
                                        <div class="row">
                                            <div class="col-md-4">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Build Drafts</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <button type="button" class="btn btn-primary" ng-click="buildDrafts()" >ReBuild Drafts</button>
                                                  Possible: @{{TotalPossibleDrafts}}, Valid: @{{TotalValidDrafts}}
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-md-4">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>@{{ (parseFloat(AVERAGE) + parseFloat(STDEVIATION)).toFixed(2) }} => Drafts <= @{{ (parseFloat(AVERAGE) - parseFloat(STDEVIATION)).toFixed(2) }}</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-4">
                                                  <button type="button" class="btn btn-primary" ng-click="removeCalcDrafts(AVERAGE, STDEVIATION)" ng-disabled="STDEVIATION == -1 || AVERAGE == -1">Remove Range</button>

                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="text" class="form-control" ng-model="AVERAGE"   >
                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="text" class="form-control" ng-model="STDEVIATION"  >
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-md-4">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Draft Options</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <button type="button" class="btn btn-primary" ng-click="switchValidDraftSelector()" ng-class="{true: 'active', false: ''}[SelectedValidDrafts]">Show Valid Only</button>
                                                    <button type="button" class="btn btn-info" ng-click="DownloadDraftCSV()">DownloadDrafts</button>
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
                                                                <span class="fake-link" ng-click="setDraftSortTypeAndReverse('projection')">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('actual')">
                                                                    Actual Pts
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('validTeam')">
                                                                    Teams Valid
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('validSalary')">
                                                                    Salary Valid
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="draft in _AllDraftData | orderBy:sortTypeDraft:sortReverseDraft | checkValidOnly:SelectedValidDrafts">
                                                        <tr >
                                                            <td>@{{$index + 1}} <button class="btn btn-xs btn-danger" ng-click="removeDraft(draft)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.projection}}</td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.actual}}</td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.validTeam}}</td>
                                                            <td ng-click="openCloseDraftDetails(draft);">@{{draft.validSalary}}</td>
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

                    <uib-tab index="1" heading="DataBase" ng-click="loadSavedSettingsDetails()">
                        <div class="row">
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
                              <div class="panel panel-default" >
                                  <div class="panel-heading">
                                    <div class='btn-toolbar pull-right'>
                                      <label class="btn btn-primary btn-file btn-xs">
                                          Load Fanduel Results CSV File <input type="file" multiple style="display: none;" onchange="angular.element(this).scope().loadActual(this.files)">
                                      </label>
                                      <label class="btn btn-primary btn-file btn-xs">
                                          Add Fanduel Player CSV File <input type="file" multiple style="display: none;" onchange="angular.element(this).scope().loadPlayers(this.files)">
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
                                                    <th>Title (Optional)</th>
                                                    <th>Draft Created Date</th>
                                                    <th>Load</th>
                                                </tr>
                                            </thead>
                                            <tbody ng-repeat="savedSettings in savedPastSettings">
                                              <tr>
                                                <td>@{{$index+1}}</td>
                                                <td>@{{savedSettings.title}}</td>
                                                <td>@{{savedSettings.created_at}}</td>
                                                <td><button class="btn btn-sm btn-primary" ng-click="loadSavedSettings(savedSettings.id)">Load Settings</button></td>
                                              </tr>
                                            </tbody>
                                          </table>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-sm-12">
                                        <button class="btn btn-info" ng-click="loadNBASavedSettingsDetails()" ng-disabled="savedPastSettings.length % 10 != 0">Load More</button>
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
