
angular.module('NHLApp').controller('NHLController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nfl = this;

    $scope._Message = { hasData: true, messageType: "info", message: "Please Upload/Load Players..." };

    $scope._Positions = [];
    $scope._AllTeams = [];
    $scope._AllWeeks = [];
    $scope._AllPlayersMASTER = [];
    $scope._AllPlayers = [];
    $scope._AllReadPlayerIDs = [];
    $scope._AllStacks = [];

    $scope._CPlayerLocked = [];
    $scope._WPlayerLocked = [];
    $scope._DPlayerLocked = [];
    $scope._GPlayerLocked = [];

    $scope._CPlayerPool = [];
    $scope._WPlayerPool = [];
    $scope._DPlayerPool = [];
    $scope._GPlayerPool = [];

    $scope._AllDrafts = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = false;

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = false;
    $scope.SelectedPosition = '';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;

    $scope.savedPastSettings = [];
    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);
    $scope.TopRange = -1;
    $scope.BottomRange = -1;

    //$scope._AllPlayers = positionFilter($scope._AllPlayers, $scope.SelectedPosition);

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
        $scope._Message.message = "";
        $scope._Message.hasData = true;
        $scope._Message.messageType = messageType;
        $scope._Message.message = messageContent;
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



    $scope.loadPlayers = function (file) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');


            for (var i = 1; i < allTextLines.length; i++) {
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
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0:
                            playerID = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 1:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 2:
                            playerFName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            break;
                        case 4:
                            playerLName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            break;
                        case 5:
                            playerFPPG = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            playerFPPG = parseFloat(playerFPPG.toFixed(2));
                            break;
                        case 7:
                            playerSalary = parseInt(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 8:
                            playerGame = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 9:
                            playerTeam = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 10:
                            playerOpponent = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 11:
                            if (data[j].replace('"', '').replace('"', '').trim().length > 0) {
                                playerInjury = data[j].replace('"', '').replace('"', '').trim();
                                if (playerInjury == 'O' || playerInjury == 'IR') {
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
                var pointsPerDollar = parseFloat((playerFPPG / playerSalary).toFixed(5));
                var playerRead = { playerID: playerID, _Position: playerPosition, _Name: playerFName + " " + playerLName, _FPPG: playerFPPG, _ActualFantasyPoints: -1, _Team: playerTeam, _Opponent: playerOpponent, _Salary: playerSalary, _ProjectedPointsPerDollar: pointsPerDollar, _playerInjured: playerInjury, _playerInjuryDetails: playerInjuryDetails, _Game: playerGame, _PercentInDrafts: -1, _TimesInDrafts: 0, _TimesInValidDrafts: 0 };
                $scope._AllPlayers.push(playerRead);
                $scope._AllPlayersMASTER.push(playerRead);

                //add team data
                if ($scope._AllTeams.length == 0) {
                    $scope._AllTeams.push(playerRead._Team);
                } else if ($scope._AllTeams.indexOf(playerRead._Team) == -1) {
                    $scope._AllTeams.push(playerRead._Team);
                }

            }

            $scope.displayNewMessage("info", "Players have been successfully loaded");
        }
        reader.readAsText(file[0]);
    }

    // $scope.$watch('AVERAGE',function(val,old){
    //    $scope.AVERAGE = parseFloat(val);
    //    $scope.TopRange = ($scope.AVERAGE + $scope.STDEVIATION);
    //    $scope.BottomRange = ($scope.AVERAGE - $scope.STDEVIATION);
    // });
    // $scope.$watch('STDEVIATION',function(val,old){
    //    $scope.STDEVIATION = parseFloat(val);
    //    $scope.TopRange = ($scope.AVERAGE + $scope.STDEVIATION);
    //    $scope.BottomRange = ($scope.AVERAGE - $scope.STDEVIATION);
    // });
    $scope.parseFloat = function(value)
    {
       return parseFloat(value);
    }
    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
      $scope._AllTeams = [];
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

        var anchor = angular.element('<a/>');
        anchor.css({ display: 'none' }); // Make sure it's not visible
        angular.element(document.body).append(anchor); // Attach to document

        var CSVName = "";
        $scope._AllTeams.forEach(function (team) {
          if(CSVName.length == 0) {
            CSVName = "NHL_"+team;
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

    $scope.lockAndUnLockPlayer = function (player)
    {
        if ($scope.playerInPool(player)) {
            switch (player._Position) {
                case 'C':
                    if ($scope._CPlayerLocked.indexOf(player) == -1) {
                        if ($scope._CPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: cannot lock more than 2 C's");
                            return;
                        }
                        $scope._CPlayerLocked.push(player);
                    } else {
                        $scope._CPlayerLocked.splice($scope._CPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'W':
                    if ($scope._WPlayerLocked.indexOf(player) == -1)
                    {
                        if ($scope._WPlayerLocked.length >= 4) {
                            $scope.displayNewMessage("danger", "Error: cannot lock more than 4 W's");
                            return;
                        }
                        $scope._WPlayerLocked.push(player);
                    }
                    else
                    {
                        $scope._WPlayerLocked.splice($scope._WPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'D':
                    if ($scope._DPlayerLocked.indexOf(player) == -1) {
                        if ($scope._DPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: cannot lock more than 2 D's");
                            return;
                        }
                        $scope._DPlayerLocked.push(player);
                    } else {
                        $scope._DPlayerLocked.splice($scope._DPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'G':
                    if ($scope._GPlayerLocked.indexOf(player) == -1) {
                        if ($scope._GPlayerLocked.length >= 1) {
                            $scope.displayNewMessage("danger", "Error: _SFPlayerLocked.length >= 2, cannot lock more than 1 G's");
                            return;
                        }
                        $scope._GPlayerLocked.push(player);
                    } else {
                        $scope._GPlayerLocked.splice($scope._GPlayerLocked.indexOf(player), 1);
                    }
                    break;
            }
        }
    }
    $scope.unLockPlayer = function (player) {
        switch (player._Position) {
            case 'C':
                if ($scope._CPlayerLocked.indexOf(player) > -1) {
                    $scope._CPlayerLocked.splice($scope._CPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'W':
                if ($scope._WPlayerLocked.indexOf(player) > -1) {
                    $scope._WPlayerLocked.splice($scope._WPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'D':
                if ($scope._DPlayerLocked.indexOf(player) > -1) {
                    $scope._DPlayerLocked.splice($scope._DPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'G':
                if ($scope._GPlayerLocked.indexOf(player) > -1) {
                    $scope._GPlayerLocked.splice($scope._GPlayerLocked.indexOf(player), 1);
                }
                break;
        }
    }
    $scope.removePlayerFromPool = function (player)
    {
        switch (player._Position)
        {
            case 'C':
                $scope.unLockPlayer(player);
                $scope._CPlayerPool.splice($scope._CPlayerPool.indexOf(player), 1);
                break;
            case 'W':
                $scope.unLockPlayer(player);
                $scope._WPlayerPool.splice($scope._WPlayerPool.indexOf(player), 1);
                break;
            case 'D':
                $scope.unLockPlayer(player);
                $scope._DPlayerPool.splice($scope._DPlayerPool.indexOf(player), 1);
                break;
            case 'G':
                $scope.unLockPlayer(player);
                $scope._GPlayerPool.splice($scope._GPlayerPool.indexOf(player), 1);
                break;
        }
    }

    $scope.addPlayerToPool = function (player)
    {
        if (!$scope.playerInPool(player))
        {
            switch (player._Position)
            {
                case 'C':
                    $scope._CPlayerPool.push(player);
                    break;
                case 'W':
                    $scope._WPlayerPool.push(player);
                    break;
                case 'D':
                    $scope._DPlayerPool.push(player);
                    break;
                case 'G':
                    $scope._GPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player)
    {
        switch (player._Position)
        {
            case 'C':
                if ($scope._CPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'W':
                if ($scope._WPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'D':
                if ($scope._DPlayerPool.indexOf(player) > -1)
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
        $scope._PGPlayerPool = [];
        $scope._SGPlayerPool = [];
        $scope._SFPlayerPool = [];
        $scope._PFPlayerPool = [];
        $scope._CPlayerPool = [];

        $scope._PGPlayerLocked = [];
        $scope._SGPlayerLocked = [];
        $scope._SFPlayerLocked = [];
        $scope._PFPlayerLocked = [];
        $scope._CPlayerLocked = [];
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
        var indexOfDraftToRemove = $scope._AllDraftData.indexOf(draft);
        $scope._AllDraftData.splice(indexOfDraftToRemove, 1);

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
        if ( $scope._CPlayerPool.length == 0 || $scope._WPlayerPool.length == 0 || $scope._DPlayerPool.length == 0 || $scope._GPlayerPool.length == 0 ) {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        //C
        var CCombinations = [];
        if ($scope._CPlayerLocked.length > 0) {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._CPlayerPool.forEach(function (player) {
                if ($scope._CPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._CPlayerLocked.length) {
                case 0:
                    CCombinations = $scope.getCombinations($scope._CPlayerPool, 2);
                    break;
                case 1:
                    CCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    CCombinations = $scope.getCombinations($scope._CPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: _CPlayerLocked.length > 2 || null, cannot create combinations");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else {
            //no locked players
            CCombinations = $scope.getCombinations($scope._CPlayerPool, 2);
            // console.log("RB Combos: ", RBCombinations);
        }

        //W
        var WCombinations = [];
        if ($scope._WPlayerLocked.length > 0)
        {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._WPlayerPool.forEach(function (player) {
                if ($scope._WPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._WPlayerLocked.length) {
                case 0:
                    WCombinations = $scope.getCombinations($scope._WPlayerPool, 4);
                    break;
                case 1:
                    WCombinations = $scope.getCombinations(unLockedPlayersInPool, 3);
                    break;
                case 2:
                    WCombinations = $scope.getCombinations(unLockedPlayersInPool, 2);
                    break;
                case 3:
                    WCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 4:
                    WCombinations = $scope.getCombinations($scope._WPlayerLocked, 4);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: _WPlayerLocked.length > 4 || null, cannot create combinations");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else
        {
            //no locked players
            WCombinations = $scope.getCombinations($scope._WPlayerPool, 4);
           // console.log("RB Combos: ", RBCombinations);
        }

        //D
        var DCombinations = [];
        if ($scope._DPlayerLocked.length > 0) {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._DPlayerPool.forEach(function (player) {
                if ($scope._DPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._DPlayerLocked.length) {
                case 0:
                    DCombinations = $scope.getCombinations($scope._DPlayerPool, 2);
                    break;
                case 1:
                    DCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    DCombinations = $scope.getCombinations($scope._DPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: _SGPlayerLocked.length > 2 || null, cannot create combinations");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else {
            //no locked players
            DCombinations = $scope.getCombinations($scope._DPlayerPool, 2);
            // console.log("RB Combos: ", RBCombinations);
        }

        //G
        var GCombinations = [];
        GCombinations = $scope.getCombinations($scope._GPlayerPool, 1);

        //start draft building
        //C
        CCombinations.forEach(function (CCombo) {
            var tempDraft = [];
            switch ($scope._CPlayerLocked.length) {
                case 0:
                    tempDraft.push(CCombo[0]);
                    tempDraft.push(CCombo[1]);
                    break;
                case 1:
                    tempDraft.push($scope._CPlayerLocked[0]);
                    tempDraft.push(CCombo[0]);
                    break;
                case 2:
                    tempDraft.push($scope._CPlayerLocked[0]);
                    tempDraft.push($scope._CPlayerLocked[1]);
                    break;
            }

            //W
            WCombinations.forEach(function (WCombo) {
                tempDraft = $filter('removePosition')(tempDraft, 'W');
                switch ($scope._WPlayerLocked.length) {
                    case 0:
                        tempDraft.push(WCombo[0]);
                        tempDraft.push(WCombo[1]);
                        tempDraft.push(WCombo[2]);
                        tempDraft.push(WCombo[3]);
                        break;
                    case 1:
                        tempDraft.push($scope._WPlayerLocked[0]);
                        tempDraft.push(WCombo[0]);
                        tempDraft.push(WCombo[1]);
                        tempDraft.push(WCombo[2]);
                        break;
                    case 2:
                        tempDraft.push($scope._WPlayerLocked[0]);
                        tempDraft.push($scope._WPlayerLocked[1]);
                        tempDraft.push(WCombo[0]);
                        tempDraft.push(WCombo[1]);
                        break;
                    case 3:
                        tempDraft.push($scope._WPlayerLocked[0]);
                        tempDraft.push($scope._WPlayerLocked[1]);
                        tempDraft.push($scope._WPlayerLocked[2]);
                        tempDraft.push(WCombo[0]);
                        break;
                    case 4:
                        tempDraft.push($scope._WPlayerLocked[0]);
                        tempDraft.push($scope._WPlayerLocked[1]);
                        tempDraft.push($scope._WPlayerLocked[2]);
                        tempDraft.push($scope._WPlayerLocked[3]);
                        break;
                }
                //D
                DCombinations.forEach(function (DCombo) {
                    tempDraft = $filter('removePosition')(tempDraft, 'D');
                    switch ($scope._DPlayerLocked.length) {
                        case 0:
                            tempDraft.push(DCombo[0]);
                            tempDraft.push(DCombo[1]);
                            break;
                        case 1:
                            tempDraft.push($scope._DPlayerLocked[0]);
                            tempDraft.push(DCombo[0]);
                            break;
                        case 2:
                            tempDraft.push($scope._DPlayerLocked[0]);
                            tempDraft.push($scope._DPlayerLocked[1]);
                            break;
                    }
                    //G
                    GCombinations.forEach(function (G) {
                        tempDraft = $filter('removePosition')(tempDraft, 'G');
                        tempDraft.push(G[0]);
                        $scope._AllDrafts.push(tempDraft);
                    });
                });
            });
        });

        $scope.TotalPossibleDrafts = $scope._AllDrafts.length;
        $scope._AllDrafts.forEach(function (draft) {
            var tempDataObj = { projection: parseFloat($scope.getDraftProjection(draft)), actual: parseFloat($scope.getDraftActual(draft)), validTeam: $scope.isDraftTeamValid(draft), validSalary: $scope.isDraftSalaryValid(draft), players: draft, displayDetails: false };
            $scope._AllDraftData.push(tempDataObj);
            draft.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
            });


        });

        var validDraftData = $filter('checkValidOnly')($scope._AllDraftData, true);
        $scope.TotalValidDrafts = validDraftData.length;

        validDraftData.forEach(function (draftData) {
            draftData.players.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
            });
        });

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });

    }

    $scope.switchValidDraftSelector = function () {
        $scope.SelectedValidDrafts = !$scope.SelectedValidDrafts;
        $scope.buildDrafts();
    }

    $scope.setPlayerPercentInDraft = function (player) {
        if ($scope.SelectedValidDrafts) {
            player._PercentInDrafts = ((player._TimesInValidDrafts / $scope.TotalValidDrafts) * 100 ).toFixed(0);
        } else {
            player._PercentInDrafts = ((player._TimesInDrafts / $scope.TotalPossibleDrafts) * 100 ).toFixed(0);
        }
    }

    $scope.removeCalcDrafts = function (AVERAGE, STDEVIATION) {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(AVERAGE), parseFloat(STDEVIATION));

        $scope.AVERAGE = parseFloat(AVERAGE);
        $scope.STDEVIATION = parseFloat(STDEVIATION);

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

    }

    $scope.getDraftProjection = function (draft) {
        var totalProjection = 0;
        draft.forEach(function (player) {
            totalProjection = totalProjection + player._FPPG;
        });
        totalProjection = parseFloat(totalProjection);
        return totalProjection.toFixed(2);
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
    $scope.openSaveDialog = function () {
        $scope.savedPastSettings = [];

        var postObject = {
    				_AllPlayers : $scope._AllPlayers,
    				_CPlayerLocked : $scope._CPlayerLocked,
    				_WPlayerLocked : $scope._WPlayerLocked,
            _DPlayerLocked : $scope._DPlayerLocked,
            _GPlayerLocked : $scope._GPlayerLocked,
            _CPlayerPool : $scope._CPlayerPool,
            _WPlayerPool : $scope._WPlayerPool,
            _DPlayerPool : $scope._DPlayerPool,
            _GPlayerPool : $scope._GPlayerPool,
            AVERAGE : $scope.AVERAGE,
            STDEVIATION : $scope.STDEVIATION
    		};
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/saveDialog.html',
            controller: 'SaveModalController',
            size: 'lg',
            resolve: {
                postObject: function () {
                    return postObject;
                }
            }
        });
    }

    $scope.loadSavedSettings = function(saveDetailsID) {

      $http.post('/NHL/loadSavedSettings', {'id':saveDetailsID}).then(function successCallback(response) {
          var jsonData = JSON.parse(response.data['userSaveJSON']);

          $scope.loadPlayersFromSave(jsonData);

      }, function errorCallBack(response) {
        console.log("errror");
      });

    }
    $scope.loadSavedSettingsDetails = function() {
      $http.post('/NHL/loadSavedSettingsDetails', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        console.log("errror");
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


      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;
      $scope.AVERAGE = parseFloat(savedData.AVERAGE);
      $scope.STDEVIATION = parseFloat(savedData.STDEVIATION);
      $scope._AllPlayers.forEach(function(singlePlayer) {

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._WPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._DPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._GPlayerPool, singlePlayer);

        $scope.loadPlayerInLocked(savedData._CPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._WPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._DPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._GPlayerLocked, singlePlayer);
      });

      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }



    $scope.isDraftSalaryValid = function (draft) {
        var startingSalary = 55000;
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
    $scope.clearAllPlayerFilters = function () {
        $scope.SelectedTeams = [];
        $scope.SelectedWeeks = [];
        $scope.SelectedWeeks.push($scope._AllWeeks[0]);
    }

}]);
