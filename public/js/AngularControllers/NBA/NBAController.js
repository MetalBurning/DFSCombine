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

    $scope._PG1PlayerPool = [];
    $scope._PG2PlayerPool = [];
    $scope._SG1PlayerPool = [];
    $scope._SG2PlayerPool = [];
    $scope._SF1PlayerPool = [];
    $scope._SF2PlayerPool = [];
    $scope._PF1PlayerPool = [];
    $scope._PF2PlayerPool = [];
    $scope._CPlayerPool = [];

    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = true;
    $scope.sortTypeDraft = 'FPPG';

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = true;
    $scope.SelectedPosition = 'PG1';     // set the default search/filter term
    $scope.SelectedTeam = 'All';
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

    nba.removeDups = true;

    //database
    $scope.savedPastSettings = [];
    $scope.currentRead = null;

    //$scope._AllPlayers = positionFilter($scope._AllPlayers, $scope.SelectedPosition);

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeam);
    $scope._AllPlayers = $filter('position')($scope._AllPlayers, $scope.SelectedPosition);
    //$http.post("/api/NFL/getAllWeeks").then(function successCallback(response) {
    //    $scope._AllWeeks = [];//clear out
    //    response.data.forEach(function (element) {
    //        $scope._AllWeeks.push(element);
    //    });
    //    console.log("weeks: ", $scope._AllWeeks);
    //}, function errorCallBack(response) {

    //});

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

    $scope.loadProjectionsAsActual = function(event) {
      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            for(var i = 0; i < allTextLines.length; i++) {
              var headers = allTextLines[i].split(',');
              var playerPosition = "";
              var playerFName = "";
              var playerLName = "";
              var playerPoints = 0;
              var playerSalary = 0;
              var playerTeam = "";
              var playerOpp = "";
              for (var j = 0; j < headers.length; j++) {
                  switch (j) {
                    case 0:
                        var name = headers[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                        var splitName = name.split(' ');
                        playerFName = splitName[0];
                        if(splitName.length == 2) {
                            playerLName = splitName[1];
                        } else {
                            playerLName = splitName[2];
                        }
                        break;
                    case 1:
                        playerSalary = parseInt(headers[j].replace('"', '').replace('"', '').replace('$', '').trim());
                        break;
                    case 2:
                      playerTeam = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 3:
                      playerPosition = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 4:
                      playerOpp = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 7:
                      playerPoints = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                      break;
                  }
              }
              $scope._AllPlayers.forEach(function (player) {
                  if((player._Name.includes(playerFName) && player._Name.includes(playerLName)) && player._Position == playerPosition) {
                      player._ActualFantasyPoints = playerPoints;
                  }
              });
            }
        }

        $scope.$apply(function() {
          $scope.displayNewMessage("success", "Player projections loaded as actual Success");
        });

        reader.readAsText(file);
    }

    $scope.loadActual = function (event) {


      var file = event.target.files[0];

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
                    if($scope._Positions.indexOf(player._Postion) === -1) {
                      $scope._Positions.push(player._Position);
                    }
                });
            }
            $scope._Positions.sort();
            $scope.$apply(function() {

              $scope.displayNewMessage("success", "Player Actual Results have been successfully loaded");

            });

        }
        reader.readAsText(file);
    }



    $scope.loadPlayers = function (event) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.clearAllPlayerFilters();
      $scope.currentRead = null;
      $scope.mainTabHeading = "Players";

      var formData = new FormData();
      formData.append('csvFile', event.target.files[0]);

      $http.post("/NBA/loadFanDuelPlayers", formData, {
          headers: {
              "Content-Type": undefined,
              transformRequest: angular.identity
          }
      }).then(function successCallBack(response) {
          response.data.forEach(function(player) {
            player._Salary = parseFloat(player._Salary);
            player._FPPG = parseFloat(player._FPPG);
            player._FPPG = player._FPPG.toFixed(2);
            player._FPPG = parseFloat(player._FPPG);
            var pointsPerDollar = parseFloat((player._FPPG / player._Salary).toFixed(5));
            player._ProjectedPointsPerDollar = pointsPerDollar;
            if (player._playerInjured == 'O') {
              player._playerInjured = 'danger';
            } else if(player._playerInjured == 'GTD') {
              player._playerInjured = 'warning';
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

    $scope.selectTopActualPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_ActualFantasyPoints', true);
      var allPGs = $filter('position')(orderedPlayers, 'PG');
      var allSGs = $filter('position')(orderedPlayers, 'SG');
      var allSFs = $filter('position')(orderedPlayers, 'SF');
      var allPFs = $filter('position')(orderedPlayers, 'PF');
      var allCs = $filter('position')(orderedPlayers, 'C');

      var PGTeams = [];

      for(var j = 0; j < 5; j++) {
        if(j < 3) {
          $scope.addPlayerToPool(allPGs[j], 'PG1');
          $scope.addPlayerToPool(allSGs[j], 'SG1');
          $scope.addPlayerToPool(allSFs[j], 'SF1');
          $scope.addPlayerToPool(allPFs[j], 'PF1');
          $scope.addPlayerToPool(allCs[j], 'C');
        }
        if(j > 0) {
          $scope.addPlayerToPool(allPGs[j], 'PG2');
          $scope.addPlayerToPool(allSGs[j], 'SG2');
          $scope.addPlayerToPool(allSFs[j], 'SF2');
          $scope.addPlayerToPool(allPFs[j], 'PF2');
        }
      }

    }

    $scope.teamRemovalFormularHelpers = function(PGPlayersToAdd, PGPlayersToLock) {
      var PGTeams = [];
      var PGPlayersToAddAfterTeamRemoval = [];

      if(PGPlayersToLock.length != 0) {
        PGTeams.push(PGPlayersToLock[0]._Team);
        PGPlayersToAddAfterTeamRemoval.push(PGPlayersToLock[0]);
      }

      PGPlayersToAdd.forEach(function(PG) {
        if(PGTeams.indexOf(PG._Team) != -1) {
          //find other player with same team
          //compare salaries, and add the highest One
          var indexOfAddedTeam = PGTeams.indexOf(PG._Team);
          var existingPlayerSameTeam = PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam];
          if(existingPlayerSameTeam._Salary < PG._Salary) {
            //replace
            PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam] = PG;
          } else if(existingPlayerSameTeam._Salary === PG._Salary) {
            if(existingPlayerSameTeam._FPPG < PG._FPPG) {
              PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam] = PG;
            }
          } else {
            //do nothing, allready have best player (highest salary)
          }
        } else if( PGTeams.indexOf(PG._Team) == -1) {
          PGTeams.push(PG._Team);
          PGPlayersToAddAfterTeamRemoval.push(PG);
        }
      });
      return PGPlayersToAddAfterTeamRemoval;
    }

    $scope.setAndUnsetPosition = function(position) {
      if($scope.SelectedPosition === position) {
          //do nothing, cant unset position
      } else {
          $scope.SelectedPosition = position;
      }
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
      var allPGs = $filter('position')(NonInjuredPlayers, 'PG');
      var allSGs = $filter('position')(NonInjuredPlayers, 'SG');
      var allSFs = $filter('position')(NonInjuredPlayers, 'SF');
      var allPFs = $filter('position')(NonInjuredPlayers, 'PF');
      var allCs = $filter('position')(NonInjuredPlayers, 'C');

      for(var j = 0; j < allPGs.length; j++) {
        if(j == 0 || j == 1 ) {
          $scope.addPlayerToPool(allPGs[j], 'PG1');
        }
        if(j == 1 ||j == 2 || j == 3) {
          $scope.addPlayerToPool(allPGs[j], 'PG2');
        }
      }
      for(var j = 0; j < allSGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allSGs[j], 'SG1');
        }
        if( j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allSGs[j], 'SG2');
        }
      }

      for(var j = 0; j < allSFs.length; j++) {
        if( j == 0 || j == 1) {
          $scope.addPlayerToPool(allSFs[j], 'SF1');
        }
        if( j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allSFs[j], 'SF2');
        }
      }

      for(var j = 0; j < allPFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allPFs[j], 'PF1');
        }
        if(j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allPFs[j], 'PF2');
        }
      }
      $scope.addPlayerToPool(allCs[0], 'C');
      $scope.addPlayerToPool(allCs[1], 'C');
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
    $scope.addRemoveTeam = function (team) {
        if ($scope.SelectedTeam === team) {
            $scope.SelectedTeam = 'All';
        } else {
            $scope.SelectedTeam = team;
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

        csvContent = csvContent + "PG,PG,SG,SG,SF,SF,PF,PF,C\n";
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

        $http.post('/NBA/downloadDrafts', {'downloadDrafts':drafts.length}).then(function successCallback(response) {

        }, function errorCallBack(response) {
          if(response.data.error !== undefined) {
            $scope.displayNewMessage('danger', 'Download Drafts - Failed, '+response.data.error);
            return;
          } else {
            $scope.displayNewMessage('danger', 'Download Drafts - Failed');
            return;
          }
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

    }
    $scope.removePlayerFromPool = function (player, position)
    {
      if($scope.playerInPool(player, position))
      {
        switch (position)
        {
            case 'PG1':
                $scope._PG1PlayerPool.splice($scope._PG1PlayerPool.indexOf(player), 1);
                break;
            case 'PG2':
                $scope._PG2PlayerPool.splice($scope._PG2PlayerPool.indexOf(player), 1);
                break;
            case 'SG1':
                $scope._SG1PlayerPool.splice($scope._SG1PlayerPool.indexOf(player), 1);
                break;
            case 'SG2':
                $scope._SG2PlayerPool.splice($scope._SG2PlayerPool.indexOf(player), 1);
                break;
            case 'SF1':
                $scope._SF1PlayerPool.splice($scope._SF1PlayerPool.indexOf(player), 1);
                break;
            case 'SF2':
                $scope._SF2PlayerPool.splice($scope._SF2PlayerPool.indexOf(player), 1);
                break;
            case 'PF1':
                $scope._PF1PlayerPool.splice($scope._PF1PlayerPool.indexOf(player), 1);
                break;
            case 'PF2':
                $scope._PF2PlayerPool.splice($scope._PF2PlayerPool.indexOf(player), 1);
                break;
            case 'C':
                $scope._CPlayerPool.splice($scope._CPlayerPool.indexOf(player), 1);
                break;
        }
      }

    }

    $scope.addPlayerToPool = function (player, position)
    {
      if($scope.SelectedPosition === '') {
        $scope.displayNewMessage('danger', 'Please select a position');
      }
        if (!$scope.playerInPool(player, position))
        {
            switch (position)
            {
                case 'PG1':
                    $scope._PG1PlayerPool.push(player);
                    break;
                case 'PG2':
                    $scope._PG2PlayerPool.push(player);
                    break;
                case 'SG1':
                    $scope._SG1PlayerPool.push(player);
                    break;
                case 'SG2':
                    $scope._SG2PlayerPool.push(player);
                    break;
                case 'SF1':
                    $scope._SF1PlayerPool.push(player);
                    break;
                case 'SF2':
                    $scope._SF2PlayerPool.push(player);
                    break;
                case 'PF1':
                    $scope._PF1PlayerPool.push(player);
                    break;
                case 'PF2':
                    $scope._PF2PlayerPool.push(player);
                    break;
                case 'C':
                    $scope._CPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player, position)
    {
        switch (position)
        {
            case 'PG1':
                if ($scope._PG1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'PG2':
                if ($scope._PG2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SG1':
                if ($scope._SG1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SG2':
                if ($scope._SG2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SF1':
                if ($scope._SF1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SF2':
                if ($scope._SF2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'PF1':
                if ($scope._PF1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'PF2':
                if ($scope._PF2PlayerPool.indexOf(player) > -1)
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
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._PG1PlayerPool = [];
        $scope._PG2PlayerPool = [];
        $scope._SG1PlayerPool = [];
        $scope._SG2PlayerPool = [];
        $scope._SF1PlayerPool = [];
        $scope._SF2PlayerPool = [];
        $scope._PF1PlayerPool = [];
        $scope._PF2PlayerPool = [];
        $scope._CPlayerPool = [];

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

        $scope._AllDraftData.splice(indexOfDraftToRemove, 1);

        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
    }

    $scope.removeAllButTopN = function() {
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);
      if($scope._AllDraftData.length > nba.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nba.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
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
    }

    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ($scope._PG1PlayerPool.length == 0 ||
            $scope._PG2PlayerPool.length == 0 ||
            $scope._SG1PlayerPool.length == 0 ||
            $scope._SG2PlayerPool.length == 0 ||
            $scope._SF1PlayerPool.length == 0 ||
            $scope._SF2PlayerPool.length == 0 ||
            $scope._PF1PlayerPool.length == 0 ||
            $scope._PF2PlayerPool.length == 0 ||
            $scope._CPlayerPool.length == 0 )
        {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        var totalPossibleDraftsToBeCreated = $scope._PG1PlayerPool.length * $scope._PG2PlayerPool.length *
        $scope._SG1PlayerPool.length * $scope._SG2PlayerPool.length *
        $scope._SF1PlayerPool.length * $scope._SF2PlayerPool.length *
        $scope._PF1PlayerPool.length * $scope._PF2PlayerPool.length *
        $scope._CPlayerPool.length;

        if(totalPossibleDraftsToBeCreated > 15000) {
          $window.alert('Creating more than 10,000 drafts can take longer than expected');
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        var tempDrafts = [];
        var tempPlayerNamesList = [];
        //start draft building
        $scope._PG1PlayerPool.forEach(function(PG1Player) {
            var tempDraft = {};
            tempDraft['PG1'] = PG1Player;
            $scope._PG2PlayerPool.forEach(function(PG2Player) {
              tempDraft['PG2'] = PG2Player;
              $scope._SG1PlayerPool.forEach(function(SG1Player) {
                tempDraft['SG1'] = SG1Player;
                $scope._SG2PlayerPool.forEach(function(SG2Player) {
                  tempDraft['SG2'] = SG2Player;
                  $scope._SF1PlayerPool.forEach(function(SF1Player) {
                    tempDraft['SF1'] = SF1Player;
                    $scope._SF2PlayerPool.forEach(function(SF2Player) {
                      tempDraft['SF2'] = SF2Player;
                      $scope._PF1PlayerPool.forEach(function(PF1Player) {
                        tempDraft['PF1'] = PF1Player;
                        $scope._PF2PlayerPool.forEach(function(PF2Player) {
                          tempDraft['PF2'] = PF2Player;
                          $scope._CPlayerPool.forEach(function(CPlayer) {
                            tempDraft['C'] = CPlayer;
                            var finalPlayerList = [];
                            finalPlayerList.push(tempDraft['PG1']);
                            finalPlayerList.push(tempDraft['PG2']);
                            finalPlayerList.push(tempDraft['SG1']);
                            finalPlayerList.push(tempDraft['SG2']);
                            finalPlayerList.push(tempDraft['SF1']);
                            finalPlayerList.push(tempDraft['SF2']);
                            finalPlayerList.push(tempDraft['PF1']);
                            finalPlayerList.push(tempDraft['PF2']);
                            finalPlayerList.push(tempDraft['C']);
                            //player name list
                            var tempPlayerNames = {};
                            tempPlayerNames['PG'] = [];
                            tempPlayerNames['SG'] = [];
                            tempPlayerNames['SF'] = [];
                            tempPlayerNames['PF'] = [];
                            tempPlayerNames['C'] = [];
                            finalPlayerList.forEach(function(player) {
                              tempPlayerNames[player._Position].push(player);
                            });

                            //add only valid drafts
                            if($scope.isDraftTeamValid(finalPlayerList) && $scope.isDraftSalaryValid(finalPlayerList) && !$scope.doesDraftHaveDupPlayers(finalPlayerList)) {
                              //$scope._AllDrafts.push(tempDraft);
                              var tempDataObj = { FPPG: parseFloat($scope.getDraftFPPG(finalPlayerList)),
                                 Actual: parseFloat($scope.getDraftActual(finalPlayerList)),
                                 validTeam: $scope.isDraftTeamValid(finalPlayerList),
                                 validSalary: $scope.isDraftSalaryValid(finalPlayerList),
                                 players: finalPlayerList,
                                 playerNames: tempPlayerNames,
                                 playersPositionData: angular.copy(tempDraft),
                                 displayDetails: false
                               };
                               if(nba.removeDups)
                               {
                                 var sameDraft = false;
                                 if(tempPlayerNamesList.length > 0) {
                                   for(var j = tempPlayerNamesList.length-1; j >= 0; j--) {
                                     var playersInDraft = 0;
                                     if(tempPlayerNames['PG'].indexOf(tempPlayerNamesList[j]['PG'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['PG'].indexOf(tempPlayerNamesList[j]['PG'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['SG'].indexOf(tempPlayerNamesList[j]['SG'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['SG'].indexOf(tempPlayerNamesList[j]['SG'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['SF'].indexOf(tempPlayerNamesList[j]['SF'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['SF'].indexOf(tempPlayerNamesList[j]['SF'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['PF'].indexOf(tempPlayerNamesList[j]['PF'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['PF'].indexOf(tempPlayerNamesList[j]['PF'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['C'].indexOf(tempPlayerNamesList[j]['C'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(playersInDraft === 9) {
                                       //same draft, dont add tempDraft
                                       sameDraft = true;
                                       break;
                                     }
                                   }
                                   if(!sameDraft) {
                                     $scope._AllDraftData.push(tempDataObj);//store valid only
                                     tempPlayerNamesList.push(tempPlayerNames);
                                   }
                                 } else {
                                    $scope._AllDraftData.push(tempDataObj);//store valid only
                                    tempPlayerNamesList.push(tempPlayerNames);
                                 }
                               }
                               else
                               {
                                  $scope._AllDraftData.push(tempDataObj);//store valid only
                                  tempPlayerNamesList.push(tempPlayerNames);
                               }
                              //$scope._AllDraftData.push(tempDataObj);//store valid only
                            }
                          });
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
            $scope.displayNewMessage('danger', 'Loading Single Saves - Failed '+response.data);
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

    $scope.getPlayerPercentInPosition = function(player, position) {
      if($scope.TotalValidDrafts > 0) {
        var playerTimesInDrafts = 0;
        $scope._AllDraftData.forEach(function(draft) {
          if(draft.playersPositionData[position]._Name === player._Name) {
            playerTimesInDrafts++;
          }
        });
        return ((playerTimesInDrafts / $scope.TotalValidDrafts) * 100 ).toFixed(0);
      }
      return 0;
    }

    $scope.topRuleBased = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedFPPGPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var NonInjuredPlayers =  $filter('removeInjured')(orderedFPPGPlayers);
      var allPGs = $filter('position')(NonInjuredPlayers, 'PG');
      var allSGs = $filter('position')(NonInjuredPlayers, 'SG');
      var allSFs = $filter('position')(NonInjuredPlayers, 'SF');
      var allPFs = $filter('position')(NonInjuredPlayers, 'PF');
      var allCs = $filter('position')(NonInjuredPlayers, 'C');

      var orderedValuePlayers =  $filter('orderBy')($scope._AllPlayers, '_ProjectedPointsPerDollar', true);
      var NonValueInjuredPlayers =  $filter('removeInjured')(orderedValuePlayers);
      var allValuePGs = $filter('position')(NonValueInjuredPlayers, 'PG');
      var allValueSGs = $filter('position')(NonValueInjuredPlayers, 'SG');
      var allValueSFs = $filter('position')(NonValueInjuredPlayers, 'SF');
      var allValuePFs = $filter('position')(NonValueInjuredPlayers, 'PF');
      var allValueCs = $filter('position')(NonValueInjuredPlayers, 'C');

      //PGs
      if(allPGs[0]._FPPG > (allPGs[1]._FPPG  + 10)) {
        $scope.addPlayerToPool(allPGs[0], 'PG1');
        if(allPGs[1]._FPPG > 30) {
            $scope.addPlayerToPool(allPGs[1], 'PG1');
        }
        for(var j = 0; j < allPGs.length; j++) {
          if(j == 1 || j == 2 || j == 3 || j == 4) {
            $scope.addPlayerToPool(allPGs[j], 'PG2');
          }
        }
      } else {
        for(var j = 0; j < allPGs.length; j++) {
          if(j == 0 || j == 1) {
            $scope.addPlayerToPool(allPGs[j], 'PG1');
          }
          if(j == 1 || j == 2 || j == 3 || j == 4) {
            $scope.addPlayerToPool(allPGs[j], 'PG2');
          }
        }
      }

      //SGs
      if(allSGs[0]._FPPG > (allSGs[1]._FPPG  + 10)) {
        $scope.addPlayerToPool(allSGs[0], 'SG1');
        if(allSGs[1]._FPPG > 30) {
            $scope.addPlayerToPool(allSGs[1], 'SG1');
        }
        for(var j = 0; j < allSGs.length; j++) {
          if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5) {
            $scope.addPlayerToPool(allSGs[j], 'SG2');
          }
        }
      } else {
        for(var j = 0; j < allSGs.length; j++) {
          if(j == 0 || j == 1) {
            $scope.addPlayerToPool(allSGs[j], 'SG1');
          }
          if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5) {
            $scope.addPlayerToPool(allSGs[j], 'SG2');
          }
        }
      }
      //SF
      if(allSFs[0]._FPPG > (allSFs[1]._FPPG  + 10)) {
        $scope.addPlayerToPool(allSFs[0], 'SF1');
        if(allSFs[1]._FPPG > 30) {
            $scope.addPlayerToPool(allSFs[1], 'SF1');
        }
        for(var j = 0; j < allSFs.length; j++) {
          if(j == 1 || j == 2 || j == 3 || j == 4) {
            $scope.addPlayerToPool(allSFs[j], 'SF2');
          }
        }
      } else {
        for(var j = 0; j < allSFs.length; j++) {
          if( j == 0 || j == 1 ) {
            $scope.addPlayerToPool(allSFs[j], 'SF1');
          }
          if( j == 1 || j == 2 || j == 3 || j == 4) {
            $scope.addPlayerToPool(allSFs[j], 'SF2');
          }
        }
      }

      //PF
      if(allPFs[0]._FPPG > (allPFs[1]._FPPG  + 10)) {
        $scope.addPlayerToPool(allPFs[0], 'PF1');
        if(allPFs[1]._FPPG > 30) {
            $scope.addPlayerToPool(allPFs[1], 'PF1');
        }
        for(var j = 0; j < allPFs.length; j++) {
          if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5) {
            $scope.addPlayerToPool(allPFs[j], 'PF2');
          }
        }
      } else {
        for(var j = 0; j < allPFs.length; j++) {
          if( j == 0 || j == 1) {
            $scope.addPlayerToPool(allPFs[j], 'PF1');
          }
          if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5) {
            $scope.addPlayerToPool(allPFs[j], 'PF2');
          }
        }
      }
      if(allCs[0]._FPPG > (allCs[1]._FPPG  + 10)) {
        $scope.addPlayerToPool(allCs[0], 'C');
      } else {
        $scope.addPlayerToPool(allCs[0], 'C');
        $scope.addPlayerToPool(allCs[1], 'C');
      }

    }


    $scope.removeCalcDrafts = function () {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(nba.TopRange), parseFloat(nba.BottomRange), $scope.sortTypeDraft);

        $scope._AllDraftData = calcRemovedDrafts;

        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        var validDraftData = $filter('checkValidOnly')($scope._AllDraftData, true);
        $scope.TotalValidDrafts = validDraftData.length;


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
                    return $scope._AllPlayers;
                },
                selectedPlayer: function () {
                    return player;
                }
            }
        });
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

    $scope.clearAllPlayerFilters = function () {
        $scope.SelectedTeam = 'All';
        $scope.SelectedWeeks = [];
    }

    //#################################################################
    //################################################################# - DATABASE
    //#################################################################

    $scope.openSaveDialog = function () {
        $scope.savedPastSettings = [];

        var postObject = {
            _AllPlayers : $scope._AllPlayers,
            _PG1PlayerPool : $scope._PG1PlayerPool,
            _PG2PlayerPool : $scope._PG2PlayerPool,
            _SG1PlayerPool : $scope._SG1PlayerPool,
            _SG2PlayerPool : $scope._SG2PlayerPool,
            _SF1PlayerPool : $scope._SF1PlayerPool,
            _SF2PlayerPool : $scope._SF2PlayerPool,
            _PF1PlayerPool : $scope._PF1PlayerPool,
            _PF2PlayerPool : $scope._PF2PlayerPool,
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
    $scope.loadPlayerInPool = function(playerPool, singlePlayer, position) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.addPlayerToPool(singlePlayer, position);
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
      nba.TopLimit = parseInt(savedData.TopLimit);

      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._PG1PlayerPool, singlePlayer, 'PG1');
        $scope.loadPlayerInPool(savedData._PG2PlayerPool, singlePlayer, 'PG2');
        $scope.loadPlayerInPool(savedData._SG1PlayerPool, singlePlayer, 'SG1');
        $scope.loadPlayerInPool(savedData._SG2PlayerPool, singlePlayer, 'SG2');
        $scope.loadPlayerInPool(savedData._SF1PlayerPool, singlePlayer, 'SF1');
        $scope.loadPlayerInPool(savedData._SF2PlayerPool, singlePlayer, 'SF2');
        $scope.loadPlayerInPool(savedData._PF1PlayerPool, singlePlayer, 'PF1');
        $scope.loadPlayerInPool(savedData._PF2PlayerPool, singlePlayer, 'PF2');
        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer, 'C');
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
