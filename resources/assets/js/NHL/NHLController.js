angular.module('NHLApp').controller('NHLController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nhl = this;

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

    $scope._C1PlayerPool = [];
    $scope._C2PlayerPool = [];
    $scope._W1PlayerPool = [];
    $scope._W2PlayerPool = [];
    $scope._W3PlayerPool = [];
    $scope._W4PlayerPool = [];
    $scope._D1PlayerPool = [];
    $scope._D2PlayerPool = [];
    $scope._GPlayerPool = [];

    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = true;
    $scope.sortTypeDraft = 'FPPG';

    $scope.sortType = '_Salary'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = true;
    $scope.SelectedPosition = 'C1';     // set the default search/filter term
    $scope.SelectedTeam = 'All';
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;

    $scope.totalPossibleDraftsToBeCreated = 0;
    $scope.totalPossibleCurrentDraftsCount = 0;
    $scope.tempDrafts = [];
    $scope.tempPlayerNamesList = [];

    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);
    $scope.TopRange = -1;
    $scope.BottomRange = -1;

    nhl.TopLimit = 150;
    nhl.TopRange = -1;
    nhl.BottomRange = -1;
    nhl.removeDups = true;

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

      $http.post("/NHL/loadFanDuelPlayers", formData, {
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
            if (player._playerInjured == 'O' || player._playerInjured === 'IR') {
              player._playerInjured = 'danger';
            } else if(player._playerInjured == 'DTD') {
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
      var allCs = $filter('position')(orderedPlayers, 'C');
      var allWs = $filter('position')(orderedPlayers, 'W');
      var allDs = $filter('position')(orderedPlayers, 'D');
      var allGs = $filter('position')(orderedPlayers, 'G');

      for(var j = 0; j < 5; j++) {
        if(j < 3) {
          $scope.addPlayerToPool(allCs[j], 'C1');
          $scope.addPlayerToPool(allWs[j], 'W1');
          $scope.addPlayerToPool(allDs[j], 'D1');
          $scope.addPlayerToPool(allGs[j], 'G');
        }
        if(j > 0) {
          $scope.addPlayerToPool(allCs[j], 'C2');
          $scope.addPlayerToPool(allWs[j], 'W2');
          $scope.addPlayerToPool(allWs[j], 'W3');
          $scope.addPlayerToPool(allWs[j], 'W4');
          $scope.addPlayerToPool(allDs[j], 'D2');
          $scope.addPlayerToPool(allGs[j], 'G');
        }
      }

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
      var allCs = $filter('position')(NonInjuredPlayers, 'C');
      var allWs = $filter('position')(NonInjuredPlayers, 'W');
      var allDs = $filter('position')(NonInjuredPlayers, 'D');
      var allGs = $filter('position')(NonInjuredPlayers, 'G');

      for(var j = 0; j < allCs.length; j++) {
        if(j == 0 || j == 1 ) {
          $scope.addPlayerToPool(allCs[j], 'C1');
        }
        if(j == 1 ||j == 2 || j == 3) {
          $scope.addPlayerToPool(allCs[j], 'C2');
        }
      }
      for(var j = 0; j < allWs.length; j++) {
        if(j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allWs[j], 'W1');
        }
        if(j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allWs[j], 'W2');
        }
        if(j == 2 || j == 3 || j == 4 || j == 5) {
          $scope.addPlayerToPool(allWs[j], 'W3');
        }
        if( j == 3 || j == 4 || j == 5 || j == 6) {
          $scope.addPlayerToPool(allWs[j], 'W4');
        }
      }

      for(var j = 0; j < allDs.length; j++) {
        if( j == 0 || j == 1) {
          $scope.addPlayerToPool(allDs[j], 'D1');
        }
        if( j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allDs[j], 'D2');
        }
      }

      for(var j = 0; j < allGs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allGs[j], 'G');
        }
      }
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

        $http.post("/api/NHL/changeLineups", formData, {
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

        csvContent = csvContent + "C,C,W,W,W,W,D,D,G\n";
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

        $http.post('/NHL/downloadDrafts', {'downloadDrafts':drafts.length}).then(function successCallback(response) {

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
            case 'C1':
                $scope._C1PlayerPool.splice($scope._C1PlayerPool.indexOf(player), 1);
                break;
            case 'C2':
                $scope._C2PlayerPool.splice($scope._C2PlayerPool.indexOf(player), 1);
                break;
            case 'W1':
                $scope._W1PlayerPool.splice($scope._W1PlayerPool.indexOf(player), 1);
                break;
            case 'W2':
                $scope._W2PlayerPool.splice($scope._W2PlayerPool.indexOf(player), 1);
                break;
            case 'W3':
                $scope._W3PlayerPool.splice($scope._W3PlayerPool.indexOf(player), 1);
                break;
            case 'W4':
                $scope._W4PlayerPool.splice($scope._W4PlayerPool.indexOf(player), 1);
                break;
            case 'D1':
                $scope._D1PlayerPool.splice($scope._D1PlayerPool.indexOf(player), 1);
                break;
            case 'D2':
                $scope._D2PlayerPool.splice($scope._D2PlayerPool.indexOf(player), 1);
                break;
            case 'G':
                $scope._GPlayerPool.splice($scope._GPlayerPool.indexOf(player), 1);
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
                case 'C1':
                    $scope._C1PlayerPool.push(player);
                    break;
                case 'C2':
                    $scope._C2PlayerPool.push(player);
                    break;
                case 'W1':
                    $scope._W1PlayerPool.push(player);
                    break;
                case 'W2':
                    $scope._W2PlayerPool.push(player);
                    break;
                case 'W3':
                    $scope._W3PlayerPool.push(player);
                    break;
                case 'W4':
                    $scope._W4PlayerPool.push(player);
                    break;
                case 'D1':
                    $scope._D1PlayerPool.push(player);
                    break;
                case 'D2':
                    $scope._D2PlayerPool.push(player);
                    break;
                case 'G':
                    $scope._GPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player, position)
    {
        switch (position)
        {
            case 'C1':
                if ($scope._C1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'C2':
                if ($scope._C2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'W1':
                if ($scope._W1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'W2':
                if ($scope._W2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'W3':
                if ($scope._W3PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'W4':
                if ($scope._W4PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'D1':
                if ($scope._D1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'D2':
                if ($scope._D2PlayerPool.indexOf(player) > -1)
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
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._C1PlayerPool = [];
        $scope._C2PlayerPool = [];
        $scope._W1PlayerPool = [];
        $scope._W2PlayerPool = [];
        $scope._W3PlayerPool = [];
        $scope._W4PlayerPool = [];
        $scope._D1PlayerPool = [];
        $scope._D2PlayerPool = [];
        $scope._GPlayerPool = [];

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
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, $scope.sortReverseDraft);
      if($scope._AllDraftData.length > nhl.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nhl.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
        //add top TopLimit to displayed
        $scope._AllDisplayedDraftData = [];
        for(var i = 0; i < nhl.TopLimit; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      }
    }
    $scope.clearDrafts = function () {
        $scope._AllDraftData = [];
        $scope.TotalPossibleDrafts = 0;
        $scope.TotalValidDrafts = 0;
    }

    $scope.setPlayerRanking = function() {
      var orderedFPPGPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var injuredPlayers =  $filter('removeInjured')(orderedFPPGPlayers);
      var allCs = $filter('position')(injuredPlayers, 'C');
      var allWs = $filter('position')(injuredPlayers, 'W');
      var allDs = $filter('position')(injuredPlayers, 'D');
      var allGs = $filter('position')(injuredPlayers, 'G');
      var outPlayers =  $filter('removeOut')(orderedFPPGPlayers);
      var allInjCs = $filter('position')(outPlayers, 'C');
      var allInjWs = $filter('position')(outPlayers, 'W');
      var allInjDs = $filter('position')(outPlayers, 'D');
      var allInjGs = $filter('position')(outPlayers, 'G');
      $scope._AllPlayers.forEach(function(player) {
        var playerRank = 99;
        if(!player._playerInjured) {
          switch(player._Position) {
            case 'C':
              playerRank = allCs.indexOf(player) + 1;
              break;
            case 'W':
              playerRank = allWs.indexOf(player) + 1;
              break;
            case 'D':
              playerRank = allDs.indexOf(player) + 1;
              break;
            case 'G':
              playerRank = allGs.indexOf(player) + 1;
              break;
          }
        } else {
          switch(player._Position) {
            case 'C':
              playerRank = allInjCs.indexOf(player) + 1;
              break;
            case 'W':
              playerRank = allInjWs.indexOf(player) + 1;
              break;
            case 'D':
              playerRank = allInjDs.indexOf(player) + 1;
              break;
            case 'G':
              playerRank = allInjGs.indexOf(player) + 1;
              break;
          }
        }
        player._Rank = playerRank;
      });
    }
    $scope.averageRank = function(finalPlayerList) {
      var average = 0;
      finalPlayerList.forEach(function(player) {
        average = average + player._Rank;
      });
      average = parseFloat(average / finalPlayerList.length);
      return (average).toFixed(2);
    }
    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ($scope._C1PlayerPool.length == 0 ||
            $scope._C2PlayerPool.length == 0 ||
            $scope._W1PlayerPool.length == 0 ||
            $scope._W2PlayerPool.length == 0 ||
            $scope._W3PlayerPool.length == 0 ||
            $scope._W4PlayerPool.length == 0 ||
            $scope._D1PlayerPool.length == 0 ||
            $scope._D2PlayerPool.length == 0 ||
            $scope._GPlayerPool.length == 0 )
        {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        $scope.setPlayerRanking();

        $scope.totalPossibleDraftsToBeCreated = $scope._C1PlayerPool.length * $scope._C2PlayerPool.length *
        $scope._W1PlayerPool.length * $scope._W2PlayerPool.length *
        $scope._W3PlayerPool.length * $scope._W4PlayerPool.length *
        $scope._D1PlayerPool.length * $scope._D2PlayerPool.length *
        $scope._GPlayerPool.length;

        if($scope.totalPossibleDraftsToBeCreated > 15000) {
          if (!confirm('Creating '+$scope.totalPossibleDraftsToBeCreated+' possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?')) {
            return;
          }
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        var tempDrafts = [];
        var tempPlayerNamesList = [];
        //start draft building
        $scope._C1PlayerPool.forEach(function(C1Player) {
            var tempDraft = {};
            tempDraft['C1'] = C1Player;
            $scope._C2PlayerPool.forEach(function(C2Player) {
              tempDraft['C2'] = C2Player;
              $scope._W1PlayerPool.forEach(function(W1Player) {
                tempDraft['W1'] = W1Player;
                $scope._W2PlayerPool.forEach(function(W2Player) {
                  tempDraft['W2'] = W2Player;
                  $scope._W3PlayerPool.forEach(function(W3Player) {
                    tempDraft['W3'] = W3Player;
                    $scope._W4PlayerPool.forEach(function(W4Player) {
                      tempDraft['W4'] = W4Player;
                      $scope._D1PlayerPool.forEach(function(D1Player) {
                        tempDraft['D1'] = D1Player;
                        $scope._D2PlayerPool.forEach(function(D2Player) {
                          tempDraft['D2'] = D2Player;
                          $scope._GPlayerPool.forEach(function(GPlayer) {

                            $scope.totalPossibleCurrentDraftsCount++;

                            tempDraft['G'] = GPlayer;
                            var finalPlayerList = [];
                            finalPlayerList.push(tempDraft['C1']);
                            finalPlayerList.push(tempDraft['C2']);
                            finalPlayerList.push(tempDraft['W1']);
                            finalPlayerList.push(tempDraft['W2']);
                            finalPlayerList.push(tempDraft['W3']);
                            finalPlayerList.push(tempDraft['W4']);
                            finalPlayerList.push(tempDraft['D1']);
                            finalPlayerList.push(tempDraft['D2']);
                            finalPlayerList.push(tempDraft['G']);
                            //player name list
                            var tempPlayerNames = {};
                            tempPlayerNames['C'] = [];
                            tempPlayerNames['W'] = [];
                            tempPlayerNames['D'] = [];
                            tempPlayerNames['G'] = [];
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
                                 salaryLeft: parseInt($scope.getDraftSalaryLeft(finalPlayerList)),
                                 players: finalPlayerList,
                                 playerNames: tempPlayerNames,
                                 playersPositionData: angular.copy(tempDraft),
                                 displayDetails: false,
                                 pointsPerDollar:  parseFloat($scope.averageValue(finalPlayerList)),
                                 averageRank: parseFloat($scope.averageRank(finalPlayerList))
                               };
                               if(nhl.removeDups)
                               {
                                 var sameDraft = false;
                                 if(tempPlayerNamesList.length > 0) {
                                   for(var j = tempPlayerNamesList.length-1; j >= 0; j--) {
                                     var playersInDraft = 0;
                                     if(tempPlayerNames['C'].indexOf(tempPlayerNamesList[j]['C'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['C'].indexOf(tempPlayerNamesList[j]['C'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['W'].indexOf(tempPlayerNamesList[j]['W'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['W'].indexOf(tempPlayerNamesList[j]['W'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['W'].indexOf(tempPlayerNamesList[j]['W'][2]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['W'].indexOf(tempPlayerNamesList[j]['W'][3]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['D'].indexOf(tempPlayerNamesList[j]['D'][0]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['D'].indexOf(tempPlayerNamesList[j]['D'][1]) !== -1) {
                                       playersInDraft++;
                                     }
                                     if(tempPlayerNames['G'].indexOf(tempPlayerNamesList[j]['G'][0]) !== -1) {
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

        $http.post('/NHL/buildDraft', {'builtDrafts':$scope._AllDraftData.length}).then(function successCallback(response) {

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
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 55000;
        draft.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        startingSalary = parseInt(startingSalary);
        return startingSalary;
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

    $scope.removeCalcDrafts = function () {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(nhl.TopRange), parseFloat(nhl.BottomRange), $scope.sortTypeDraft);

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
        var startingSalary = 55000;
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
        var startingSalary = 55000;
        draft.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return (startingSalary >= 0) ? true : false;
    }

    $scope.averageValue = function(draft) {
      var value = 0;
      draft.forEach(function (player) {
          value = parseFloat(value) + parseFloat(player._ProjectedPointsPerDollar);
      });
      value = parseFloat(value);
      return (value / (draft.length)).toFixed(5);
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
            _C1PlayerPool : $scope._C1PlayerPool,
            _C2PlayerPool : $scope._C2PlayerPool,
            _W1PlayerPool : $scope._W1PlayerPool,
            _W2PlayerPool : $scope._W2PlayerPool,
            _W3PlayerPool : $scope._W3PlayerPool,
            _W4PlayerPool : $scope._W4PlayerPool,
            _D1PlayerPool : $scope._D1PlayerPool,
            _D2PlayerPool : $scope._D2PlayerPool,
            _GPlayerPool : $scope._GPlayerPool,
            TopRange : nhl.TopRange,
            BottomRange : nhl.BottomRange,
            TopLimit : nhl.TopLimit
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
                },
                site: function() {
                  return 'FanDuel';
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

      $http.post('/NHL/read', {'id':saveDetailsID}).then(function successCallback(response) {
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
      $http.post('/NHL/loadHistory', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
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
      $http.post('/NHL/delete', {'id':saveID}).then(function successCallback(response) {
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
      $http.post('/NHL/updateTitle', {'id':saveID, 'title': title}).then(function successCallback(response) {
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

      nhl.TopRange = parseFloat(savedData.TopRange);
      nhl.BottomRange = parseFloat(savedData.BottomRange);
      nhl.TopLimit = parseInt(savedData.TopLimit);

      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._C1PlayerPool, singlePlayer, 'C1');
        $scope.loadPlayerInPool(savedData._C2PlayerPool, singlePlayer, 'C2');
        $scope.loadPlayerInPool(savedData._W1PlayerPool, singlePlayer, 'W1');
        $scope.loadPlayerInPool(savedData._W2PlayerPool, singlePlayer, 'W2');
        $scope.loadPlayerInPool(savedData._W3PlayerPool, singlePlayer, 'W3');
        $scope.loadPlayerInPool(savedData._W4PlayerPool, singlePlayer, 'W4');
        $scope.loadPlayerInPool(savedData._D1PlayerPool, singlePlayer, 'D1');
        $scope.loadPlayerInPool(savedData._D2PlayerPool, singlePlayer, 'D2');
        $scope.loadPlayerInPool(savedData._GPlayerPool, singlePlayer, 'G');
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
