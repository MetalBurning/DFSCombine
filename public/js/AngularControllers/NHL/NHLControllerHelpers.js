
angular.module('NHLApp').controller('DraftModalController', function ($scope, $uibModalInstance, draft) {

    $scope.draft = draft;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 60000;
        draft.players.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return startingSalary;
    }
    $scope.getDraftProjection = function (draft) {
        var totalProjection = 0;
        draft.players.forEach(function (player) {
            totalProjection = totalProjection + player._FPPG;
        });
        return totalProjection.toFixed(2);
    }
    $scope.getDraftActual = function (draft) {
        var totalActual = 0;
        draft.players.forEach(function (player) {
            totalActual = totalActual + player._ActualFantasyPoints;
        });
        return totalActual.toFixed(2);
    }
});

angular.module('NHLApp').controller('SaveModalController', function ($scope, $uibModalInstance, $http, postObject) {

  $scope.postObject = postObject;
  $scope.title = "";
  $scope.saved = false;

  $scope.savePlayerData = function() {
    if($scope.title.length > 0) {
      $http.post('/NHL/saveSettings', {'postObject':JSON.stringify($scope.postObject), 'title': $scope.title}).then(function successCallback(response) {
         console.log("success");
           $scope.saved = true;
      }, function errorCallBack(response) {
        console.log("errror");
        $uibModalInstance.close();
      });
    } else {
      $http.post('/NHL/saveSettings', {'postObject':JSON.stringify($scope.postObject)}).then(function successCallback(response) {
         console.log("success");
         $scope.saved = true;
      }, function errorCallBack(response) {
        console.log("errror");
      });
    }


  }
  $scope.ok = function () {
      $uibModalInstance.close();
  };

  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
});


angular.module('NHLApp').controller('PlayerModalController', function ($scope, $uibModalInstance, allPlayers, selectedPlayer) {

    $scope.SelectedPlayer = selectedPlayer;
    $scope.allPlayers = allPlayers;

    $scope.injuryStatus = 'No Current Injury';

    $scope.OppHistoryVsPostion = [];
    $scope.OppHistoryVsPostionActualAverage = 0;
    $scope.OppHistoryVsPostionProjectionAverage = 0;

    $scope.playerPastData = [];
    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.SelectedPosition = '';     // set the default search/filter term

    var createPlayerData = function () {

        if($scope.SelectedPlayer._playerInjured == 'danger') {
          $scope.injuryStatus = 'Out';
        } else if($scope.SelectedPlayer._playerInjured == 'warning') {
          $scope.injuryStatus = 'Questionable';
        }

        $scope.allPlayers.forEach(function (player) {
            //player history
            if (player._Name == $scope.SelectedPlayer._Name && player._Team == $scope.SelectedPlayer._Team) {
                //match
                if ($scope.playerPastData.indexOf(player) == -1) {
                    $scope.playerPastData.push(player);
                }
            }
            //Opponent history vs player position
            if ($scope.SelectedPlayer._Position == player._Position && $scope.SelectedPlayer._Opponent == player._Opponent) {
                //match
                if ($scope.OppHistoryVsPostion.indexOf(player) == -1) {
                    $scope.OppHistoryVsPostion.push(player);
                }

            }
        });
        $scope.OppHistoryVsPostion.forEach(function (player) {
            if (player._FPPG < 0) {
                $scope.OppHistoryVsPostionProjectionAverage += 0;
            } else {
                $scope.OppHistoryVsPostionProjectionAverage += player._FPPG;
            }
            if (player._ActualFantasyPoints < 0) {
                $scope.OppHistoryVsPostionActualAverage += 0;
            } else {
                $scope.OppHistoryVsPostionActualAverage += player._ActualFantasyPoints;
            }

        });
        $scope.OppHistoryVsPostionActualAverage = ($scope.OppHistoryVsPostionActualAverage / $scope.OppHistoryVsPostion.length).toFixed(2);
        $scope.OppHistoryVsPostionProjectionAverage = ($scope.OppHistoryVsPostionProjectionAverage / $scope.OppHistoryVsPostion.length).toFixed(2);
    };
    createPlayerData();

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
