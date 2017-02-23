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
    $scope.SelectedTeam = 'All';
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;


    nba.removeDups = true;

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

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeam);
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

      var formData = new FormData();
      formData.append('csvFile', event.target.files[0]);

      $http.post("/NBA/loadDraftKingsPlayers", formData, {
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
      var allPGs = $filter('positionDK')(orderedPlayers, 'PG');
      var allSGs = $filter('positionDK')(orderedPlayers, 'SG');
      var allSFs = $filter('positionDK')(orderedPlayers, 'SF');
      var allPFs = $filter('positionDK')(orderedPlayers, 'PF');
      var allCs = $filter('positionDK')(orderedPlayers, 'C');
      var allGs = $filter('positionDK')(orderedPlayers, 'G');
      var allFs = $filter('positionDK')(orderedPlayers, 'F');
      var allUTILs = $filter('positionDK')(orderedPlayers, 'UTIL');

      for(var j = 0; j < 4; j++) {
        if(allPGs.length >= j) {
          $scope.addPlayerToPool(allPGs[j], 'PG');
        }
        if(allSGs.length >= j) {
          $scope.addPlayerToPool(allSGs[j], 'SG');
        }
        if(allSFs.length >= j) {
          $scope.addPlayerToPool(allSFs[j], 'SF');
        }
        if(allPFs.length >= j) {
          $scope.addPlayerToPool(allPFs[j], 'PF');
        }
        if(allCs.length >= j) {
          $scope.addPlayerToPool(allCs[j], 'C');
        }
        if(allGs.length >= j) {
          $scope.addPlayerToPool(allGs[j], 'G');
        }
        if(allFs.length >= j) {
          $scope.addPlayerToPool(allFs[j], 'F');
        }
        if(allUTILs.length >= j) {
          $scope.addPlayerToPool(allUTILs[j], 'UTIL');
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
      var allGs = $filter('positionDK')(NonInjuredPlayers, 'G');
      var allFs = $filter('positionDK')(NonInjuredPlayers, 'F');
      var allUTILs = $filter('positionDK')(NonInjuredPlayers, 'UTIL');

      var orderedValuePlayers =  $filter('orderBy')($scope._AllPlayers, '_ProjectedPointsPerDollar', true);
      var NonInjuredValuePlayers =  $filter('removeInjured')(orderedValuePlayers);
      var allValuePGs = $filter('positionDK')(NonInjuredValuePlayers, 'PG');
      var allValueSGs = $filter('positionDK')(NonInjuredValuePlayers, 'SG');
      var allValueSFs = $filter('positionDK')(NonInjuredValuePlayers, 'SF');
      var allValuePFs = $filter('positionDK')(NonInjuredValuePlayers, 'PF');
      var allValueCs = $filter('positionDK')(NonInjuredValuePlayers, 'C');
      var allValueGs = $filter('positionDK')(NonInjuredValuePlayers, 'G');
      var allValueFs = $filter('positionDK')(NonInjuredValuePlayers, 'F');
      var allValueUTILs = $filter('positionDK')(NonInjuredValuePlayers, 'UTIL');

      //version 1
      for(var j = 0; j < allPGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allPGs[j], 'PG');
        }
      }
      for(var j = 0; j < allValuePGs.length; j++) {
        if(j == 0 ) {
          $scope.addPlayerToPool(allValuePGs[j], 'PG');
        }
      }
      //$scope.lockAndUnLockPlayer(allPGs[0]);

      for(var j = 0; j < allSGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3 ) {
          $scope.addPlayerToPool(allSGs[j], 'SG');
        }
      }
      for(var j = 0; j < allValueSGs.length; j++) {
        if(j == 0 ) {
          $scope.addPlayerToPool(allValueSGs[j], 'SG');
        }
      }

      for(var j = 0; j < allSFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allSFs[j], 'SF');
        }
      }
      for(var j = 0; j < allValueSFs.length; j++) {
        if(j == 0 ) {
          $scope.addPlayerToPool(allValueSFs[j], 'SF');
        }
      }


      for(var j = 0; j < allPFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allPFs[j], 'PF');
        }
      }
      for(var j = 0; j < allValuePFs.length; j++) {
        if(j == 0 ) {
          $scope.addPlayerToPool(allValuePFs[j], 'PF');
        }
      }

      for(var j = 0; j < allCs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allCs[j], 'C');
        }
      }
      for(var j = 0; j < allValueCs.length; j++) {
        if(j == 0 ) {
          $scope.addPlayerToPool(allValueCs[j], 'C');
        }
      }

      for(var j = 0; j < allGs.length; j++) {
        if( j == 0) {
          $scope.addPlayerToPool(allGs[j], 'G');
        }
      }
      for(var j = 0; j < allValueGs.length; j++) {
        if(j == 0 ||j == 1 || j == 3 ) {
          $scope.addPlayerToPool(allValueGs[j], 'G');
        }
      }

      for(var j = 0; j < allFs.length; j++) {
        if( j == 0) {
          $scope.addPlayerToPool(allFs[j], 'F');
        }
      }
      for(var j = 0; j < allValueFs.length; j++) {
        if(j == 0 ||j == 1 || j == 3 ) {
          $scope.addPlayerToPool(allValueFs[j], 'F');
        }
      }
      for(var j = 0; j < allUTILs.length; j++) {
        if( j == 0) {
          $scope.addPlayerToPool(allUTILs[j], 'UTIL');
        }
      }
      for(var j = 0; j < allValueUTILs.length; j++) {
        if(j == 0 ||j == 1 || j == 3 ) {
          $scope.addPlayerToPool(allValueUTILs[j], 'UTIL');
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
        $scope.setPlayerRanking();

        var totalPossibleDraftsToBeCreated = $scope._PGPlayerPool.length * $scope._SGPlayerPool.length *
        $scope._SFPlayerPool.length * $scope._PFPlayerPool.length *
        $scope._CPlayerPool.length * $scope._GPlayerPool.length *
        $scope._FPlayerPool.length * $scope._UTILPlayerPool.length;

        if(totalPossibleDraftsToBeCreated > 30000) {
          if (!confirm('Creating '+totalPossibleDraftsToBeCreated+' possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?')) {
            return;
          }
        }

        //start draft building

        var tempPlayerNamesList = [];

        $scope._PGPlayerPool.forEach(function (PGPlayer) {
            var tempDraft = {};
            tempDraft['PG'] = PGPlayer;
            $scope._SGPlayerPool.forEach(function (SGPlayer) {
                tempDraft['SG'] = SGPlayer;
                $scope._SFPlayerPool.forEach(function (SFPlayer) {
                    tempDraft['SF'] = SFPlayer;
                    $scope._PFPlayerPool.forEach(function (PFPlayer) {
                        tempDraft['PF'] = PFPlayer;
                        $scope._CPlayerPool.forEach(function (CPlayer) {
                            tempDraft['C'] = CPlayer;
                            $scope._GPlayerPool.forEach(function(GPlayer) {
                              tempDraft['G'] = GPlayer;
                              $scope._FPlayerPool.forEach(function(FPlayer) {
                                tempDraft['F'] = FPlayer;
                                $scope._UTILPlayerPool.forEach(function(UtilPlayer) {
                                  tempDraft['UTIL'] = UtilPlayer;
                                  var finalPlayerList = [];
                                  finalPlayerList.push(tempDraft['PG']);
                                  finalPlayerList.push(tempDraft['SG']);
                                  finalPlayerList.push(tempDraft['SF']);
                                  finalPlayerList.push(tempDraft['PF']);
                                  finalPlayerList.push(tempDraft['C']);
                                  finalPlayerList.push(tempDraft['G']);
                                  finalPlayerList.push(tempDraft['F']);
                                  finalPlayerList.push(tempDraft['UTIL']);

                                  var tempPlayerNames = [];
                                  tempPlayerNames.push(tempDraft['PG']._Name);
                                  tempPlayerNames.push(tempDraft['SG']._Name);
                                  tempPlayerNames.push(tempDraft['SF']._Name);
                                  tempPlayerNames.push(tempDraft['PF']._Name);
                                  tempPlayerNames.push(tempDraft['C']._Name);
                                  tempPlayerNames.push(tempDraft['G']._Name);
                                  tempPlayerNames.push(tempDraft['F']._Name);
                                  tempPlayerNames.push(tempDraft['UTIL']._Name);
                                  //add only valid drafts
                                  if($scope.isDraftTeamValid(finalPlayerList) && $scope.isDraftSalaryValid(finalPlayerList) && !$scope.doesDraftHaveDupPlayers(finalPlayerList)) {
                                    //$scope._AllDrafts.push(tempDraft);
                                    var tempDataObj = {
                                      FPPG: parseFloat($scope.getDraftFPPG(finalPlayerList)),
                                      Actual: parseFloat($scope.getDraftActual(finalPlayerList)),
                                      validTeam: $scope.isDraftTeamValid(finalPlayerList),
                                      validSalary: $scope.isDraftSalaryValid(finalPlayerList),
                                      salaryLeft: parseInt($scope.getDraftSalaryLeft(finalPlayerList)),
                                      playerNames: tempPlayerNames,
                                      playersPositionData: angular.copy(tempDraft),
                                      players: finalPlayerList,
                                      displayDetails: false,
                                      pointsPerDollar:  parseFloat($scope.averageValue(finalPlayerList)),
                                      averageRank: parseFloat($scope.averageRank(finalPlayerList))
                                    };

                                    if(nba.removeDups)
                                    {
                                      var sameDraft = false;
                                      if(tempPlayerNamesList.length > 0) {
                                        for(var j = tempPlayerNamesList.length-1; j >= 0; j--) {
                                          var playersInDraft = 0;

                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][0]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][1]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][2]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][3]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][4]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][5]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][6]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(tempPlayerNames.indexOf(tempPlayerNamesList[j][7]) !== -1) {
                                            playersInDraft++;
                                          }
                                          if(playersInDraft === 8) {
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

                                  //  $scope._AllDraftData.push(tempDataObj);//store valid only
                                  //  tempPlayerNamesList.push(tempPlayerNames);
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
    $scope.setPlayerRanking = function() {
      var orderedFPPGPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var injuredPlayers =  $filter('removeInjured')(orderedFPPGPlayers);
      var allPGs = $filter('positionDK')(injuredPlayers, 'PG');
      var allSGs = $filter('positionDK')(injuredPlayers, 'SG');
      var allSFs = $filter('positionDK')(injuredPlayers, 'SF');
      var allPFs = $filter('positionDK')(injuredPlayers, 'PF');
      var allCs = $filter('positionDK')(injuredPlayers, 'C');
      $scope._AllPlayers.forEach(function(player) {
        var playerRank = 99;

        if(player._Position.indexOf('PG') !== -1) {
          playerRank = allPGs.indexOf(player) + 1;
        } else if(player._Position.indexOf('SG') !== -1) {
          playerRank = allSGs.indexOf(player) + 1;
        } else if(player._Position.indexOf('SF') !== -1) {
          playerRank = allSFs.indexOf(player) + 1;
        } else if(player._Position.indexOf('C') !== -1) {
          playerRank = allCs.indexOf(player) + 1;
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
    $scope.averageValue = function(draft) {
      var value = 0;
      draft.forEach(function (player) {
          value = parseFloat(value) + parseFloat(player._ProjectedPointsPerDollar);
      });
      value = parseFloat(value);
      return (value / (draft.length)).toFixed(5);
    }
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 50000;
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
            controller: 'DKDraftModalController',
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
            _PGPlayerPool : $scope._PGPlayerPool,
            _SGPlayerPool : $scope._SGPlayerPool,
            _SFPlayerPool : $scope._SFPlayerPool,
            _PFPlayerPool : $scope._PFPlayerPool,
            _CPlayerPool : $scope._CPlayerPool,
            _GPlayerPool : $scope._GPlayerPool,
            _FPlayerPool : $scope._FPlayerPool,
            _UTILPlayerPool : $scope._UTILPlayerPool,
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
                },
                site: function() {
                  return 'DraftKings';
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

        $scope.loadPlayerInPool(savedData._PGPlayerPool, singlePlayer, 'PG');
        $scope.loadPlayerInPool(savedData._SGPlayerPool, singlePlayer, 'SG');
        $scope.loadPlayerInPool(savedData._SFPlayerPool, singlePlayer, 'SF');
        $scope.loadPlayerInPool(savedData._PFPlayerPool, singlePlayer, 'PF');
        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer, 'C');
        $scope.loadPlayerInPool(savedData._GPlayerPool, singlePlayer, 'G');
        $scope.loadPlayerInPool(savedData._FPlayerPool, singlePlayer, 'F');
        $scope.loadPlayerInPool(savedData._UTILPlayerPool, singlePlayer, 'UTIL');
      });
      $scope._Positions.sort();
      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
