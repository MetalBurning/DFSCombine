angular.module('NBAApp').controller('NBAController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nba = this;

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

    $scope._PGPlayerPool = [];
    $scope._SGPlayerPool = [];
    $scope._SFPlayerPool = [];
    $scope._PFPlayerPool = [];
    $scope._CPlayerPool = [];
    $scope._GPlayerPool = [];
    $scope._FPlayerPool = [];
    $scope._UTILPlayerPool = [];

    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = true;
    $scope.sortTypeDraft = 'FPPG';

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = true;
    $scope.SelectedPosition = 'PG';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;



    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);
    $scope.TopRange = -1;
    $scope.BottomRange = -1;

    nba.ERRORRATE = 0.00157;
    nba.TopLimit = 150;
    nba.TopRange = -1;
    nba.BottomRange = -1;


    //database
    $scope.savedPastSettings = [];
    $scope.currentRead = null;

    //$scope._AllPlayers = positionFilter($scope._AllPlayers, $scope.SelectedPosition);

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeams);
    $scope._AllPlayers = $filter('positionDK')($scope._AllPlayers, $scope.SelectedPosition);


    $scope.mainTabHeading = "Players";
    $scope.DeleteConfirmationID = -1;

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

    $scope.loadDKPlayers = function (event) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.clearAllPlayerFilters();
      $scope.currentRead = null;
      $scope.mainTabHeading = "Players";

      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');


            for (var i = 8; i < allTextLines.length - 1; i++) {
                var data = allTextLines[i].split(',');

                var playerID = "";
                var playerPosition = "";
                var playerFName = "";
                var playerLName = "";
                var playerTeam = "";
                var playerOpponent = "";
                var playerFPPG = 0;
                var playerSalary = 0;
                var playerInjury = false;
                var playerInjuryDetails = "";
                var playerGame = "";
                for (var j = 9; j < data.length; j++) {
                    switch (j) {
                        case 12:
                            playerID = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 9:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 11:
                            var playerName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            var splitName = playerName.split(' ');
                            playerFName = splitName[0].trim();
                            playerLName = splitName[1].trim();
                            break;
                        case 13:
                            playerSalary = parseInt(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 15:
                            playerTeam = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 14:
                            var gameInfo = data[j].replace('"', '').replace('"', '').trim().split(' ');
                            playerGame = gameInfo[0].trim();
                            break;
                        case 11:
                            if (data[j].replace('"', '').replace('"', '').trim().length > 0) {
                                playerInjury = data[j].replace('"', '').replace('"', '').trim();
                                if (playerInjury == 'O') {
                                    playerInjury = 'danger';
                                } else if(playerInjury = 'GTD') {
                                    playerInjury = 'warning';
                                }
                            }
                            break;
                        case 12:
                            playerInjuryDetails = data[j].replace('"', '').replace('"', '').trim();
                            break;
                    }
                }
                var tempGameData = playerGame.split('@');
                if(tempGameData[0].trim() === playerTeam) {
                  playerOpponent = tempGameData[1].trim();
                } else {
                  playerOpponent = tempGameData[0].trim();
                }
                var pointsPerDollar = parseFloat(0);
                var playerRead = { playerID: playerID, _Position: playerPosition, _Name: playerFName + " " + playerLName, _FPPG: playerFPPG, _ActualFantasyPoints: -1, _Team: playerTeam, _Opponent: playerOpponent, _Salary: playerSalary, _ProjectedPointsPerDollar: pointsPerDollar, _playerInjured: playerInjury, _playerInjuryDetails: playerInjuryDetails, _Game: playerGame, _PercentInDrafts: -1, _TimesInDrafts: 0, _TimesInValidDrafts: 0 };
                $scope._AllPlayers.push(playerRead);
                $scope._AllPlayersMASTER.push(playerRead);

                if($scope._Positions.indexOf(playerPosition) === -1) {
                  $scope._Positions.push(playerPosition);
                }

                //add team data
                if ($scope._AllTeams.length == 0) {
                    $scope._AllTeams.push(playerRead._Team);
                } else if ($scope._AllTeams.indexOf(playerRead._Team) == -1) {
                    $scope._AllTeams.push(playerRead._Team);
                }

            }
            if($scope._AllPlayers.length > 0) {
              $scope.$apply(function() {
                $scope.displayNewMessage("success", "Players have been successfully loaded");
              });
            } else {
              $scope.$apply(function() {
                $scope.displayNewMessage("danger", "Error: Players could not be loaded.");
              });
            }
        }
        reader.readAsText(file);
        $scope._Positions.sort();
    }

    $scope.selectTopActualPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_ActualFantasyPoints', true);
      var allPGs = $filter('positionDK')(orderedPlayers, 'PG');
      var allSGs = $filter('positionDK')(orderedPlayers, 'SG');
      var allSFs = $filter('positionDK')(orderedPlayers, 'SF');
      var allPFs = $filter('positionDK')(orderedPlayers, 'PF');
      var allPFs = $filter('positionDK')(orderedPlayers, 'PF');
      var allCs = $filter('positionDK')(orderedPlayers, 'C');

      var PGTeams = [];

      for(var j = 0; j < 5; j++) {
        if(allPGs.length >= j) {
          $scope.addPlayerToPool(allPGs[j]);
        }
        if(allSGs.length >= j) {
          $scope.addPlayerToPool(allSGs[j]);
        }
        if(allSFs.length >= j) {
          $scope.addPlayerToPool(allSFs[j]);
        }
        if(allPFs.length >= j) {
          $scope.addPlayerToPool(allPFs[j]);
        }
        if(allCs.length >= j && j < 3) {
          $scope.addPlayerToPool(allCs[j]);
        }
      }

    }

    $scope.setAndUnsetPosition = function(position) {
      $scope.SelectedPosition = position;
    }

    $scope.updatePlayerPtsPerDollar = function(player) {
      var indexOfPlayer = $scope._AllPlayers.indexOf(player);
      if(indexOfPlayer !== -1) {
        $scope._AllPlayers[indexOfPlayer]._ProjectedPointsPerDollar = parseFloat(player._FPPG / player._Salary).toFixed(5);
        player._ProjectedPointsPerDollar = parseFloat(player._FPPG / player._Salary).toFixed(5);
      }
    }

    $scope.selectTopFPPGPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var NonInjuredPlayers =  $filter('removeInjured')(orderedPlayers);
      var allPGs = $filter('positionDK')(NonInjuredPlayers, 'PG');
      var allSGs = $filter('positionDK')(NonInjuredPlayers, 'SG');
      var allSFs = $filter('positionDK')(NonInjuredPlayers, 'SF');
      var allPFs = $filter('positionDK')(NonInjuredPlayers, 'PF');
      var allCs = $filter('positionDK')(NonInjuredPlayers, 'C');

      //version 1
      for(var j = 0; j < allPGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allPGs[j]);
        }
      }
      //$scope.lockAndUnLockPlayer(allPGs[0]);

      for(var j = 0; j < allSGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3 ) {
          $scope.addPlayerToPool(allSGs[j]);
        }
      }

      for(var j = 0; j < allSFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allSFs[j]);
        }
      }


      for(var j = 0; j < allPFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3 ) {
          $scope.addPlayerToPool(allPFs[j]);
        }
      }

      $scope.addPlayerToPool(allCs[0]);
      $scope.addPlayerToPool(allCs[1]);
      $scope.addPlayerToPool(allCs[2]);
    }
    $scope.parseFloat = function(value)
    {
       return parseFloat(value);
    }
    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
      $scope._AllTeams = [];
      $scope._Positions = [];
    }

    $scope.changeLineups = function (files) {
        var formData = new FormData();
        for (var j = 0; j < files.length; j++) {
            formData.append(files[j].name, files[j]);
        }

        $http.post("/api/NBA/changeLineups", formData, {
            headers: {
                "Content-Type": undefined,
                transformRequest: angular.identity
            }
        }).then(function successCallBack(response) {
            console.log(response);
        }, function errorCallBack(response) {
            console.log(response);
        });
    }

    $scope.getPointsPerDollar = function (player) {
        var returnData = 0;
        returnData = player._FPPG / player._Salary;
        returnData = returnData.toFixed(5);
        returnData = parseFloat(returnData);
        return returnData;
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

    $scope.setDraftSortTypeAndReverse = function (sortType) {
        $scope.sortTypeDraft = sortType;
        $scope.sortReverseDraft = !$scope.sortReverseDraft;

        $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, $scope.sortReverseDraft);
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

    $scope.DownloadDraftCSV = function () {
        if ($scope._AllDraftData.length == 0) {
            $scope.displayNewMessage("danger", "Error: Cannot downloaded drafts when none have been generated");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,";
        var drafts = $scope._AllDraftData;

        drafts = $filter('checkValidOnly')(drafts, true);
        drafts = $filter('orderBy')(drafts, $scope.sortTypeDraft, $scope.sortReverseDraft);

        csvContent = csvContent + "PG,SG,SF,PF,C,G,F,UTIL\n";
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

        var CSVName = "";
        $scope._AllTeams.forEach(function (team) {
          if(CSVName.length == 0) {
            CSVName = team;
          } else {
            CSVName = CSVName + "_" + team;
          }
        });
        anchor.attr({
            href: encodeURI(csvContent),
            target: '_blank',
            download: CSVName+'.csv'
        })[0].click();

        anchor.remove(); // Clean it up afterwards


        //window.open(encodedUri);
    }

    $scope.removePlayerFromPool = function (player, position)
    {
        switch (position)
        {
            case 'PG':
                $scope._PGPlayerPool.splice($scope._PGPlayerPool.indexOf(player), 1);
                break;
            case 'SG':
                $scope._SGPlayerPool.splice($scope._SGPlayerPool.indexOf(player), 1);
                break;
            case 'SF':
                $scope._SFPlayerPool.splice($scope._SFPlayerPool.indexOf(player), 1);
                break;
            case 'PF':
                $scope._PFPlayerPool.splice($scope._PFPlayerPool.indexOf(player), 1);
                break;
            case 'C':
                $scope._CPlayerPool.splice($scope._CPlayerPool.indexOf(player), 1);
                break;
            case 'G':
                $scope._GPlayerPool.splice($scope._GPlayerPool.indexOf(player), 1);
                break;
            case 'F':
                $scope._FPlayerPool.splice($scope._FPlayerPool.indexOf(player), 1);
                break;
            case 'UTIL':
                $scope._UTILPlayerPool.splice($scope._UTILPlayerPool.indexOf(player), 1);
                break;
        }
    }

    $scope.addPlayerToPool = function (player, position)
    {
        if (!$scope.playerInPool(player, position))
        {
            switch (position)
            {
                case 'PG':
                    $scope._PGPlayerPool.push(player);
                    break;
                case 'SG':
                    $scope._SGPlayerPool.push(player);
                    break;
                case 'SF':
                    $scope._SFPlayerPool.push(player);
                    break;
                case 'PF':
                    $scope._PFPlayerPool.push(player);
                    break;
                case 'C':
                    $scope._CPlayerPool.push(player);
                    break;
                case 'G':
                    $scope._GPlayerPool.push(player);
                    break;
                case 'F':
                    $scope._FPlayerPool.push(player);
                    break;
                case 'UTIL':
                    $scope._UTILPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player, position)
    {
        switch (position)
        {
            case 'PG':
                if ($scope._PGPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SG':
                if ($scope._SGPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SF':
                if ($scope._SFPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'PF':
                if ($scope._PFPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'C':
                if ($scope._CPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'G':
                if ($scope._GPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'F':
                if ($scope._FPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'UTIL':
                if ($scope._UTILPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._PGPlayerPool = [];
        $scope._SGPlayerPool = [];
        $scope._SFPlayerPool = [];
        $scope._PFPlayerPool = [];
        $scope._CPlayerPool = [];
        $scope._GPlayerPool = [];
        $scope._FPlayerPool = [];
        $scope._UTILPlayerPool = [];
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

    $scope.removeDraft = function (draft) {
        $scope._AllDisplayedDraftData.splice($scope._AllDisplayedDraftData.indexOf(draft), 1);

        var indexOfDraftToRemove = $scope._AllDraftData.indexOf(draft);
        $scope._AllDraftData[indexOfDraftToRemove].players.forEach(function (player) {
            var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
            $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts -= 1;
            $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts -= 1;
        });
        $scope._AllDraftData.splice(indexOfDraftToRemove, 1);

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
    }

    $scope.removeAllButTopN = function() {
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);
      if($scope._AllDraftData.length > nba.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nba.TopLimit; j++) {
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
        for(var i = 0; i < nba.TopLimit; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      }
    }

    $scope.clearDrafts = function () {
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
        if ( $scope._PGPlayerPool.length == 0 || $scope._SGPlayerPool.length == 0 || $scope._SFPlayerPool.length == 0 || $scope._PFPlayerPool.length == 0 || $scope._CPlayerPool.length == 0 || $scope._GPlayerPool.length == 0 || $scope._FPlayerPool.length == 0 || $scope._UTILPlayerPool.length == 0) {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        //PG
        var PGCombinations = [];
        PGCombinations = $scope.getCombinations($scope._PGPlayerPool, 1);
        // console.log("RB Combos: ", RBCombinations);


        //SG
        var SGCombinations = [];
        SGCombinations = $scope.getCombinations($scope._SGPlayerPool, 1);


        //SF
        var SFCombinations = [];
        SFCombinations = $scope.getCombinations($scope._SFPlayerPool, 1);

        //PF
        var PFCombinations = [];
        PFCombinations = $scope.getCombinations($scope._PFPlayerPool, 1);

        //C
        var CCombinations = [];
        CCombinations = $scope.getCombinations($scope._CPlayerPool, 1);

        //G
        var GCombinations = [];
        GCombinations = $scope.getCombinations($scope._GPlayerPool, 1);

        //C
        var FCombinations = [];
        FCombinations = $scope.getCombinations($scope._FPlayerPool, 1);

        //C
        var UTILCombinations = [];
        UTILCombinations = $scope.getCombinations($scope._UTILPlayerPool, 1);
        //start draft building
        PGCombinations.forEach(function (PGCombo) {
            var tempDraft = {};
            tempDraft['PG'] = PGCombo[0];

            //SG
            SGCombinations.forEach(function (SGCombo) {
                tempDraft['SG'] = SGCombo[0];
                //SF
                SFCombinations.forEach(function (SFCombo) {
                    tempDraft['SF'] = SFCombo[0];
                    //PF
                    PFCombinations.forEach(function (PFCombo) {
                        tempDraft['PF'] = PFCombo[0];
                        //C
                        CCombinations.forEach(function (C) {
                            tempDraft['C'] = C[0];

                            GCombinations.forEach(function(GCombo) {
                              tempDraft['G'] = GCombo[0];
                              FCombinations.forEach(function(FCombo) {
                                tempDraft['F'] = FCombo[0];
                                UTILCombinations.forEach(function(UtilCombo) {
                                  tempDraft['UTIL'] = UtilCombo[0];
                                  var finalPlayerList = [];
                                  finalPlayerList.push(tempDraft['PG']);
                                  finalPlayerList.push(tempDraft['SG']);
                                  finalPlayerList.push(tempDraft['SF']);
                                  finalPlayerList.push(tempDraft['PF']);
                                  finalPlayerList.push(tempDraft['C']);
                                  finalPlayerList.push(tempDraft['G']);
                                  finalPlayerList.push(tempDraft['F']);
                                  finalPlayerList.push(tempDraft['UTIL']);
                                  //add only valid drafts
                                  if($scope.isDraftTeamValid(finalPlayerList) && $scope.isDraftSalaryValid(finalPlayerList) && !$scope.doesDraftHaveDupPlayers(finalPlayerList)) {
                                    //$scope._AllDrafts.push(tempDraft);
                                    var tempDataObj = { FPPG: parseFloat($scope.getDraftFPPG(finalPlayerList)), Actual: parseFloat($scope.getDraftActual(finalPlayerList)), validTeam: $scope.isDraftTeamValid(finalPlayerList), validSalary: $scope.isDraftSalaryValid(finalPlayerList), players: finalPlayerList, displayDetails: false };
                                    $scope._AllDraftData.push(tempDataObj);//store valid only
                                    finalPlayerList.forEach(function (player) {
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
            });
        });

        $http.post('/NBA/buildDraft', {'builtDrafts':$scope._AllDraftData.length}).then(function successCallback(response) {

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
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;

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

    // $scope.switchValidDraftSelector = function () {
    //     $scope.SelectedValidDrafts = !$scope.SelectedValidDrafts;
    //     $scope.buildDrafts();
    // }

    $scope.setPlayerPercentInDraft = function (player) {
        if ($scope.SelectedValidDrafts) {
            player._PercentInDrafts = ((player._TimesInValidDrafts / $scope.TotalValidDrafts) * 100 ).toFixed(0);
        } else {
            player._PercentInDrafts = ((player._TimesInDrafts / $scope.TotalPossibleDrafts) * 100 ).toFixed(0);
        }
    }

    $scope.removeCalcDrafts = function () {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(nba.TopRange), parseFloat(nba.BottomRange), $scope.sortTypeDraft);

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
    $scope.getDraftSalaryRemaining = function (draft) {
        var startingSalary = 60000;
        draft.players.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return startingSalary;
    }
    $scope.keepThisDraftSalary = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {
      var errorRateToUse = 1300;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('positionDK')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('positionDK')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('positionDK')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('positionDK')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('positionDK')(orderedDraftPlayers, 'C');

      var PG1Value = PGPlayers[0]._Salary;
      var PG2Value = PGPlayers[1]._Salary;

      var SG1Value = SGPlayers[0]._Salary;
      var SG2Value = SGPlayers[1]._Salary;

      var SF1Value = SFPlayers[0]._Salary;
      var SF2Value = SFPlayers[1]._Salary;

      var PF1Value = PFPlayers[0]._Salary;
      var PF2Value = PFPlayers[1]._Salary;

      var CValue = CPlayers[0]._Salary;

      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff > errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
    }
    $scope.keepThisDraftFPPG = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {
      var errorRateToUse = 5;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('position')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('position')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('position')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('position')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('position')(orderedDraftPlayers, 'C');

      var PG1Value = PGPlayers[0]._FPPG;
      var PG2Value = PGPlayers[1]._FPPG;

      var SG1Value = SGPlayers[0]._FPPG;
      var SG2Value = SGPlayers[1]._FPPG;

      var SF1Value = SFPlayers[0]._FPPG;
      var SF2Value = SFPlayers[1]._FPPG;

      var PF1Value = PFPlayers[0]._FPPG;
      var PF2Value = PFPlayers[1]._FPPG;

      var CValue = CPlayers[0]._FPPG;

      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff > errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
    }
    $scope.keepThisDraft = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {


      var errorRateToUse = 0;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('position')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('position')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('position')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('position')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('position')(orderedDraftPlayers, 'C');

      var PG1Value = AllPGPlayers.indexOf(PGPlayers[0]) + 1;
      var PG2Value = AllPGPlayers.indexOf(PGPlayers[1]) + 1;

      var SG1Value = AllSGPlayers.indexOf(SGPlayers[0]) + 1;
      var SG2Value = AllSGPlayers.indexOf(SGPlayers[1]) + 1;

      var SF1Value = AllSFPlayers.indexOf(SFPlayers[0]) + 1;
      var SF2Value = AllSFPlayers.indexOf(SFPlayers[1]) + 1;

      var PF1Value = AllPFPlayers.indexOf(PFPlayers[0]) + 1;
      var PF2Value = AllPFPlayers.indexOf(PFPlayers[1]) + 1;

      var CValue = AllCPlayers.indexOf(CPlayers[0]) + 1;



      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff != errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
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



    $scope.doesDraftHaveDupPlayers = function(draft) {
      var players = [];
      var hasDups = false;
      draft.forEach(function (player) {
          if(players.indexOf(player._Name) > -1) {
            hasDups = true;
          } else {
            players.push(player._Name);
          }
      });
      return hasDups;
    }

    $scope.isDraftSalaryValid = function (draft) {
        var startingSalary = 50000;
        draft.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return (startingSalary >= 0) ? true : false;
    }
    $scope.isDraftTeamValid = function (draft) {
        var teams = [];
        draft.forEach(function (player) {
            if(teams.indexOf(player._Team) === -1) {
              teams.push(player._Team);
            }
        });
        if(teams.length < 2) {
          return false;
        }
        var games = [];
        draft.forEach(function (player) {
            if(games.indexOf(player._Game) === -1) {
              games.push(player._Game);
            }
        });
        if(games.length < 2) {
          return false;
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
    $scope.clearAllPlayerFilters = function () {
        $scope.SelectedTeams = [];
        $scope.SelectedWeeks = [];
    }

    //#################################################################
    //################################################################# - DATABASE
    //#################################################################

    $scope.openSaveDialog = function () {
        $scope.savedPastSettings = [];

        var postObject = {
            _AllPlayers : $scope._AllPlayers,
            _PGPlayerLocked : $scope._PGPlayerLocked,
            _SGPlayerLocked : $scope._SGPlayerLocked,
            _SFPlayerLocked : $scope._SFPlayerLocked,
            _PFPlayerLocked : $scope._PFPlayerLocked,
            _CPlayerLocked : $scope._CPlayerLocked,
            _PGPlayerPool : $scope._PGPlayerPool,
            _SGPlayerPool : $scope._SGPlayerPool,
            _SFPlayerPool : $scope._SFPlayerPool,
            _PFPlayerPool : $scope._PFPlayerPool,
            _CPlayerPool : $scope._CPlayerPool,
            TopRange : nba.TopRange,
            BottomRange : nba.BottomRange,
            TopLimit : nba.TopLimit
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

    $scope.read = function(saveDetailsID) {

      $http.post('/NBA/read', {'id':saveDetailsID}).then(function successCallback(response) {
          $scope.currentRead = response.data;
          $scope.loadPlayersFromSave(JSON.parse($scope.currentRead['userSaveJSON']));
          $scope.mainTabHeading = "Players - "+$scope.currentRead['title'];
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Loading Single Saves - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Loading Single Saves - Failed');
        }
      });

    }

    $scope.loadHistory = function() {
      $http.post('/NBA/loadHistory', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Loading More Saves - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Loading More Saves - Failed');
        }

      });
    }

    $scope.setDeleteConfirmation = function(id) {
      $scope.DeleteConfirmationID = id;
    }

    $scope.unsetDeleteConfirmation = function() {
      $scope.DeleteConfirmationID = -1;
    }

    $scope.showDeleteConfirmation = function(id) {
      return ($scope.DeleteConfirmationID == id);
    }

    $scope.delete = function(saveID) {
      $http.post('/NBA/delete', {'id':saveID}).then(function successCallback(response) {
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
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Deleting - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Deleting - Failed');
        }
      });

    }
    $scope.updateTitle = function(saveID, title) {
      $http.post('/NBA/updateTitle', {'id':saveID, 'title': title}).then(function successCallback(response) {
        $scope.displayNewMessage('success', 'Title Update - Success, Saved: '+title);
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Title Update - Failed,'+response.data.error);
        } else if(response.data.title !== undefined) {
          $scope.displayNewMessage('danger', 'Title Update - Failed, '+response.data.title);
        } else {
          $scope.displayNewMessage('danger', 'Title Update - Failed');
        }
      });
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
    $scope.loadPlayersFromSave = function(savedData) {

      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.clearAllPlayerFilters();

      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;
      nba.TopRange = parseFloat(savedData.TopRange);
      nba.BottomRange = parseFloat(savedData.BottomRange);
      if(savedData.TopLimit != undefined) {
        nba.TopLimit = parseInt(savedData.TopLimit);
      }
      $scope._AllPlayers.forEach(function(singlePlayer) {

        if($scope._Positions.indexOf(singlePlayer._Position) === -1) {
          $scope._Positions.push(singlePlayer._Position);
        }

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._PGPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._SGPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._SFPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._PFPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer);

        $scope.loadPlayerInLocked(savedData._PGPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._SGPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._SFPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._PFPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._CPlayerLocked, singlePlayer);
      });
      $scope._Positions.sort();
      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
