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
            <tbody ng-repeat="player in _AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeam">
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
