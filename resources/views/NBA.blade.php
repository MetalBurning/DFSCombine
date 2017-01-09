@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NBA/NBA.js"></script>
<script src="/js/AngularControllers/NBA/NBAController.js"></script>
<script src="/js/AngularControllers/NBA/NBAControllerHelpers.js"></script>
<div  ng-app="NBAApp">
    <div class="container" ng-controller="NBAController as nba">

        <div class="row">
            <div class="col-xs-12" id="messages">
              <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} - <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
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
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-xs-5">
                                                <h4>Filter Position</h4>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = '';" ng-class="{true: 'active', false: ''}[SelectedPosition === '']">All</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'PG';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PG']">PG</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'SG';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SG']">SG</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'SF';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'SF']">SF</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'PF';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'PF']">PF</button>
                                                    <button type="button" class="btn btn-primary" ng-click="SelectedPosition = 'C';" ng-class="{true: 'active', false: ''}[SelectedPosition === 'C']">C</button>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <h4>Filter Teams</h4>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary" ng-repeat="team in _AllTeams" ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeams.indexOf(team) > -1]">@{{team}}</button>
                                                </div>
                                            </div>
                                            <div class="col-xs-3">
                                                <h4>Options</h4>
                                                <button type="button" class="btn btn-info" ng-click="addTopTeamPlayers()" >TT</button>
                                                <button type="button" class="btn btn-info" ng-click="addTopActualResults()" >Top</button>
                                                <button type="button" class="btn btn-info" ng-click="autoAddPlayerFormula()" >Auto</button>
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
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(PGPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_PGPlayerLocked.indexOf(PGPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PGPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(SGPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_SGPlayerLocked.indexOf(SGPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SGPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(SFPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_SFPlayerLocked.indexOf(SFPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(SFPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(PFPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_PFPlayerLocked.indexOf(PFPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(PFPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(CPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
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
                                                  <abbr title="Total possible combinations excluding rules (Salary, Team limits)">Possible: @{{TotalPossibleDrafts}}</abbr>, <abbr title="Total possible valid draft combinations, only valid combinations are displayed">Valid: @{{TotalValidDrafts}}</abbr>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-md-5">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4><abbr title="Top range to keep.">@{{ (parseFloat(AVERAGE) + parseFloat(STDEVIATION)).toFixed(2) }}</abbr> => Drafts <= <abbr title="Bottom range to keep.">@{{ (parseFloat(AVERAGE) - parseFloat(STDEVIATION)).toFixed(2) }}</abbr></h4>
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
                                            <div class="col-md-3">
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <h4>Draft Options</h4>
                                                </div>
                                              </div>
                                              <div class="row">
                                                <div class="col-xs-12">
                                                  <button type="button" class="btn btn-default" ng-click="removeDraftsWithBadPlayerSetups()">RM Sp</button>
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

                    <uib-tab index="1" heading="DataBase" ng-click="loadHistory()">
                        <div class="row">
                            <div class="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-12 col-lg-offset-0 col-lg-12">
                              <div class="panel panel-default" >
                                  <div class="panel-heading">
                                    <div class='btn-toolbar pull-right'>
                                      <label class="btn btn-primary btn-file btn-xs">
                                          Load Fanduel Results CSV File <input type="file" style="display: none;"  custom-on-change="loadActual">
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
