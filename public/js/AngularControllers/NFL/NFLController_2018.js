
angular.module('NFLApp').controller('NFLController', ['$http', '$scope', '$filter', '$uibModal', '$window', '$timeout', function ($http, $scope, $filter, $uibModal, $window, $timeout) {
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

    $scope._QBPlayerPool = [];
    $scope._RB1PlayerPool = [];
    $scope._RB2PlayerPool = []
    $scope._WR1PlayerPool = [];
    $scope._WR2PlayerPool = [];
    $scope._WR3PlayerPool = [];
    $scope._TEPlayerPool = [];
    $scope._FLEXPlayerPool = [];
    $scope._DSTPlayerPool = [];

    $scope.sortTypeDraft = 'FPPG';
    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = false;

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.SelectedPosition = 'QB';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedWeeks = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;

    $scope.savedPastSettings = [];

    nfl.TopLimit = 150;
    nfl.TopRange = -1;
    nfl.BottomRange = -1;
    nfl.removeDups = true;

    $scope.DeleteConfirmationID = -1;
    $scope.currentRead = null;

    $scope.DraftsBuilding = false;
    $scope.worker = new Worker('js/AngularControllers/NFL/worker_2018.js');

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeams);
    $scope._AllPlayers = $filter('position')($scope._AllPlayers, $scope.SelectedPosition);

    $scope._SelectedSlate = "No Slate Selected";
    $scope._BuildSettings = {
      Team_Stack_Players : 1,
      QB_RB_Stack : false,
      QB_WR_Stack : false,
      QB_TE_Stack : false,
      Players_VS_Defense : 0,
    };

    $http.post("/NFL/getSlates_2018").then(function successCallback(response) {
       $scope._Slates = [];//clear out
       response.data.forEach(function (element) {
           $scope._Slates.push(element);
       });
    }, function errorCallBack(response) {

    });

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

    $scope.selectSlate = function(slate) {
      $http.post("/NFL/getPlayersFromSlate", slate).then(function successCallback(response) {
        $scope.clearPlayerPools();
        $scope.clearDrafts();
        $scope.clearAllPlayers();

        $scope.currentRead = null;
        $scope.mainTabHeading = "Players";
        $scope._SelectedSlate = slate.Slate_Name + " | Year: "+slate.Year+" Week: "+slate.Week;
        console.log(response);
        $scope._AllTeams = [];
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
        $scope.displayNewMessage("danger", "Slate loading failed.");
      });
    }

    $scope.replacePlayerIDs = function(event) {
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

            $scope._AllPlayers.forEach(function(singlePlayer) {
              if(player._Position === "DST") {
                if(singlePlayer._Name === player._FName.trim() || singlePlayer._Name === player._LName.trim()) {
                  singlePlayer.playerID = player.playerID;
                  singlePlayer._Salary = player._Salary;
                }
              }
              else {
                if(player._Name.indexOf("Jr.") !== -1) {
                  if(singlePlayer._Name.replace("Jr.", "").trim() === player._Name.replace("Jr.", "").trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }
                else if(player._Name.indexOf("II") !== -1) {
                  if(singlePlayer._Name.replace("II", "").trim() === player._Name.replace("II", "").trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }
                else if(player._Name.indexOf("III") !== -1) {
                  if(singlePlayer._Name.replace("III", "").trim() === player._Name.replace("III", "").trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }
                else if(player._Name.indexOf("IV") !== -1) {
                  if(singlePlayer._Name.replace("IV", "").trim() === player._Name.replace("IV", "").trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }
                else if(player._Name.indexOf(" V") !== -1) {
                  if(singlePlayer._Name.replace(" V", "").trim() === player._Name.replace(" V", "").trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }
                else {
                  if(singlePlayer._Name === player._Name.trim()) {
                    singlePlayer.playerID = player.playerID;
                    singlePlayer._Salary = player._Salary;
                  }
                }

              }

            });
          });
          if($scope._AllPlayers.length > 0) {
            $scope.displayNewMessage("success", "Player ID's have been successfully changed.");
          }
      }, function errorCallBack(response) {
          console.log(response);
          $scope.displayNewMessage("danger", "Error: Player ID's have not been changed.");
      });
      //clear input
      angular.forEach(
        angular.element("input[type='file']"),
        function(inputElem) {
          angular.element(inputElem).val(null);
        }
      );
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
      //clear input
      angular.forEach(
        angular.element("input[type='file']"),
        function(inputElem) {
          angular.element(inputElem).val(null);
        }
      );
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
        //clear input
        angular.forEach(
          angular.element("input[type='file']"),
          function(inputElem) {
            angular.element(inputElem).val(null);
          }
        );
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


    $scope.removePlayerFromPool = function (player, position)
    {
      if($scope.playerInPool(player, position))
      {
        switch (position)
        {
            case 'QB':
                $scope._QBPlayerPool.splice($scope._QBPlayerPool.indexOf(player), 1);
                break;
            case 'RB1':
                $scope._RB1PlayerPool.splice($scope._RB1PlayerPool.indexOf(player), 1);
                break;
            case 'RB2':
                $scope._RB2PlayerPool.splice($scope._RB2PlayerPool.indexOf(player), 1);
                break;
            case 'WR1':
                $scope._WR1PlayerPool.splice($scope._WR1PlayerPool.indexOf(player), 1);
                break;
            case 'WR2':
                $scope._WR2PlayerPool.splice($scope._WR2PlayerPool.indexOf(player), 1);
                break;
            case 'WR3':
                $scope._WR3PlayerPool.splice($scope._WR3PlayerPool.indexOf(player), 1);
                break;
            case 'TE':
                $scope._TEPlayerPool.splice($scope._TEPlayerPool.indexOf(player), 1);
                break;
            case 'FLEX':
                $scope._FLEXPlayerPool.splice($scope._FLEXPlayerPool.indexOf(player), 1);
                break;
            case 'DST':
                $scope._DSTPlayerPool.splice($scope._DSTPlayerPool.indexOf(player), 1);
                break;
        }
      }
    }

    $scope.addPlayerToPool = function (player, position)
    {
        if (!$scope.playerInPool(player, position))
        {
            switch (position)
            {
                case 'QB':
                    $scope._QBPlayerPool.push(player);
                    break;
                case 'RB1':
                    $scope._RB1PlayerPool.push(player);
                    break;
                case 'RB2':
                    $scope._RB2PlayerPool.push(player);
                    break;
                case 'WR1':
                    $scope._WR1PlayerPool.push(player);
                    break;
                case 'WR2':
                    $scope._WR2PlayerPool.push(player);
                    break;
                case 'WR3':
                    $scope._WR3PlayerPool.push(player);
                    break;
                case 'TE':
                    $scope._TEPlayerPool.push(player);
                    break;
                case 'FLEX':
                    $scope._FLEXPlayerPool.push(player);
                    break;
                case 'DST':
                    $scope._DSTPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player, position)
    {
        switch (position)
        {
            case 'QB':
                if ($scope._QBPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'RB1':
                if ($scope._RB1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'RB2':
                if ($scope._RB2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'WR1':
                if ($scope._WR1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'WR2':
                if ($scope._WR2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'WR3':
                if ($scope._WR3PlayerPool.indexOf(player) > -1)
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
            case 'FLEX':
                if ($scope._FLEXPlayerPool.indexOf(player) > -1)
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
        $scope._RB1PlayerPool = [];
        $scope._RB2PlayerPool = [];
        $scope._WR1PlayerPool = [];
        $scope._WR2PlayerPool = [];
        $scope._WR3PlayerPool = [];
        $scope._TEPlayerPool = [];
        $scope._FLEXPlayerPool = [];
        $scope._DSTPlayerPool = [];
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
    $scope.removeAllButTopN = function() {
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, $scope.sortReverseDraft);
      if($scope._AllDraftData.length > nfl.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nfl.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
        //add top TopLimit to displayed
        $scope._AllDisplayedDraftData = [];
        for(var i = 0; i < nfl.TopLimit; i++) {
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
      var allQBs = $filter('position')(orderedFPPGPlayers, 'QB');
      var allRBs = $filter('position')(orderedFPPGPlayers, 'RB');
      var allWRs = $filter('position')(orderedFPPGPlayers, 'WR');
      var allTEs = $filter('position')(orderedFPPGPlayers, 'TE');
      var allFLEXs = $filter('position')(orderedFPPGPlayers, 'FLEX');
      var allDSTs = $filter('position')(orderedFPPGPlayers, 'DST');


      $scope._AllPlayers.forEach(function(player) {
        var playerRank = 99;
        switch(player._Position) {
          case 'QB':
            playerRank = allQBs.indexOf(player) + 1;
            break;
          case 'RB':
            playerRank = allRBs.indexOf(player) + 1;
            break;
          case 'WR':
            playerRank = allWRs.indexOf(player) + 1;
            break;
          case 'TE':
            playerRank = allTEs.indexOf(player) + 1;
            break;
          case 'FLEX':
            playerRank = allFLEXs.indexOf(player) + 1;
            break;
          case 'DST':
            playerRank = allDSTs.indexOf(player) + 1;
            break;
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
    $scope.addSalaryImpliedPts = function() {
      $scope._AllPlayers.forEach(function(player) {
        player._FPPG = player._Salary * 0.004;
        player._FPPG = player._FPPG.toFixed(1);
        player._FPPG = parseFloat(player._FPPG);
        $scope.updatePlayerPtsPerDollar(player);
      });
    }

    $scope.cancelBuild = function() {
      $scope.worker.terminate();
      $scope.DraftsBuilding = false;
      $scope.worker = new Worker('js/AngularControllers/NFL/worker_2018.js');
    }

    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ( $scope._QBPlayerPool.length == 0 ||
          $scope._RB1PlayerPool.length == 0 ||
          $scope._RB2PlayerPool.length == 0 ||
          $scope._WR1PlayerPool.length == 0 ||
          $scope._WR2PlayerPool.length == 0 ||
          $scope._WR3PlayerPool.length == 0 ||
          $scope._TEPlayerPool.length == 0 ||
          $scope._FLEXPlayerPool.length == 0 ||
          $scope._DSTPlayerPool.length == 0) {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        $scope.setPlayerRanking();

        $scope.totalPossibleDraftsToBeCreated =
        $scope._QBPlayerPool.length * $scope._RB1PlayerPool.length *
        $scope._RB2PlayerPool.length * $scope._WR1PlayerPool.length *
        $scope._WR2PlayerPool.length * $scope._WR3PlayerPool.length *
        $scope._TEPlayerPool.length * $scope._FLEXPlayerPool.length *
        $scope._DSTPlayerPool.length;

        if($scope.totalPossibleDraftsToBeCreated > 10000) {
          if (!confirm('Creating '+$scope.totalPossibleDraftsToBeCreated+' possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?')) {
            return;
          }
        }

        //before, make sure data is cleared
        $scope.clearDrafts();


        $scope.worker.postMessage([$scope._QBPlayerPool, $scope._RB1PlayerPool, $scope._RB2PlayerPool, $scope._WR1PlayerPool,
          $scope._WR2PlayerPool, $scope._WR3PlayerPool, $scope._TEPlayerPool, $scope._FLEXPlayerPool, $scope._DSTPlayerPool, $scope._BuildSettings]);
        $scope.DraftsBuilding = true;


        $scope.worker.onmessage = function(event) {
            //console.log(event.data);
            $scope._AllDraftData = event.data;
            $scope.DraftsBuilding = false;

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
        };
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
        var startingSalary = 60000;
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
            var index = $scope._AllPlayers.map(function(e) { return e._Name; }).indexOf(player._Name);
              $scope._AllPlayers[index]._TimesInDrafts += 1;
              $scope._AllPlayers[index]._TimesInValidDrafts += 1;
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
      var NonInjuredPlayers =  $filter('removeInjured')(orderedPlayers);
      var allQBs = $filter('position')(NonInjuredPlayers, 'QB');
      var allRBs = $filter('position')(NonInjuredPlayers, 'RB');
      var allWRs = $filter('position')(NonInjuredPlayers, 'WR');
      var allTEs = $filter('position')(NonInjuredPlayers, 'TE');
      var allFLEXs = $filter('position')(NonInjuredPlayers, 'FLEX');
      var allDSTs = $filter('position')(NonInjuredPlayers, 'DST');

      for(var j = 0; j < allQBs.length; j++) {
        if(j == 0 || j == 1 ) {
          $scope.addPlayerToPool(allQBs[j], 'QB');
        }
      }
      for(var j = 0; j < allRBs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allRBs[j], 'RB1');
        }
        if( j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allRBs[j], 'RB2');
        }
      }
      for(var j = 0; j < allWRs.length; j++) {
        if(j == 0 || j == 1 || j == 2) {
          $scope.addPlayerToPool(allWRs[j], 'WR1');
        }
        if(j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allWRs[j], 'WR2');
        }
        if(j == 2 || j == 3|| j == 4|| j == 5) {
          $scope.addPlayerToPool(allWRs[j], 'WR3');
        }
      }
      for(var j = 0; j < allTEs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allTEs[j], 'TE');
        }
      }
      for(var j = 0; j < allFLEXs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allFLEXs[j], 'FLEX');
        }
      }
      for(var j = 0; j < allDSTs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allDSTs[j], 'DST');
        }
      }
    }
    $scope.selectTopSpecialPlayers = function() {
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
      var allFLEXs = $filter('position')(NonInjuredPlayers, 'FLEX');
      var allDSTs = $filter('position')(NonInjuredPlayers, 'DST');

      for(var j = 0; j < allQBs.length; j++) {
        if(j == 2 || j == 3 ) {
          $scope.addPlayerToPool(allQBs[j], 'QB');
        }
      }
      for(var j = 0; j < allRBs.length; j++) {
        if(j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allRBs[j], 'RB1');
        }
        if(allRBs.length < 7) {
          if( j == 2 || j == 3 || j == 4 || j == 5 || j == 6) {
            $scope.addPlayerToPool(allRBs[j], 'RB2');
          }
        }
        else {
          if( j == 3 || j == 4 || j == 5) {
            $scope.addPlayerToPool(allRBs[j], 'RB2');
          }
        }
      }
      for(var j = 0; j < allWRs.length; j++) {
        if(j == 0 || j == 1 || j == 2) {
          $scope.addPlayerToPool(allWRs[j], 'WR1');
        }
        if(j == 3 || j == 4 || j == 5 ) {
          $scope.addPlayerToPool(allWRs[j], 'WR2');
        }
        if(j == 6 || j == 7 || j == 8|| j == 9) {
          $scope.addPlayerToPool(allWRs[j], 'WR3');
        }
      }
      for(var j = 0; j < allTEs.length; j++) {
        if(j == 0 || j == 2|| j == 3) {
          $scope.addPlayerToPool(allTEs[j], 'TE');
        }
      }
      for(var j = 0; j < allFLEXs.length; j++) {
        if(j == 1 || j == 3 || j == 5 || j == 6 || j == 7 || j == 10 || j == 11) {
          $scope.addPlayerToPool(allFLEXs[j], 'FLEX');
        }
      }
      for(var j = 0; j < allDSTs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allDSTs[j], 'DST');
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
    $scope.CSVReplace = function (event) {


      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');

            var csvRows = [];
            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');

                var entry_id = "";
                var contest_id = "";
                var contest_name = "";
                var playerPoints = 0;
                var playerSalary = 0;
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0:
                            entry_id = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 1:
                            contest_id = data[j].replace('"', '').replace('"', '').trim();

                            break;
                        case 2:
                            contest_name = data[j].replace('"', '').replace('"', '').trim();
                            break;

                    }
                }
                var csvRow = {entry_id: entry_id, contest_id: contest_id, contest_name: contest_name};
                if(entry_id !== undefined && entry_id !== '') {
                  csvRows.push(csvRow);
                }
            }
            if($scope._AllDraftData.length == csvRows.length) {
              var numRowsChanged = 0;
              var drafts = $scope._AllDraftData;
              drafts = $filter('checkValidOnly')(drafts, true);
              drafts = $filter('orderBy')(drafts, $scope.sortTypeDraft, $scope.sortReverseDraft);
              var csvContent = "data:text/csv;charset=utf-8,";
              csvContent = csvContent + "entry_id,contest_id,contest_name,QB,RB,RB,WR,WR,WR,TE,K,D\n";
              for(var k = 0; k < csvRows.length; k++) {
                var splitContestID = csvRows[k].contest_id.split('-');
                if(drafts[k].players[0].playerID.indexOf(splitContestID[0]) !== -1) {
                  //contains the same contest id within the player id, hard coded to check on ly the first player
                  csvContent =  csvContent + csvRows[k].entry_id+','+csvRows[k].contest_id+','+csvRows[k].contest_name+',';
                  var lineOfText = "";
                  for(var j = 0; j < drafts[k].players.length;j++) {
                    if (j == 0)
                    {
                        lineOfText = lineOfText + drafts[k].players[j].playerID;
                    }
                    else
                    {
                        lineOfText = lineOfText + "," + drafts[k].players[j].playerID;
                    }
                  }
                  csvContent = csvContent + lineOfText + "\n";
                  numRowsChanged++;
                } else {
                  $scope.$apply(function() {
                    $scope.displayNewMessage("warning", "WARNING: player ID does not contain contest ID, Are you sure you have the correct CSV Replace file?");
                  });
                }
              }
              if(numRowsChanged > 0) {
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
                    download: 'CSVReplace_'+CSVName+'.csv'
                })[0].click();

                anchor.remove(); // Clean it up afterwards
                $scope.$apply(function() {

                  $scope.displayNewMessage("success", "Successfully replaced lineups in CSV");

                });
              }
            } else {
              $scope.$apply(function() {

                $scope.displayNewMessage("danger", "ERROR: # drafts: "+$scope._AllDraftData.length+" != "+csvRows.length+". Both CSV File and Total Drafts must be equal.");

              });
            }


        }
        reader.readAsText(file);
        //clear input
        angular.forEach(
          angular.element("input[type='file']"),
          function(inputElem) {
            angular.element(inputElem).val(null);
          }
        );
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
      var allFLEXs = $filter('position')(NonInjuredPlayers, 'FLEX');
      var allDSTs = $filter('position')(NonInjuredPlayers, 'DST');

      for(var j = 0; j < allQBs.length; j++) {
        if(j == 0 || j == 1 ) {
          $scope.addPlayerToPool(allQBs[j], 'QB');
        }
      }
      for(var j = 0; j < allRBs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allRBs[j], 'RB1');
        }
        if( j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allRBs[j], 'RB2');
        }
      }
      for(var j = 0; j < allWRs.length; j++) {
        if(j == 0 || j == 1 || j == 2) {
          $scope.addPlayerToPool(allWRs[j], 'WR1');
        }
        if(j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allWRs[j], 'WR2');
        }
        if(j == 3 || j == 4 || j == 5|| j == 6) {
          $scope.addPlayerToPool(allWRs[j], 'WR3');
        }
      }
      for(var j = 0; j < allTEs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allTEs[j], 'TE');
        }
      }
      for(var j = 0; j < allFLEXs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allFLEXs[j], 'FLEX');
        }
      }
      for(var j = 0; j < allDSTs.length; j++) {
        if(j == 0 || j == 1) {
          $scope.addPlayerToPool(allDSTs[j], 'DST');
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
    $scope.openCloseAdvanced = function (player) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/modelAdvancedNFL.html',
            controller: 'AdvancedControllerNFL',
            size: 'lg',
            resolve: {
                _BuildSettings: function () {
                    return $scope._BuildSettings;
                }
            }
        });
        modalInstance.result.then(function (returnData) {
          $scope._BuildSettings = returnData['_BuildSettings'];
        }, function () {

        });
    }

    $scope.removeCalcDrafts = function () {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(nfl.TopRange), parseFloat(nfl.BottomRange), $scope.sortTypeDraft);

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

    $scope.isDraftSalaryValid = function (draft) {
        var startingSalary = 60000;
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
      $scope.clearAllPlayerFilters();

      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;

      nfl.TopRange = parseFloat(savedData.TopRange);
      nfl.BottomRange = parseFloat(savedData.BottomRange);
      nfl.TopLimit = parseInt(savedData.TopLimit);

      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }
        $scope.loadPlayerInPool(savedData._QBPlayerPool, singlePlayer, 'QB');
        $scope.loadPlayerInPool(savedData._RB1PlayerPool, singlePlayer, 'RB1');
        $scope.loadPlayerInPool(savedData._RB2PlayerPool, singlePlayer, 'RB2');
        $scope.loadPlayerInPool(savedData._WR1PlayerPool, singlePlayer, 'WR1');
        $scope.loadPlayerInPool(savedData._WR2PlayerPool, singlePlayer, 'WR2');
        $scope.loadPlayerInPool(savedData._WR3PlayerPool, singlePlayer, 'WR3');
        $scope.loadPlayerInPool(savedData._TEPlayerPool, singlePlayer, 'TE');
        $scope.loadPlayerInPool(savedData._FLEXPlayerPool, singlePlayer, 'FLEX');
        $scope.loadPlayerInPool(savedData._DSTPlayerPool, singlePlayer, 'DST');
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }
    $scope.loadPlayerInPool = function(playerPool, singlePlayer, position) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.addPlayerToPool(singlePlayer, position);
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
            _QBPlayerPool : $scope._QBPlayerPool,
            _RB1PlayerPool : $scope._RB1PlayerPool,
            _RB2PlayerPool : $scope._RB2PlayerPool,
            _WR1PlayerPool : $scope._WR1PlayerPool,
            _WR2PlayerPool : $scope._WR2PlayerPool,
            _WR3PlayerPool : $scope._WR3PlayerPool,
            _TEPlayerPool : $scope._TEPlayerPool,
            _FLEXPlayerPool : $scope._FLEXPlayerPool,
            _DSTPlayerPool : $scope._DSTPlayerPool,
            TopRange : nfl.TopRange,
            BottomRange : nfl.BottomRange,
            TopLimit : nfl.TopLimit
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
}]);
