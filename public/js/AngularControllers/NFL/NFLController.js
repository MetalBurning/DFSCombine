
angular.module('NFLApp').controller('NFLController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nfl = this;

    $scope.mainTabHeading = "Players";
    $scope.alerts = [
      { type: 'info', msg: 'Please Upload/Load Players...', number: 1 }
    ];

    $scope._Positions = [];
    $scope._AllTeams = [];
    $scope._AllWeeks = [];
    $scope._AllPlayersMASTER = [];
    $scope._AllPlayers = [];
    $scope._AllReadPlayerIDs = [];
    $scope._AllStacks = [];

    $scope._QBPlayerLocked = [];
    $scope._WRPlayerLocked = [];
    $scope._RBPlayerLocked = [];
    $scope._TEPlayerLocked = [];
    $scope._KPlayerLocked = [];
    $scope._DSTPlayerLocked = [];

    $scope._QBPlayerPool = [];
    $scope._WRPlayerPool = [];
    $scope._RBPlayerPool = [];
    $scope._TEPlayerPool = [];
    $scope._KPlayerPool = [];
    $scope._DSTPlayerPool = [];

    $scope.sortTypeDraft = 'FPPG';
    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = false;

    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.SelectedPosition = '';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedWeeks = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;

    $scope.savedPastSettings = [];
    nfl.TopRange = parseFloat(-1);
    nfl.BottomRange = parseFloat(-1);

    $scope.DeleteConfirmationID = -1;
    $scope.currentRead = null;
    nfl.TopLimit = 150;

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeams);
    $scope._AllPlayers = $filter('position')($scope._AllPlayers, $scope.SelectedPosition);
    //$http.post("/api/NFL/getAllWeeks").then(function successCallback(response) {
    //    $scope._AllWeeks = [];//clear out
    //    response.data.forEach(function (element) {
    //        $scope._AllWeeks.push(element);
    //    });
    //    console.log("weeks: ", $scope._AllWeeks);
    //}, function errorCallBack(response) {

    //});

    var compareNumbers = function(a, b) {
        return b-a;
    }

    $scope.displayNewMessage = function (messageType, messageContent) {
      $window.scrollTo(0, 0);
      $scope.addAlert(messageType, messageContent);
    }
    $scope.addAlert = function(type, message) {
      var sameNumberOfAlerts = 1;
      if($scope.alerts.length > 100) {
        $scope.alerts = [];
      }
      $scope.alerts.forEach(function(alert) {
        if(alert.type == type && alert.msg == message) {
          sameNumberOfAlerts++;
        }
      });
      if(message.indexOf('Unauthenticated') !== -1) {
        $scope.alerts.push({type: type, msg: message, number: sameNumberOfAlerts, login: true});
      } else {
        $scope.alerts.push({type: type, msg: message, number: sameNumberOfAlerts, login: false});
      }

    }
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    }

    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
    }

    $scope.loadPlayers = function (event) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.currentRead = null;
      $scope.mainTabHeading = "Players";

      var formData = new FormData();
      formData.append('csvFile', event.target.files[0]);

      $http.post("/NFL/loadFanDuelPlayers", formData, {
          headers: {
              "Content-Type": undefined,
              transformRequest: angular.identity
          }
      }).then(function successCallBack(response) {
          console.log(response);
          response.data.forEach(function(player) {
            player._Salary = parseFloat(player._Salary);
            player._FPPG = parseFloat(player._FPPG);
            player._FPPG = player._FPPG.toFixed(2);
            player._FPPG = parseFloat(player._FPPG);
            var pointsPerDollar = parseFloat((player._FPPG / player._Salary).toFixed(5));
            player._ProjectedPointsPerDollar = pointsPerDollar;
            if (player._playerInjured == 'IR' || player._playerInjured == 'O' || player._playerInjured == 'NA') {
                player._playerInjured = 'danger';
            } else if(player._playerInjured == 'Q' || player._playerInjured == 'D') {
                player._playerInjured = 'warning';
            }
            //position data
            if($scope._Positions.indexOf(player._Position) === -1) {
              $scope._Positions.push(player._Position);
            }
            //add team data
            if ($scope._AllTeams.length == 0) {
                $scope._AllTeams.push(player._Team);
            } else if ($scope._AllTeams.indexOf(player._Team) == -1) {
                $scope._AllTeams.push(player._Team);
            }
            $scope._AllPlayers.push(player);
            $scope._AllPlayersMASTER.push(player);
          });
          if($scope._AllPlayers.length > 0) {
            $scope.displayNewMessage("success", "Players have been successfully loaded");
          }
      }, function errorCallBack(response) {
          console.log(response);
          $scope.displayNewMessage("danger", "Error: Players could not be loaded.");
      });

    }

    $scope.loadActual = function (file) {
        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');


            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(';');

                var playerPosition = "";
                var playerFName = "";
                var playerLName = "";
                var playerPoints = 0;
                var playerSalary = 0;
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 2:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 3:
                            var name = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            var splitName = name.split(' ');
                            playerFName = splitName[0];
                            if(splitName.length == 2) {
                                playerLName = splitName[1];
                            } else {
                                playerLName = splitName[2];
                            }
                            break;
                        case 5:
                            playerPoints = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 6:
                            playerSalary = parseInt(data[j].replace('"', '').replace('"', '').replace('$', '').trim());
                            break;

                    }
                }

                $scope._AllPlayers.forEach(function (player) {
                    if((player._Name.includes(playerFName) && player._Name.includes(playerLName)) && player._Position == playerPosition) {
                        player._ActualFantasyPoints = playerPoints;
                    }
                });
            }

            $scope.displayNewMessage("info", "Player Actual Results have been successfully loaded");
        }
        reader.readAsText(file[0]);
    }

    $scope.parseFloat = function(value)
    {
       return parseFloat(value);
    }
    $scope.resetMessage = function () {
        $scope._Message.hasData = false;
        $scope._Message.messageType = "info";
        $scope._Message.message = "";
    }

    $scope.addTeam = function (team) {
        if(SelectedTeams.indexOf(team) == -1) {
            SelectedTeams.push(team);
        }
    }
    $scope.addRemoveTeam = function (team) {
        var playerIndex = $scope.SelectedTeams.indexOf(team);
        if (playerIndex > -1) {
            $scope.SelectedTeams.splice(playerIndex, 1);
        } else {
            $scope.SelectedTeams.push(team);
        }
    }
    $scope.addRemoveWeek= function (week) {
        var weekIndex = $scope.SelectedWeeks.indexOf(week);
        if (weekIndex > -1) {
            $scope.SelectedWeeks.splice(weekIndex, 1);
        } else {
            $scope.SelectedWeeks.push(week);
        }
    }
    $scope.DownloadDraftCSV = function () {
        if ($scope._AllDraftData.length == 0) {
            $scope.displayNewMessage("danger", "Error: Cannot downloaded drafts when none have been generated");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,";
        var drafts = $scope._AllDraftData;

        drafts = $filter('checkValidOnly')(drafts, true);
        drafts = $filter('randomize')(drafts);

        csvContent = csvContent + "QB,RB,RB,WR,WR,WR,TE,K,D\n";
        drafts.forEach(function (draft) {
            var lineOfText = "";
            for (var j = 0; j < draft.players.length; j++) {
                if (j == 0)
                {
                    lineOfText = lineOfText + draft.players[j].playerID;
                }
                else
                {
                    lineOfText = lineOfText + "," + draft.players[j].playerID;
                }
            }
            csvContent = csvContent + lineOfText + "\n";
        });

        var anchor = angular.element('<a/>');
        anchor.css({ display: 'none' }); // Make sure it's not visible
        angular.element(document.body).append(anchor); // Attach to document

        var teams = "";
        $scope._AllTeams.forEach(function (team) {
            teams = teams + "_" + team;
        });

        anchor.attr({
            href: encodeURI(csvContent),
            target: '_blank',
            download: teams+'.csv'
        })[0].click();

        anchor.remove(); // Clean it up afterwards


        //window.open(encodedUri);
    }

    $scope.lockAndUnLockPlayer = function (player)
    {
        if ($scope.playerInPool(player)) {
            switch (player._Position) {
                case 'QB':
                    if ($scope._QBPlayerLocked.indexOf(player) == -1)
                    {
                        $scope._QBPlayerLocked.push(player);
                    }
                    else
                    {
                        $scope._QBPlayerLocked.splice($scope._QBPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'RB':
                    if ($scope._RBPlayerLocked.indexOf(player) == -1) {
                        if ($scope._RBPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: _RBPlayerLocked.length >= 2, cannot lock more than 2 RBs");
                            return;
                        }
                        $scope._RBPlayerLocked.push(player);
                    } else {
                        $scope._RBPlayerLocked.splice($scope._RBPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'WR':
                    if ($scope._WRPlayerLocked.indexOf(player) == -1) {
                        if ($scope._WRPlayerLocked.length >= 3) {
                            $scope.displayNewMessage("danger", "Error: _WRPlayerLocked.length >= 3, cannot lock more than 3 WRs");
                            return;
                        }
                        $scope._WRPlayerLocked.push(player);
                    } else {
                        $scope._WRPlayerLocked.splice($scope._WRPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'TE':
                    if ($scope._TEPlayerLocked.indexOf(player) == -1) {
                        $scope._TEPlayerLocked.push(player);
                    } else {
                        $scope._TEPlayerLocked.splice($scope._TEPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'K':
                    if ($scope._KPlayerLocked.indexOf(player) == -1) {
                        $scope._KPlayerLocked.push(player);
                    } else {
                        $scope._KPlayerLocked.splice($scope._KPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'DST':
                    if ($scope._DSTPlayerPool.indexOf(player) == -1) {
                        $scope._DSTPlayerPool.push(player);
                    } else {
                        $scope._DSTPlayerPool.splice($scope._DSTPlayerPool.indexOf(player), 1);
                    }
                    break;
            }
        }
    }
    $scope.unLockPlayer = function (player) {
        switch (player._Position) {
            case 'QB':
                if ($scope._QBPlayerLocked.indexOf(player) > -1) {
                    $scope._QBPlayerLocked.splice($scope._QBPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'RB':
                if ($scope._RBPlayerLocked.indexOf(player) > -1) {
                    $scope._RBPlayerLocked.splice($scope._RBPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'WR':
                if ($scope._WRPlayerLocked.indexOf(player) > -1) {
                    $scope._WRPlayerLocked.splice($scope._WRPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'TE':
                if ($scope._TEPlayerLocked.indexOf(player) > -1) {
                    $scope._TEPlayerLocked.splice($scope._TEPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'K':
                if ($scope._KPlayerLocked.indexOf(player) > -1) {
                    $scope._KPlayerLocked.splice($scope._KPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'DST':
                if ($scope._DSTPlayerLocked.indexOf(player) > -1) {
                    $scope._DSTPlayerLocked.splice($scope._DSTPlayerLocked.indexOf(player), 1);
                }
                break;
        }
    }
    $scope.removePlayerFromPool = function (player)
    {

        switch (player._Position)
        {
            case 'QB':
                $scope._QBPlayerPool.splice($scope._QBPlayerPool.indexOf(player), 1);
                break;
            case 'RB':
                $scope.unLockPlayer(player);
                $scope._RBPlayerPool.splice($scope._RBPlayerPool.indexOf(player), 1);
                break;
            case 'WR':
                $scope.unLockPlayer(player);
                $scope._WRPlayerPool.splice($scope._WRPlayerPool.indexOf(player), 1);
                break;
            case 'TE':
                $scope._TEPlayerPool.splice($scope._TEPlayerPool.indexOf(player), 1);
                break;
            case 'K':
                $scope._KPlayerPool.splice($scope._KPlayerPool.indexOf(player), 1);
                break;
            case 'DST':
                $scope._DSTPlayerPool.splice($scope._DSTPlayerPool.indexOf(player), 1);
                break;
        }
    }

    $scope.addPlayerToPool = function (player)
    {
        if (!$scope.playerInPool(player))
        {
            switch (player._Position)
            {
                case 'QB':
                    $scope._QBPlayerPool.push(player);
                    break;
                case 'RB':
                    $scope._RBPlayerPool.push(player);
                    break;
                case 'WR':
                    $scope._WRPlayerPool.push(player);
                    break;
                case 'TE':
                    $scope._TEPlayerPool.push(player);
                    break;
                case 'K':
                    $scope._KPlayerPool.push(player);
                    break;
                case 'DST':
                    $scope._DSTPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player)
    {
        switch (player._Position)
        {
            case 'QB':
                if ($scope._QBPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'RB':
                if ($scope._RBPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'WR':
                if ($scope._WRPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'TE':
                if ($scope._TEPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'K':
                if ($scope._KPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'DST':
                if ($scope._DSTPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._QBPlayerPool = [];
        $scope._WRPlayerPool = [];
        $scope._RBPlayerPool = [];
        $scope._TEPlayerPool = [];
        $scope._KPlayerPool = [];
        $scope._DSTPlayerPool = [];

        $scope._QBPlayerLocked = [];
        $scope._WRPlayerLocked = [];
        $scope._RBPlayerLocked = [];
        $scope._TEPlayerLocked = [];
        $scope._KPlayerLocked = [];
        $scope._DSTPlayerLocked = [];
    }

    $scope.averagePlayerPoolSalary = function (playerPool) {
        if (playerPool.length == 0)
            return 0;
        var totalSalaries = 0;
        playerPool.forEach(function (player) {
            totalSalaries = totalSalaries + player._Salary;
        });
        return Math.round(totalSalaries / playerPool.length, 0);
    }

    $scope.clearDrafts = function () {
        $scope._AllDrafts = [];
        $scope._AllDraftData = [];
        $scope.TotalPossibleDrafts = 0;
        $scope.TotalValidDrafts = 0;

        $scope._AllPlayers.forEach(function (player) {
            player._TimesInDrafts = 0;
            player._TimesInValidDrafts = 0;
        });

    }

    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ( $scope._QBPlayerPool.length == 0 || $scope._RBPlayerPool.length == 0 || $scope._WRPlayerPool.length == 0 || $scope._TEPlayerPool.length == 0 || $scope._KPlayerPool.length == 0 || $scope._DSTPlayerPool.length == 0) {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        //QB
        var QBCombinations = [];
        QBCombinations = $scope.getCombinations($scope._QBPlayerPool, 1);
       // console.log("QB Combos: ", QBCombinations);
        //RB
        var RBCombinations = [];
        if ($scope._RBPlayerLocked.length > 0)
        {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._RBPlayerPool.forEach(function (player) {
                if ($scope._RBPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._RBPlayerLocked.length) {
                case 0:
                    RBCombinations = $scope.getCombinations($scope._RBPlayerPool, 2);
                    break;
                case 1:
                    RBCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    RBCombinations = $scope.getCombinations($scope._RBPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 2 RBs");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else
        {
            //no locked players
            RBCombinations = $scope.getCombinations($scope._RBPlayerPool, 2);
           // console.log("RB Combos: ", RBCombinations);
        }

        //WR
        var WRCombinations = [];
        if ($scope._WRPlayerLocked.length > 0)
        {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._WRPlayerPool.forEach(function (player) {
                if ($scope._WRPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch($scope._WRPlayerLocked.length) {
                case 0:
                    WRCombinations = $scope.getCombinations($scope._WRPlayerPool, 3);
                    break;
                case 1:
                    WRCombinations = $scope.getCombinations(unLockedPlayersInPool, 2);
                    break;
                case 2:
                    WRCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 3:
                    WRCombinations = $scope.getCombinations($scope._WRPlayerLocked, 3);//fully locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 3 WR's");
                    return;
                    //console.log("Error: _WRPlayerLocked.length > 3 || null, cannot create combinations");
            }
        }
        else
        {
            //no locked players
            WRCombinations = $scope.getCombinations($scope._WRPlayerPool, 3);
          //  console.log("WR Combos: ", WRCombinations);
        }


        //TE
        var TECombinations = [];
        TECombinations = $scope.getCombinations($scope._TEPlayerPool, 1);
      //  console.log("TE Combos: ", TECombinations);
        //K
        var KCombinations = [];
        KCombinations = $scope.getCombinations($scope._KPlayerPool, 1);
      //  console.log("K Combos: ", KCombinations);
        //DST
        var DSTCombinations = [];
        DSTCombinations = $scope.getCombinations($scope._DSTPlayerPool, 1);
       // console.log("DST Combos: ", DSTCombinations);

        QBCombinations.forEach(function (QB) {
            var tempDraft = [];
            tempDraft.push(QB[0]);
            RBCombinations.forEach(function (RBCombo) {
                tempDraft = $filter('removePosition')(tempDraft, 'RB');
                switch ($scope._RBPlayerLocked.length) {
                    case 0:
                        tempDraft.push(RBCombo[0]);
                        tempDraft.push(RBCombo[1]);
                        break;
                    case 1:
                        tempDraft.push($scope._RBPlayerLocked[0]);
                        tempDraft.push(RBCombo[0]);
                        break;
                    case 2:
                        tempDraft.push($scope._RBPlayerLocked[0]);
                        tempDraft.push($scope._RBPlayerLocked[1]);
                        break;
                }
                WRCombinations.forEach(function (WRCombo) {
                    tempDraft = $filter('removePosition')(tempDraft, 'WR');
                    switch ($scope._WRPlayerLocked.length) {
                        case 0:
                            tempDraft.push(WRCombo[0]);
                            tempDraft.push(WRCombo[1]);
                            tempDraft.push(WRCombo[2]);
                            break;
                        case 1:
                            tempDraft.push($scope._WRPlayerLocked[0]);
                            tempDraft.push(WRCombo[0]);
                            tempDraft.push(WRCombo[1]);
                            break;
                        case 2:
                            tempDraft.push($scope._WRPlayerLocked[0]);
                            tempDraft.push($scope._WRPlayerLocked[1]);
                            tempDraft.push(WRCombo[0]);
                            break;
                        case 3:
                            tempDraft.push($scope._WRPlayerLocked[0]);
                            tempDraft.push($scope._WRPlayerLocked[1]);
                            tempDraft.push($scope._WRPlayerLocked[2]);
                            break;
                    }
                    TECombinations.forEach(function (TE) {
                        tempDraft = $filter('removePosition')(tempDraft, 'TE');
                        tempDraft.push(TE[0]);
                        KCombinations.forEach(function (K) {
                            tempDraft = $filter('removePosition')(tempDraft, 'K');
                            tempDraft.push(K[0]);
                            DSTCombinations.forEach(function (DST) {
                                tempDraft = $filter('removePosition')(tempDraft, 'DST');
                                tempDraft.push(DST[0]);

                                if($scope.isDraftTeamValid(tempDraft) && $scope.isDraftSalaryValid(tempDraft)) {
                                  var tempDataObj = { FPPG: parseFloat($scope.getDraftFPPG(tempDraft)), Actual: parseFloat($scope.getDraftActual(tempDraft)), validTeam: $scope.isDraftTeamValid(tempDraft), validSalary: $scope.isDraftSalaryValid(tempDraft), players: tempDraft, displayDetails: false };
                                  $scope._AllDraftData.push(tempDataObj);
                                  tempDraft.forEach(function (player) {
                                      var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                                      $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
                                      $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
                                  });
                                }
                            });
                        });
                    });
                });
            });
        });

        $http.post('/NFL/buildDraft', {'builtDrafts':$scope._AllDraftData.length}).then(function successCallback(response) {

        }, function errorCallBack(response) {
          if(response.data.error !== undefined) {
            $scope._AllDisplayedDraftData = [];
            $scope._AllDraftData = [];
            $scope.displayNewMessage('danger', 'Build Failed, '+response.data.error);
            return;
          } else {
            $scope.displayNewMessage('danger', 'Loading Single Saves - Failed');
            return;
          }
        });
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope._AllDraftData.length;

        $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);

        //cap GUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
    }

    $scope.removeAllButTopN = function() {
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);
      if($scope._AllDraftData.length > nfl.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nfl.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

          if(j === 0) {
            //reset player %
            for(var k = 0; k < $scope._AllPlayers.length; k++) {
              $scope._AllPlayers[k]._TimesInDrafts = 0;
              $scope._AllPlayers[k]._TimesInValidDrafts = 0;
            }
          }

          $scope._AllDraftData[j].players.forEach(function (player) {
              var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
              $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
              $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
          });
        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
        //add top TopLimit to displayed
        $scope._AllDisplayedDraftData = [];
        for(var i = 0; i < nfl.TopLimit; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      }
    }
    $scope.selectTopActualPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_ActualFantasyPoints', true);
      var allQBs = $filter('position')(orderedPlayers, 'QB');
      var allRBs = $filter('position')(orderedPlayers, 'RB');
      var allWRs = $filter('position')(orderedPlayers, 'WR');
      var allTEs = $filter('position')(orderedPlayers, 'TE');
      var allKs = $filter('position')(orderedPlayers, 'K');
      var allDSTs = $filter('position')(orderedPlayers, 'DST');

      for(var j = 0; j < 11; j++) {
        if(allQBs.length >= j && j < 4) {
          $scope.addPlayerToPool(allQBs[j]);
        }
        if(allRBs.length >= j && j < 7) {
          $scope.addPlayerToPool(allRBs[j]);
        }
        if(allWRs.length >= j) {
          $scope.addPlayerToPool(allWRs[j]);
        }
        if(allTEs.length >= j && j < 4) {
          $scope.addPlayerToPool(allTEs[j]);
        }
        if(allKs.length >= j && j < 4) {
          $scope.addPlayerToPool(allKs[j]);
        }
        if(allDSTs.length >= j && j < 4) {
          $scope.addPlayerToPool(allDSTs[j]);
        }
      }

    }
    $scope.selectTopFPPGPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var NonInjuredPlayers =  $filter('removeInjured')(orderedPlayers);
      var allQBs = $filter('position')(NonInjuredPlayers, 'QB');
      var allRBs = $filter('position')(NonInjuredPlayers, 'RB');
      var allWRs = $filter('position')(NonInjuredPlayers, 'WR');
      var allTEs = $filter('position')(NonInjuredPlayers, 'TE');
      var allKs = $filter('position')(NonInjuredPlayers, 'K');
      var allDSTs = $filter('position')(NonInjuredPlayers, 'DST');

      for(var j = 0; j < 11; j++) {
        if(allQBs.length >= j && j < 4) {
          $scope.addPlayerToPool(allQBs[j]);
        }
        if(allRBs.length >= j && j < 7) {
          $scope.addPlayerToPool(allRBs[j]);
        }
        if(allWRs.length >= j) {
          $scope.addPlayerToPool(allWRs[j]);
        }
        if(allTEs.length >= j && j < 4) {
          $scope.addPlayerToPool(allTEs[j]);
        }
        if(allKs.length >= j && j < 4) {
          $scope.addPlayerToPool(allKs[j]);
        }
        if(allDSTs.length >= j && j < 4) {
          $scope.addPlayerToPool(allDSTs[j]);
        }
      }
    }
    $scope.setDraftSortTypeAndReverse = function (sortType) {
        $scope.sortTypeDraft = sortType;
        $scope.sortReverseDraft = !$scope.sortReverseDraft;

        $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, $scope.sortReverseDraft);
        //cap GUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }
    }
    $scope.switchValidDraftSelector = function () {
        $scope.SelectedValidDrafts = !$scope.SelectedValidDrafts;
    }

    $scope.setPlayerPercentInDraft = function (player) {
        if ($scope.SelectedValidDrafts) {
            player._PercentInDrafts = ((player._TimesInValidDrafts / $scope.TotalValidDrafts) * 100 ).toFixed(0);
        } else {
            player._PercentInDrafts = ((player._TimesInDrafts / $scope.TotalPossibleDrafts) * 100 ).toFixed(0);
        }
    }

    $scope.getDraftFPPG = function (draft) {
        var totalFPPG = 0;
        draft.forEach(function (player) {
            totalFPPG = totalFPPG + player._FPPG;
        });
        totalFPPG = parseFloat(totalFPPG);
        return totalFPPG.toFixed(2);
    }
    $scope.getDraftActual = function (draft) {
        var totalActual = 0;
        draft.forEach(function (player) {
            totalActual = totalActual + player._ActualFantasyPoints;
        });
        totalActual = parseFloat(totalActual);
        return totalActual.toFixed(2);
    }

    $scope.openCloseDraftDetails = function (draftInput) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/modalDraft.html',
            controller: 'DraftModalController',
            size:'lg',
            resolve: {
                draft: function () {
                    return draftInput;
                }
            }
        });
    }
    $scope.openClosePlayerDetails = function (player) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/modalPlayer.html',
            controller: 'PlayerModalController',
            size: 'lg',
            resolve: {
                allPlayers: function () {
                    return $scope._AllPlayersMASTER;
                },
                selectedPlayer: function () {
                    return player;
                }
            }
        });
    }


    $scope.removeCalcDrafts = function () {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, nfl.TopRange, nfl.BottomRange, $scope.sortTypeDraft);

        $scope._AllDraftData = calcRemovedDrafts;

        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        var validDraftData = $filter('checkValidOnly')($scope._AllDraftData, true);
        $scope.TotalValidDrafts = validDraftData.length;

        $scope._AllPlayers.forEach(function (player) {
            player._TimesInDrafts = 0;
            player._TimesInValidDrafts = 0;
        });
        validDraftData.forEach(function (draftData) {
            draftData.players.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
            });
        });

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });

        //cap gUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }

    }

    $scope.isDraftSalaryValid = function (draft) {
        var startingSalary = 60000;
        draft.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return (startingSalary >= 0) ? true : false;
    }
    $scope.isDraftTeamValid = function (draft) {
        var teams = {};
        draft.forEach(function (player) {
            if (!teams.hasOwnProperty(player._Team))
            {
                teams[player._Team] = 1;
            }
            else
            {
                teams[player._Team] = teams[player._Team] + 1;
            }
        });

        for (team in teams) {
            var value = teams[team];
            if(value > 4) {
                return false;
            }
        }
        return true;
    }
    $scope.getCombinations = function(players, min) {
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < players.length; i++) {
            fn(i, players, [], all);
        }
        all.push(players);

        for (var j = 0; j < all.length; j++) {
            if(all[j].length > min) {
                all.splice(j);
            }
        }
        return all;
    }

    $scope.buildStacks = function () {


        $scope.SelectedTeams.forEach(function (team) {
            var tempStack = [];
            $scope.SelectedStackPositions.forEach(function (stackPosition) {

                var stackSubstringPosition = stackPosition.substring(0, 2);

                var tempPlayers = [];
                tempPlayers = $filter('position')($scope._AllPlayers, stackSubstringPosition);
                tempPlayers = $filter('team')(tempPlayers, team);
                tempPlayers = $filter('weeks')(tempPlayers, $scope.SelectedWeeks);
                tempPlayers = $filter('sort')(tempPlayers);
                if (tempStack.indexOf(tempPlayers[0]) == -1) {
                    switch (stackPosition) {
                        case 'QB':
                        case 'RB':
                        case 'WR':
                        case 'TE':
                        case 'K':
                        case 'DST':
                            tempStack.push(tempPlayers[0]);
                            return;
                        case 'RB1':
                            tempStack.push(tempPlayers[1]);
                            return;
                        case 'WR1':
                            tempStack.push(tempPlayers[1]);
                            return;
                        case 'WR2':
                            tempStack.push(tempPlayers[2]);
                            return;
                    }
                }

            });

            $scope._AllStacks.push(tempStack);
        });
    }
    $scope.addRemovePositionToSelectedStacks = function (position) {
        var positionIndex = $scope.SelectedStackPositions.indexOf(position);
        if (positionIndex == -1) {
            $scope.SelectedStackPositions.push(position);
        } else {
            $scope.SelectedStackPositions.splice(positionIndex, 1);
        }

    }
    $scope.clearAllStacks = function () {
        $scope._AllStacks = [];
    }
    $scope.clearStackPositions = function () {
        $scope.SelectedStackPositions = [];
    }
    $scope.clearAllPlayerFilters = function () {
        $scope.SelectedTeams = [];
        $scope.SelectedWeeks = [];
        $scope.SelectedWeeks.push($scope._AllWeeks[0]);
    }

    //#################################################################
    //################################################################# - DATABASE
    //#################################################################

    $scope.setDeleteConfirmation = function(id) {
      $scope.DeleteConfirmationID = id;
    }

    $scope.unsetDeleteConfirmation = function() {
      $scope.DeleteConfirmationID = -1;
    }

    $scope.showDeleteConfirmation = function(id) {
      return ($scope.DeleteConfirmationID == id);
    }
    $scope.read = function(saveDetailsID) {

      $http.post('/NFL/read', {'id':saveDetailsID}).then(function successCallback(response) {
          $scope.currentRead = response.data;
          $scope.loadPlayersFromSave(JSON.parse($scope.currentRead['userSaveJSON']));
          $scope.mainTabHeading = "Players - "+$scope.currentRead['title'];
      }, function errorCallBack(response) {
        $scope.displayNewMessage('danger', 'Loading Single Save - Failed');
      });

    }
    $scope.updateTitle = function(saveID, title) {
      $http.post('/NFL/updateTitle', {'id':saveID, 'title': title}).then(function successCallback(response) {
        $scope.displayNewMessage('success', 'Title Update - Success, Saved: '+title);
      }, function errorCallBack(response) {
        $scope.displayNewMessage('danger', 'Title Update - Failed, '+response.data.title);
      });
    }
    $scope.delete = function(saveID) {
      $http.post('/NFL/delete', {'id':saveID}).then(function successCallback(response) {
        var indexToDelete = -1;
        for(var j = 0; j < $scope.savedPastSettings.length;j++) {
          if($scope.savedPastSettings[j].id == saveID) {
            indexToDelete = j;
            break;
          }
        }
        $scope.savedPastSettings.splice(indexToDelete, 1);
        $scope.displayNewMessage('success', 'Deleting #'+saveID+' - Success');
      }, function errorCallBack(response) {
        $scope.displayNewMessage('danger', 'Deleting - Failed');
      });

    }
    $scope.loadHistory = function() {
      $http.post('/NFL/loadHistory', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        $scope.displayNewMessage('danger', 'Loading More Saves - Failed, '+response.data.error);
      });
    }
    $scope.loadSavedSettingsDetails = function() {
      $http.post('/NFL/loadSavedSettingsDetails', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        console.log("errror");
      });
    }
    $scope.loadSavedSettings = function(saveDetailsID) {

      $http.post('/NFL/loadSavedSettings', {'id':saveDetailsID}).then(function successCallback(response) {
          var jsonData = JSON.parse(response.data['userSaveJSON']);

          $scope.loadPlayersFromSave(jsonData);

      }, function errorCallBack(response) {
        console.log("errror");
      });

    }
    $scope.loadPlayersFromSave = function(savedData) {

      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();


      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;
      nfl.TopRange = parseFloat(savedData.TopRange);
      nfl.BottomRange = parseFloat(savedData.BottomRange);
      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._QBPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._RBPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._WRPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._TEPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._KPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._DSTPlayerPool, singlePlayer);

        $scope.loadPlayerInLocked(savedData._RBPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._WRPlayerLocked, singlePlayer);
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }
    $scope.loadPlayerInPool = function(playerPool, singlePlayer) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.addPlayerToPool(singlePlayer);
        }
      });
    }
    $scope.loadPlayerInLocked = function(playerPool, singlePlayer) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.lockAndUnLockPlayer(singlePlayer);
        }
      });
    }
    $scope.openSaveDialog = function () {
        $scope.savedPastSettings = [];

        var postObject = {
    				_AllPlayers : $scope._AllPlayers,
    				_RBPlayerLocked : $scope._RBPlayerLocked,
            _WRPlayerLocked : $scope._WRPlayerLocked,
            _QBPlayerPool : $scope._QBPlayerPool,
            _RBPlayerPool : $scope._RBPlayerPool,
            _WRPlayerPool : $scope._WRPlayerPool,
            _TEPlayerPool : $scope._TEPlayerPool,
            _KPlayerPool : $scope._KPlayerPool,
            _DSTPlayerPool : $scope._DSTPlayerPool,
            TopRange : nfl.TopRange,
            BottomRange : nfl.BottomRange
    		};
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/saveDialog.html',
            controller: 'SaveModalController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                postObject: function () {
                    return postObject;
                },
                currentRead: function() {
                  return $scope.currentRead;
                }
            }
        });
        modalInstance.result.then(function (saveResult) {
          $scope.currentRead = saveResult['readData'];
          $scope.loadPlayersFromSave(saveResult['postObject']);
          $scope.mainTabHeading = "Players - "+saveResult['title'];
        }, function () {

        });
    }
}]);
