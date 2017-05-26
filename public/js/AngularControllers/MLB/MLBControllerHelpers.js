
angular.module('MLBApp').controller('AdvancedControllerMLB', function ($scope, $uibModalInstance, minTeamStack1, minTeamStack2, battersVSPitcher) {

    $scope.minTeamStack1 = minTeamStack1;
    $scope.minTeamStack2 = minTeamStack2;
    $scope.battersVSPitcher = battersVSPitcher;

    $scope.ok = function () {
        $uibModalInstance.close({minTeamStack1: $scope.minTeamStack1, minTeamStack2: $scope.minTeamStack2, battersVSPitcher: $scope.battersVSPitcher});
    };

    $scope.cancel = function () {
        $uibModalInstance.close({minTeamStack1: $scope.minTeamStack1, minTeamStack2: $scope.minTeamStack2, battersVSPitcher: $scope.battersVSPitcher});
    };
});

angular.module('MLBApp').controller('DraftModalController', function ($scope, $uibModalInstance, draft) {

    $scope.draft = draft;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 35000;
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
angular.module('MLBApp').controller('DKDraftModalController', function ($scope, $uibModalInstance, draft) {

    $scope.draft = draft;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 50000;
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
angular.module('MLBApp').controller('SaveModalController', function ($scope, $uibModalInstance, $http, postObject, currentRead, site, $timeout) {

  $scope.postObject = postObject;
  $scope.currentRead = currentRead;
  $scope.site = site;

  $scope.readData = undefined;

  if(currentRead != null) {
    $scope.title = currentRead['title'];
  } else {
    $scope.title = "";
  }

  $scope.saved = false;
  $scope.alerts = [{type: "info", msg: "Save / Update current settings.", number: 1 }];

  $scope.CreateUpdateButtonEnabled = true;

  $scope.displayNewMessage = function (messageType, messageContent) {
    $scope.addAlert(messageType, messageContent);
  }
  $scope.addAlert = function(type, message) {
    var sameNumberOfAlerts = 1;
    $scope.alerts.forEach(function(alert) {
      if(alert.type == type && alert.msg == message) {
        sameNumberOfAlerts++;
      }
    });
    $scope.alerts.push({type: type, msg: message, number: sameNumberOfAlerts});
  }
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  }



  $scope.create = function() {
    if($scope.title.length > 0 ) {
      $scope.CreateUpdateButtonEnabled = false;
      $http.post('/MLB/create', {'postObject':JSON.stringify($scope.postObject), 'title': $scope.title, 'site': $scope.site}).then(function successCallback(response) {
         $scope.saved = true;
         $scope.displayNewMessage('success', 'Creating - Success');
         $scope.readData = response.data;
         $scope.CreateUpdateButtonEnabled = true;
         $uibModalInstance.close({title: $scope.title, postObject: $scope.postObject, readData: $scope.readData});
      }, function errorCallBack(response) {
        if(response.data.title.length > 0) {
          $scope.displayNewMessage('danger', 'Creating - Failed, '+response.data.title);
        } else if(response.data.postObject.length > 0) {
          $scope.displayNewMessage('danger', 'Creating - Failed, '+response.data.postObject);
        }
        $scope.CreateUpdateButtonEnabled = true;
      });
    } else {
        $scope.displayNewMessage('danger', 'Creating - Failed, title is required');
        $scope.CreateUpdateButtonEnabled = true;
    }
  }
  $scope.update = function() {
    if($scope.currentRead != null) {
      $scope.CreateUpdateButtonEnabled = false;
      $http.post('/MLB/update', {'id':$scope.currentRead['id'], 'postObject':JSON.stringify($scope.postObject), 'title': $scope.title}).then(function successCallback(response) {
         $scope.displayNewMessage('success', 'Updating - Success');
         $scope.saved = true;
         $scope.readData = response.data;
         $scope.CreateUpdateButtonEnabled = true;
      }, function errorCallBack(response) {
        if(response.data.title.length > 0) {
          $scope.displayNewMessage('danger', 'Updating - Failed, '+response.data.title);
        } else if(response.data.id.length > 0) {
          $scope.displayNewMessage('danger', 'Updating - Failed, '+response.data.id);
        } else if(response.data.postObject.length > 0) {
          $scope.displayNewMessage('danger', 'Updating - Failed, '+response.data.postObject);
        }
        $scope.CreateUpdateButtonEnabled = true;
      });
    }
  }


  $scope.hasCurrentRead = function() {
    return ($scope.currentRead != null);
  }


  $scope.ok = function () {
    if($scope.readData !== undefined) {
      $uibModalInstance.close({title: $scope.title, postObject: $scope.postObject, readData: $scope.readData});
    } else {
      $uibModalInstance.dismiss();
    }
  };

  $scope.cancel = function () {
    if($scope.readData !== undefined) {
      $uibModalInstance.close({title: $scope.title, postObject: $scope.postObject, readData: $scope.readData});
    } else {
      $uibModalInstance.dismiss();
    }

  };
});


angular.module('MLBApp').controller('PlayerModalController', function ($scope, $uibModalInstance, allPlayers, selectedPlayer) {

    $scope.SelectedPlayer = selectedPlayer;
    $scope.allPlayers = allPlayers;

    $scope.injuryStatus = 'No Current Injury';

    $scope.OppHistoryVsPostion = [];
    $scope.OppHistoryVsPostionActualAverage = 0;
    $scope.OppHistoryVsPostionProjectionAverage = 0;

    $scope.playerPastData = [];
    $scope.sortType = '_WeekNum'; // set the default sort type
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
