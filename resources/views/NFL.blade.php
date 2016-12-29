@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NFL/NFL.js"></script>
<script src="/js/AngularControllers/NFL/NFLController.js"></script>
<script src="/js/AngularControllers/NFL/NFLControllerHelpers.js"></script>
<div  ng-app="NFLApp">
    <div class="container" ng-controller="NFLController as nfl">

        <div class="row">
            <div class="col-xs-12" id="messages">
                <div class="alert alert-@{{_Message.messageType}}"  role="alert" ng-show="_Message.hasData">
                    <button type="button" class="close"  aria-label="Close" ng-click="resetMessage()"><span aria-hidden="true">&times;</span></button>@{{_Message.message}}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <uib-tabset active="activeJustified" justified="true">
                    <uib-tab index="0" heading="Player Settings" >
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
                                                                    Position
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
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams | weeks:SelectedWeeks">
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
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)"><abbr title="Percentage in total generated drafts">@{{QBPlayers._PercentInDrafts}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)"><abbr title="Percentage in total generated drafts">@{{RBPlayers._PercentInDrafts}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)"><abbr title="Percentage in total generated drafts">@{{WRPlayers._PercentInDrafts}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)"><abbr title="Percentage in total generated drafts">@{{TEPlayers._PercentInDrafts}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(KPlayers)"><abbr title="Percentage in total generated drafts">@{{KPlayers._PercentInDrafts}}</abbr></td>
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
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)"><abbr title="Percentage in total generated drafts">@{{DSTPlayers._PercentInDrafts}}</abbr></td>
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
                                                                <span class="fake-link" ng-click="sortTypeDraft = 'projection'; sortReverseDraft = !sortReverseDraft">
                                                                    FPPG
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortTypeDraft = 'actual'; sortReverseDraft = !sortReverseDraft">
                                                                    Actual Pts
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortTypeDraft = 'validTeam'; sortReverseDraft = !sortReverseDraft">
                                                                    Teams Valid
                                                              </span>
                                                            </th>
                                                            <th>
                                                                <span class="fake-link" ng-click="sortTypeDraft = 'validSalary'; sortReverseDraft = !sortReverseDraft">
                                                                    Salary Valid
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="draft in _AllDraftData | orderBy:sortTypeDraft:sortReverseDraft | checkValidOnly:SelectedValidDrafts">
                                                        <tr ng-click="openCloseDraftDetails(draft);">
                                                            <td>@{{$index + 1}}</td>
                                                            <td>@{{draft.projection}}</td>
                                                            <td>@{{draft.actual}}</td>
                                                            <td>@{{draft.validTeam}}</td>
                                                            <td>@{{draft.validSalary}}</td>
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
