@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/NFL.js"></script>
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
                    <uib-tab index="0" heading="Players" >
                        <!-- start player selection -->
                        <div class="row">
                            <div class="col-sm-8">
                                <div class="panel panel-default" >
                                    <div class="panel-heading">
                                        <div class='btn-toolbar pull-right'>
                                            <div class='btn-group'>
                                                <button type="button" class="btn btn-xs btn-default" ng-click="clearAllPlayerFilters()">Clear Filters</button>
                                            </div>
                                        </div>
                                        <h3 class="panel-title">Select Players</h3>
                                    </div>
                                    <div class="panel-body" set-height id="players">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <h4>Filter Teams</h4>
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-sm btn-primary" ng-repeat="team in _AllTeams" ng-click="addRemoveTeam(team);" ng-class="{true: 'active', false: ''}[SelectedTeams.indexOf(team) > -1]">@{{team}}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <div class="row">

                                                    <div class="col-sm-6">
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
                                                    <div class="col-sm-6">
                                                        <h4>Filter Weeks</h4>
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-primary" ng-repeat="week in _AllWeeks" ng-click="addRemoveWeek(week);" ng-class="{true: 'active', false: ''}[SelectedWeeks.indexOf(week) > -1]">@{{week}}</button>
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
                                                                <a href="#" ng-click="sortType = '_WeekNum'; sortReverse = !sortReverse">
                                                                    Week
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_Name'; sortReverse = !sortReverse">
                                                                    Name
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_Team'; sortReverse = !sortReverse">
                                                                    Team
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_Opponent'; sortReverse = !sortReverse">
                                                                    Opponent
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_Position'; sortReverse = !sortReverse">
                                                                    Position
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_ProjectedFantasyPoints'; sortReverse = !sortReverse">
                                                                    Projection
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_ActualFantasyPoints'; sortReverse = !sortReverse">
                                                                    Actual
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortType = '_Salary'; sortReverse = !sortReverse">
                                                                    Salary
                                                                </a>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams | weeks:SelectedWeeks">
                                                        <tr>
                                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player)" ng-click="addPlayerToPool(player)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player)" ng-click="removePlayerFromPool(player)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._WeekNum}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Team}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Opponent}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._Position}}</td>
                                                            <td ng-click="openClosePlayerDetails(player)">@{{player._ProjectedFantasyPoints}}</td>
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
                                                            <th colspan="3">QB <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_QBPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="QBPlayers in _QBPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(QBPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Team}}<br />@{{QBPlayers._ProjectedFantasyPoints}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="3">RB <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_RBPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="RBPlayers in _RBPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(RBPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_RBPlayerLocked.indexOf(RBPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(RBPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Team}}<br />@{{RBPlayers._ProjectedFantasyPoints}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="3">WR <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_WRPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="WRPlayers in _WRPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-success" ng-click="lockAndUnLockPlayer(WRPlayers)"><span class="glyphicon" ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_WRPlayerLocked.indexOf(WRPlayers) > -1]"></span></button><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(WRPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Team}}<br />@{{WRPlayers._ProjectedFantasyPoints}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="3">TE <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_TEPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="TEPlayers in _TEPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(TEPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Team}}<br />@{{TEPlayers._ProjectedFantasyPoints}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="3">K <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_KPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="KPlayers in _KPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(KPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Team}}<br />@{{KPlayers._ProjectedFantasyPoints}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="3">DST <abbr title="Salary average for this pool">(@{{averagePlayerPoolSalary(_DSTPlayerPool)}})</abbr></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="DSTPlayers in _DSTPlayerPool">
                                                        <tr>
                                                            <td><button class="btn btn-xs btn-danger" ng-click="removePlayerFromPool(DSTPlayers)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Name}}</td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._PercentInDrafts}}</td>
                                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Team}}<br />@{{DSTPlayers._ProjectedFantasyPoints}}</td>
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
                                                <button type="button" class="btn btn-primary" ng-click="buildDrafts()">Build Drafts</button>
                                                Possible: @{{TotalPossibleDrafts}}, Valid: @{{TotalValidDrafts}}
                                            </div>
                                            <div class="col-md-3">
                                                <div class="col-xs-4">
                                                    <button type="button" class="btn btn-primary" ng-click="removeCalcDrafts(AVERAGE, STDEVIATION)" ng-disabled="STDEVIATION == -1 || AVERAGE == -1">Remove</button>
                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="text" class="form-control " ng-model="AVERAGE" ng-init="AVERAGE=-1" id="AVERAGE" placeholder="AVERAGE">
                                                </div>
                                                <div class="col-xs-4">
                                                    <input type="text" class="form-control" ng-model="STDEVIATION" ng-init="STDEVIATION=-1" id="STDEVIATION" placeholder="STDEVIATION">
                                                </div>
                                            </div>
                                            <div class="col-md-5">
                                                <button type="button" class="btn btn-primary" ng-click="switchValidDraftSelector()" ng-class="{true: 'active', false: ''}[SelectedValidDrafts]">Apply Valid Only Filter</button>
                                                <label class="btn btn-primary btn-file">
                                                    Add Player IDs <input type="file" style="display: none;" onchange="angular.element(this).scope().addPlayerIDs(this.files)">
                                                </label>
                                                <button type="button" class="btn btn-info" ng-click="DownloadDraftCSV()">DownloadDrafts</button>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Draft</th>
                                                            <th>
                                                                <a href="#" ng-click="sortTypeDraft = 'projection'; sortReverseDraft = !sortReverseDraft">
                                                                    Projected Pts
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortTypeDraft = 'actual'; sortReverseDraft = !sortReverseDraft">
                                                                    Actual Pts
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortTypeDraft = 'validTeam'; sortReverseDraft = !sortReverseDraft">
                                                                    Teams Valid
                                                                </a>
                                                            </th>
                                                            <th>
                                                                <a href="#" ng-click="sortTypeDraft = 'validSalary'; sortReverseDraft = !sortReverseDraft">
                                                                    Salary Valid
                                                                </a>
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
                    <uib-tab index="1" heading="Pools / Generator">
                        <!-- start Draft selection -->
                        <div class="row" id="poolPlayers">
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">QB (@{{averagePlayerPoolSalary(_QBPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="QBPlayers in _QBPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(QBPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(QBPlayers)">@{{QBPlayers._Team}}<br />@{{QBPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">RB (@{{averagePlayerPoolSalary(_RBPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="RBPlayers in _RBPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-success glyphicon " ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_RBPlayerLocked.indexOf(RBPlayers) > -1]" ng-click="lockAndUnLockPlayer(RBPlayers)"></button><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(RBPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(RBPlayers)">@{{RBPlayers._Team}}<br />@{{RBPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">WR (@{{averagePlayerPoolSalary(_WRPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="WRPlayers in _WRPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-success glyphicon " ng-class="{true: 'glyphicon-floppy-saved', false: 'glyphicon-floppy-remove'}[_WRPlayerLocked.indexOf(WRPlayers) > -1]" ng-click="lockAndUnLockPlayer(WRPlayers)"></button><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(WRPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(WRPlayers)">@{{WRPlayers._Team}}<br />@{{WRPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">TE (@{{averagePlayerPoolSalary(_TEPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="TEPlayers in _TEPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(TEPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(TEPlayers)">@{{TEPlayers._Team}}<br />@{{TEPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">K (@{{averagePlayerPoolSalary(_KPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="KPlayers in _KPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(KPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(KPlayers)">@{{KPlayers._Team}}<br />@{{KPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xs-2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th colspan="3">DST (@{{averagePlayerPoolSalary(_DSTPlayerPool)}})</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="DSTPlayers in _DSTPlayerPool">
                                        <tr>
                                            <td><button class="btn-xs btn-danger glyphicon glyphicon-remove" ng-click="removePlayerFromPool(DSTPlayers)"></button></td>
                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Name}}</td>
                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._PercentInDrafts}}</td>
                                            <td ng-click="openClosePlayerDetails(DSTPlayers)">@{{DSTPlayers._Team}}<br />@{{DSTPlayers._ProjectedFantasyPoints}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4">
                                <button type="button" class="btn btn-default" ng-click="clearPlayerPools()">Clear Pools</button>
                            </div>
                            <div class="col-xs-8">
                                <button type="button" class="btn btn-primary" ng-click="buildDrafts()">Build Drafts</button>
                                Total Possible Combinations: @{{TotalPossibleDrafts}},  Total Valid Combinations: @{{TotalValidDrafts}}

                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="col-md-4">
                                    <button type="button" class="btn btn-primary" ng-click="buildDrafts()">Build Drafts</button>
                                    Possible: @{{TotalPossibleDrafts}}, Valid: @{{TotalValidDrafts}}
                                </div>
                                <div class="col-md-3">
                                    <div class="col-xs-4">
                                        <button type="button" class="btn btn-primary" ng-click="removeCalcDrafts(AVERAGE, STDEVIATION)" ng-disabled="STDEVIATION == -1 || AVERAGE == -1">Remove</button>
                                    </div>
                                    <div class="col-xs-4">
                                        <input type="text" class="form-control " ng-model="AVERAGE" ng-init="AVERAGE=-1" id="AVERAGE" placeholder="AVERAGE">
                                    </div>
                                    <div class="col-xs-4">
                                        <input type="text" class="form-control" ng-model="STDEVIATION" ng-init="STDEVIATION=-1" id="STDEVIATION" placeholder="STDEVIATION">
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <button type="button" class="btn btn-primary" ng-click="switchValidDraftSelector()" ng-class="{true: 'active', false: ''}[SelectedValidDrafts]">Apply Valid Only Filter</button>
                                    <label class="btn btn-primary btn-file">
                                        Add Player IDs <input type="file" style="display: none;" onchange="angular.element(this).scope().addPlayerIDs(this.files)">
                                    </label>
                                    <button type="button" class="btn btn-info" ng-click="DownloadDraftCSV()">DownloadDrafts</button>
                                </div>
                            </div>
                            <div class="col-xs-12" id="generatedDrafts">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Draft</th>
                                            <th>
                                                <a href="#" ng-click="sortTypeDraft = 'projection'; sortReverseDraft = !sortReverseDraft">
                                                    Projected Pts
                                                    <span ng-show="sortTypeDraft == 'projection' && !sortReverseDraft" class="fa fa-caret-down"></span>
                                                    <span ng-show="sortTypeDraft == 'projection' && sortReverseDraft" class="fa fa-caret-up"></span>
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" ng-click="sortTypeDraft = 'actual'; sortReverseDraft = !sortReverseDraft">
                                                    Actual Pts
                                                    <span ng-show="sortTypeDraft == 'actual' && !sortReverseDraft" class="fa fa-caret-down"></span>
                                                    <span ng-show="sortTypeDraft == 'actual' && sortReverseDraft" class="fa fa-caret-up"></span>
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" ng-click="sortTypeDraft = 'validTeam'; sortReverseDraft = !sortReverseDraft">
                                                    Teams Valid
                                                    <span ng-show="sortTypeDraft == 'validTeam' && !sortReverseDraft" class="fa fa-caret-down"></span>
                                                    <span ng-show="sortTypeDraft == 'validTeam' && sortReverseDraft" class="fa fa-caret-up"></span>
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" ng-click="sortTypeDraft = 'validSalary'; sortReverseDraft = !sortReverseDraft">
                                                    Salary Valid
                                                    <span ng-show="sortTypeDraft == 'validSalary' && !sortReverseDraft" class="fa fa-caret-down"></span>
                                                    <span ng-show="sortTypeDraft == 'validSalary' && sortReverseDraft" class="fa fa-caret-up"></span>
                                                </a>
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
                    </uib-tab>

                    <uib-tab index="2" heading="Stacks">
                        <!-- start Stacks -->
                        <div class="row">
                            <div class="col-xs-12">
                                <h3>Build Stacks</h3>
                                <button type="button" class="btn btn-default" ng-click="clearStackPositions()">Clear Stack Position Settings</button>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('QB') > -1]" ng-click="addRemovePositionToSelectedStacks('QB')">QB</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('RB') > -1]" ng-click="addRemovePositionToSelectedStacks('RB')">RB</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('RB1') > -1]" ng-click="addRemovePositionToSelectedStacks('RB1')">RB</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('WR') > -1]" ng-click="addRemovePositionToSelectedStacks('WR')">WR</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('WR1') > -1]" ng-click="addRemovePositionToSelectedStacks('WR1')">WR</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('WR2') > -1]" ng-click="addRemovePositionToSelectedStacks('WR2')">WR</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('TE') > -1]" ng-click="addRemovePositionToSelectedStacks('TE')">TE</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('K') > -1]" ng-click="addRemovePositionToSelectedStacks('K')">K</button>
                                    <button type="button" class="btn btn-primary" ng-class="{true: 'active', false: ''}[SelectedStackPositions.indexOf('DST') > -1]" ng-click="addRemovePositionToSelectedStacks('DST')">DST</button>
                                </div>

                            </div>
                            <div class="col-xs-12">
                                <button type="button" class="btn btn-default" ng-click="clearAllStacks()">Clear Stacks</button>
                                <button type="button" class="btn btn-primary" ng-click="buildStacks()">Build Stacks</button>
                            </div>
                            <div class="col-xs-12">
                                <table class="table table-hover" ng-repeat="players in _AllStacks ">
                                    <thead>
                                        <tr>
                                            <th>Add/Remove</th>
                                            <th>Week</th>
                                            <th>Name</th>
                                            <th>Team</th>
                                            <th>Opponent</th>
                                            <th>Position</th>
                                            <th>ProjPts</th>
                                            <th>ActPts</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody ng-repeat="player in players">
                                        <tr>
                                            <td><button type="button" class="btn btn-xs btn-success" ng-show="!playerInPool(player)" ng-click="addPlayerToPool(player)">Add Player Pool</button><button type="button" class="btn  btn-xs btn-danger" ng-show="playerInPool(player)" ng-click="removePlayerFromPool(player)">Remove Player Pool</button></td>
                                            <td>@{{player._WeekNum}}</td>
                                            <td>@{{player._Name}}</td>
                                            <td>@{{player._Team}}</td>
                                            <td>@{{player._Opponent}}</td>
                                            <td>@{{player._Position}}</td>
                                            <td>@{{player._ProjectedFantasyPoints}}</td>
                                            <td>@{{player._ActualFantasyPoints}}</td>
                                            <td>@{{player._Salary}}</td>
                                        </tr>
                                    </tbody>
                                    <tr>
                                        <td>Projected: @{{players | sumProjection:players}}</td>
                                        <td>Actual: @{{players | sumActual:players}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </uib-tab>
                    <uib-tab index="3" heading="DataBase">
                        <div class="row">
                            <div class="col-sm-6 text-center">
                                <h3>Will insert projected player stats to the DB</h3>
                                <label class="btn btn-primary btn-file">
                                    Submit Projected Player CSV Files <input type="file" multiple style="display: none;" onchange="angular.element(this).scope().submitProjectedCSVs(this.files)">
                                </label>
                            </div>

                            <div class="col-sm-6 text-center">
                                <h3>Will update DB with player's actual score</h3>
                                <label class="btn btn-primary btn-file">
                                    Submit Actual Player CSV Files <input type="file" multiple style="display: none;" onchange="angular.element(this).scope().submitActualCSVs(this.files)">
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 text-center">
                                <label class="btn btn-primary btn-file">
                                    Get All Players <input multiple style="display: none;" ng-click="getAllPlayers()">
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 text-center">
                                <label class="btn btn-primary btn-file">
                                    Delete all lineups <input multiple style="display: none;" ng-click="deleteAllLineups()">
                                </label>
                            </div>
                        </div>
                    </uib-tab>
                </uib-tabset>
            </div>
        </div>
    </div>
</div>
@endsection
