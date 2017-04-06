angular.module('MLBApp').controller('MLBController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var mlb = this;

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

    $scope._PPlayerPool = [];
    $scope._CPlayerPool = [];
    $scope._1BPlayerPool = [];
    $scope._2BPlayerPool = [];
    $scope._3BPlayerPool = [];
    $scope._SSPlayerPool = [];
    $scope._OF1PlayerPool = [];
    $scope._OF2PlayerPool = [];
    $scope._OF3PlayerPool = [];

    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = true;
    $scope.sortTypeDraft = 'FPPG';

    $scope.sortType = '_Salary'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = true;
    $scope.SelectedPosition = 'P';     // set the default search/filter term
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

    mlb.TopLimit = 150;
    mlb.TopRange = -1;
    mlb.BottomRange = -1;
    mlb.removeDups = true;
    mlb.battersVSPitcher = 0;
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
                var data = allTextLines[i].split(',');

                var playerPosition = "";
                var playerTeam = "";
                var playerFName = "";
                var playerLName = "";
                var playerPoints = 0;
                var playerProjection = 0;
                var playerSalary = 0;
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0:
                            var name = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            var splitName = name.split(' ');
                            playerFName = splitName[0];
                            if(splitName.length == 2) {
                                playerLName = splitName[1];
                            } else {
                                playerLName = splitName[2];
                            }
                            break;
                        case 1:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 2:
                            playerTeam = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 14:
                            playerProjection = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 19:
                            playerPoints = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        // case 8:
                        //     playerSalary = parseInt(data[j].replace('"', '').replace('"', '').replace('$', '').trim());
                        //     break;

                    }
                }

                $scope._AllPlayers.forEach(function (player) {
                    if((player._Name.includes(playerFName) && player._Name.includes(playerLName))) {
                        player._ActualFantasyPoints = playerPoints;
                        player._FPPG = playerProjection;
                        $scope.updatePlayerPtsPerDollar(player);
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
      $scope.clearAllPlayerFilters();
      $scope.currentRead = null;
      $scope.mainTabHeading = "Players";

      var formData = new FormData();
      formData.append('csvFile', event.target.files[0]);

      $http.post("/MLB/loadFanDuelPlayers", formData, {
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
            if (player._playerInjured == 'O' || player._playerInjured === 'IR' || player._playerInjured === 'NA') {
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
            //only display probable pitchers
            if(player._Position === 'P' && player._ProbablePitcher === 'Yes') {
              $scope._AllPlayers.push(player);
              $scope._AllPlayersMASTER.push(player);
            } else if(player._Position !== 'P') {
              $scope._AllPlayers.push(player);
              $scope._AllPlayersMASTER.push(player);
            }
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

    $scope.selectTopActualPlayers = function() {
      $scope.clearPlayerPools();
      if($scope._AllPlayers.length === 0) {
        return;
      }
      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_ActualFantasyPoints', true);
      var allPs = $filter('position')(orderedPlayers, 'P');
      var allCs = $filter('position')(orderedPlayers, 'C');
      var all1Bs = $filter('position')(orderedPlayers, '1B');
      var all2Bs = $filter('position')(orderedPlayers, '2B');
      var all3Bs = $filter('position')(orderedPlayers, '3B');
      var allSSs = $filter('position')(orderedPlayers, 'SS');
      var allOFs = $filter('position')(orderedPlayers, 'OF');

      for(var j = 0; j < 5; j++) {
        if(j < 3) {
          $scope.addPlayerToPool(allPs[j], 'P');
          $scope.addPlayerToPool(allCs[j], 'C');
          $scope.addPlayerToPool(all1Bs[j], '1B');
          $scope.addPlayerToPool(all2Bs[j], '2B');
          $scope.addPlayerToPool(all3Bs[j], '3B');
          $scope.addPlayerToPool(all1Bs[j], 'SS');
          $scope.addPlayerToPool(allOFs[j], 'OF1');
          $scope.addPlayerToPool(allOFs[j], 'OF2');
          $scope.addPlayerToPool(allOFs[j], 'OF3');
        }
        if(j > 0) {
          $scope.addPlayerToPool(allOFs[j], 'OF2');
          $scope.addPlayerToPool(allOFs[j], 'OF3');
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
              csvContent = csvContent + "entry_id,contest_id,contest_name,P,C,1B,2B,3B,SS,OF,OF,OF\n";
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
      var allPs = $filter('position')(NonInjuredPlayers, 'P');
      var allCs = $filter('position')(NonInjuredPlayers, 'C');
      var all1Bs = $filter('position')(NonInjuredPlayers, '1B');
      var all2Bs = $filter('position')(NonInjuredPlayers, '2B');
      var all3Bs = $filter('position')(NonInjuredPlayers, '3B');
      var allSSs = $filter('position')(NonInjuredPlayers, 'SS');
      var allOFs = $filter('position')(NonInjuredPlayers, 'OF');
      for(var j = 0; j < allPs.length; j++) {
        if(j == 0 || j == 1 || j == 3) {
          $scope.addPlayerToPool(allPs[j], 'P');
        }
      }
      for(var j = 0; j < allCs.length; j++) {
        if(j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allCs[j], 'C');
        }
      }
      for(var j = 0; j < all1Bs.length; j++) {
        if(j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(all1Bs[j], '1B');
        }
      }
      for(var j = 0; j < all2Bs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(all2Bs[j], '2B');
        }
      }
      for(var j = 0; j < all3Bs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(all3Bs[j], '3B');
        }
      }
      for(var j = 0; j < allSSs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allSSs[j], 'SS');
        }
      }
      for(var j = 0; j < allOFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 ) {
          $scope.addPlayerToPool(allOFs[j], 'OF1');
        }
        if( j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allOFs[j], 'OF2');
        }
        if( j ==2 || j ==3 || j == 4 ) {
          $scope.addPlayerToPool(allOFs[j], 'OF3');
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

        $http.post("/api/MLB/changeLineups", formData, {
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

        csvContent = csvContent + "P,C,1B,2B,3B,SS,OF,OF,OF\n";
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

        $http.post('/MLB/downloadDrafts', {'downloadDrafts':drafts.length}).then(function successCallback(response) {

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
            case 'P':
                $scope._PPlayerPool.splice($scope._PPlayerPool.indexOf(player), 1);
                break;
            case 'C':
                $scope._CPlayerPool.splice($scope._CPlayerPool.indexOf(player), 1);
                break;
            case '1B':
                $scope._1BPlayerPool.splice($scope._1BPlayerPool.indexOf(player), 1);
                break;
            case '2B':
                $scope._2BPlayerPool.splice($scope._2BPlayerPool.indexOf(player), 1);
                break;
            case '3B':
                $scope._3BPlayerPool.splice($scope._3BPlayerPool.indexOf(player), 1);
                break;
            case 'SS':
                $scope._SSPlayerPool.splice($scope._SSPlayerPool.indexOf(player), 1);
                break;
            case 'OF1':
                $scope._OF1PlayerPool.splice($scope._OF1PlayerPool.indexOf(player), 1);
                break;
            case 'OF2':
                $scope._OF2PlayerPool.splice($scope._OF2PlayerPool.indexOf(player), 1);
                break;
            case 'OF3':
                $scope._OF3PlayerPool.splice($scope._OF3PlayerPool.indexOf(player), 1);
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
                case 'P':
                    $scope._PPlayerPool.push(player);
                    break;
                case 'C':
                    $scope._CPlayerPool.push(player);
                    break;
                case '1B':
                    $scope._1BPlayerPool.push(player);
                    break;
                case '2B':
                    $scope._2BPlayerPool.push(player);
                    break;
                case '3B':
                    $scope._3BPlayerPool.push(player);
                    break;
                case 'SS':
                    $scope._SSPlayerPool.push(player);
                    break;
                case 'OF1':
                    $scope._OF1PlayerPool.push(player);
                    break;
                case 'OF2':
                    $scope._OF2PlayerPool.push(player);
                    break;
                case 'OF3':
                    $scope._OF3PlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player, position)
    {
        switch (position)
        {
            case 'P':
                if ($scope._PPlayerPool.indexOf(player) > -1)
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
            case '1B':
                if ($scope._1BPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case '2B':
                if ($scope._2BPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case '3B':
                if ($scope._3BPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SS':
                if ($scope._SSPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'OF1':
                if ($scope._OF1PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'OF2':
                if ($scope._OF2PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'OF3':
                if ($scope._OF3PlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._PPlayerPool = [];
        $scope._CPlayerPool = [];
        $scope._1BPlayerPool = [];
        $scope._2BPlayerPool = [];
        $scope._3BPlayerPool = [];
        $scope._SSPlayerPool = [];
        $scope._OF1PlayerPool = [];
        $scope._OF2PlayerPool = [];
        $scope._OF3PlayerPool = [];
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
      if($scope._AllDraftData.length > mlb.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < mlb.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
        //add top TopLimit to displayed
        $scope._AllDisplayedDraftData = [];
        for(var i = 0; i < mlb.TopLimit; i++) {
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
      var allPs = $filter('position')(injuredPlayers, 'P');
      var allCs = $filter('position')(injuredPlayers, 'C');
      var all1Bs = $filter('position')(injuredPlayers, '1B');
      var all2Bs = $filter('position')(injuredPlayers, '2B');
      var all3Bs = $filter('position')(injuredPlayers, '3B');
      var allSSs = $filter('position')(injuredPlayers, 'SS');
      var allOFs = $filter('position')(injuredPlayers, 'OF');

      $scope._AllPlayers.forEach(function(player) {
        var playerRank = [];

        if(player._Position.indexOf('P') !== -1) {
          playerRank.push(allPs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('C') !== -1) {
          playerRank.push(allCs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('1B') !== -1) {
          playerRank.push(all1Bs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('2B') !== -1) {
          playerRank.push(all2Bs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('3B') !== -1) {
          playerRank.push(all3Bs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('SS') !== -1) {
          playerRank.push(allSSs.indexOf(player) + 1);
        }
        if(player._Position.indexOf('OF') !== -1) {
          playerRank.push(allOFs.indexOf(player) + 1);
        }
        var totalPlayerRank = 0;
        playerRank.forEach(function(singleRank) {
          totalPlayerRank = totalPlayerRank + singleRank;
        });
        player._Rank = parseInt(totalPlayerRank / playerRank.length);
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
    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ($scope._PPlayerPool.length == 0 ||
            $scope._CPlayerPool.length  == 0 ||
            $scope._1BPlayerPool.length == 0 ||
            $scope._2BPlayerPool.length == 0 ||
            $scope._3BPlayerPool.length == 0 ||
            $scope._SSPlayerPool.length == 0 ||
            $scope._OF1PlayerPool.length == 0 ||
            $scope._OF2PlayerPool.length == 0 ||
            $scope._OF3PlayerPool.length == 0)
        {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        $scope.setPlayerRanking();

        $scope.totalPossibleDraftsToBeCreated = $scope._PPlayerPool.length *
        $scope._CPlayerPool.length * $scope._1BPlayerPool.length *
        $scope._2BPlayerPool.length * $scope._3BPlayerPool.length *
        $scope._SSPlayerPool.length * $scope._OF1PlayerPool.length *
        $scope._OF2PlayerPool.length * $scope._OF3PlayerPool.length;

        if($scope.totalPossibleDraftsToBeCreated > 15000) {
          if (!confirm('WARNING: Creating '+$scope.totalPossibleDraftsToBeCreated+' possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?')) {
            return;
          }
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        var tempDrafts = [];
        var tempPlayerNamesList = [];
        //start draft building
        $scope._PPlayerPool.forEach(function(PPlayer) {
            var tempDraft = {};
            tempDraft['P'] = PPlayer;
            $scope._CPlayerPool.forEach(function(CPlayer) {
              tempDraft['C'] = CPlayer;
              $scope._1BPlayerPool.forEach(function(firstBPlayer) {
                tempDraft['1B'] = firstBPlayer;
                $scope._2BPlayerPool.forEach(function(secondBPlayer) {
                  tempDraft['2B'] = secondBPlayer;
                  $scope._3BPlayerPool.forEach(function(thirdBPlayer) {
                    tempDraft['3B'] = thirdBPlayer;
                    $scope._SSPlayerPool.forEach(function(SSPlayer) {
                      tempDraft['SS'] = SSPlayer;
                      $scope._OF1PlayerPool.forEach(function(OF1Player) {
                        tempDraft['OF1'] = OF1Player;
                        $scope._OF2PlayerPool.forEach(function(OF2Player) {
                          tempDraft['OF2'] = OF2Player;
                          $scope._OF3PlayerPool.forEach(function(OF3Player) {
                            tempDraft['OF3'] = OF3Player;

                            $scope.totalPossibleCurrentDraftsCount++;

                            var finalPlayerList = [];
                            finalPlayerList.push(tempDraft['P']);
                            finalPlayerList.push(tempDraft['C']);
                            finalPlayerList.push(tempDraft['1B']);
                            finalPlayerList.push(tempDraft['2B']);
                            finalPlayerList.push(tempDraft['3B']);
                            finalPlayerList.push(tempDraft['SS']);
                            finalPlayerList.push(tempDraft['OF1']);
                            finalPlayerList.push(tempDraft['OF2']);
                            finalPlayerList.push(tempDraft['OF3']);
                            var tempPlayerNames = [];
                            tempPlayerNames.push(tempDraft['P']._Name);
                            tempPlayerNames.push(tempDraft['C']._Name);
                            tempPlayerNames.push(tempDraft['1B']._Name);
                            tempPlayerNames.push(tempDraft['2B']._Name);
                            tempPlayerNames.push(tempDraft['3B']._Name);
                            tempPlayerNames.push(tempDraft['SS']._Name);
                            tempPlayerNames.push(tempDraft['OF1']._Name);
                            tempPlayerNames.push(tempDraft['OF2']._Name);
                            tempPlayerNames.push(tempDraft['OF3']._Name);

                            //add only valid drafts
                            if($scope.isDraftTeamValid(finalPlayerList) && $scope.isDraftSalaryValid(finalPlayerList) && !$scope.doesDraftHaveDupPlayers(finalPlayerList) && $scope.validBattersVsPitcher(finalPlayerList)) {
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
                               if(mlb.removeDups)
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
                                     if(tempPlayerNames.indexOf(tempPlayerNamesList[j][8]) !== -1) {
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

        $http.post('/MLB/buildDraft', {'builtDrafts':$scope._AllDraftData.length}).then(function successCallback(response) {

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
    $scope.validBattersVsPitcher = function(draft) {
      var battersVSPitcher = 0;
      var pitcherOpp = draft[0]._Opponent;
      draft.forEach(function (player) {
        if(player._Team === pitcherOpp) {
          battersVSPitcher++;
        }
      });
      return (battersVSPitcher <= mlb.battersVSPitcher) ? true : false;
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
        var startingSalary = 35000;
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
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(mlb.TopRange), parseFloat(mlb.BottomRange), $scope.sortTypeDraft);

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
        var startingSalary = 35000;
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
        var startingSalary = 35000;
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

        //check # of teams on this draft
        if(Object.keys(teams).length < 3) {
          return false;
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
            _PPlayerPool : $scope._PPlayerPool,
            _CPlayerPool : $scope._CPlayerPool,
            _1BPlayerPool : $scope._1BPlayerPool,
            _2BPlayerPool : $scope._2BPlayerPool,
            _3BPlayerPool : $scope._3BPlayerPool,
            _SSPlayerPool : $scope._SSPlayerPool,
            _OF1PlayerPool : $scope._OF1PlayerPool,
            _OF2PlayerPool : $scope._OF2PlayerPool,
            _OF3PlayerPool : $scope._OF3PlayerPool,
            TopRange : mlb.TopRange,
            BottomRange : mlb.BottomRange,
            TopLimit : mlb.TopLimit,
            battersVSPitcher : mlb.battersVSPitcher
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

      $http.post('/MLB/read', {'id':saveDetailsID}).then(function successCallback(response) {
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
      $http.post('/MLB/loadHistory', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
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
      $http.post('/MLB/delete', {'id':saveID}).then(function successCallback(response) {
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
      $http.post('/MLB/updateTitle', {'id':saveID, 'title': title}).then(function successCallback(response) {
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

      mlb.TopRange = parseFloat(savedData.TopRange);
      mlb.BottomRange = parseFloat(savedData.BottomRange);
      mlb.TopLimit = parseInt(savedData.TopLimit);

      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._PPlayerPool, singlePlayer, 'P');
        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer,  'C');
        $scope.loadPlayerInPool(savedData._1BPlayerPool, singlePlayer, '1B');
        $scope.loadPlayerInPool(savedData._2BPlayerPool, singlePlayer, '2B');
        $scope.loadPlayerInPool(savedData._3BPlayerPool, singlePlayer, '3B');
        $scope.loadPlayerInPool(savedData._SSPlayerPool, singlePlayer, 'SS');
        $scope.loadPlayerInPool(savedData._OF1PlayerPool, singlePlayer, 'OF1');
        $scope.loadPlayerInPool(savedData._OF2PlayerPool, singlePlayer, 'OF2');
        $scope.loadPlayerInPool(savedData._OF3PlayerPool, singlePlayer, 'OF3');
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
