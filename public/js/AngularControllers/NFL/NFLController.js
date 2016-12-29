
angular.module('NFLApp').controller('NFLController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nfl = this;

    $scope._Message = { hasData: true, messageType: "info", message: "Please Upload/Load Players..." };

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

    $scope._AllDrafts = [];
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
    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);

    //$scope._AllPlayers = positionFilter($scope._AllPlayers, $scope.SelectedPosition);

    $scope._AllPlayers = $filter('weeks')($scope._AllPlayers, $scope.SelectedWeeks);//$scope._AllPlayers | orderBy:sortType:sortReverse | position:SelectedPosition | team:SelectedTeams | weeks:SelectedWeeks;
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

    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
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
                            if(playerPosition == 'D') {
                              playerPosition = 'DST';
                            }
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
                                if (playerInjury == 'IR' || playerInjury == 'O' || playerInjury == 'NA') {
                                    playerInjury = 'danger';
                                } else if(playerInjury == 'Q' || playerInjury == 'D') {
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
                    $scope.displayNewMessage("danger", "Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
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
                    $scope.displayNewMessage("danger", "Error: _WRPlayerLocked.length > 3 || null, cannot create combinations");
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
                                $scope._AllDrafts.push(tempDraft);
                            });
                        });
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
       // console.log(validDraftData);
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
    }

    $scope.setPlayerPercentInDraft = function (player) {
        if ($scope.SelectedValidDrafts) {
            player._PercentInDrafts = (player._TimesInValidDrafts / $scope.TotalValidDrafts).toFixed(2);
        } else {
            player._PercentInDrafts = (player._TimesInDrafts / $scope.TotalPossibleDrafts).toFixed(2);
        }
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

       // console.log($scope._AllStacks);

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

    $scope.getPositions = function () {
        $http.post("/api/NFL/getPositions").then(function successCallback(response) {
            $scope._Positions = [];//clear out
            response.data.forEach(function (element) {
                $scope._Positions.push(element);
            });
        }, function errorCallBack(response) {

        });
    };

    $scope.submitProjectedCSVs = function (files) {
        var formData = new FormData();
        for (var j = 0; j < files.length; j++)
        {
            formData.append(files[j].name, files[j]);
        }

        $http.post("/api/NFL/submitProjectedCSVs", formData, {
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
    $scope.submitActualCSVs = function (files) {
        var formData = new FormData();
        for (var j = 0; j < files.length; j++)
        {
            formData.append(files[j].name, files[j]);
        }

        $http.post("/api/NFL/submitActualCSVs", formData, {
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
    $scope.getAllPlayers = function () {
        $http.post("/api/NFL/getAllPlayers").then(function successCallBack(response) {
            $scope._AllPlayers = [];
            $scope._AllPlayers = JSON.parse(response.data);
            console.log($scope._AllPlayers);
        }, function errorCallBack(response) {
            console.log(response);
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
      $scope.AVERAGE = parseFloat(savedData.AVERAGE);
      $scope.STDEVIATION = parseFloat(savedData.STDEVIATION);
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
}]);
