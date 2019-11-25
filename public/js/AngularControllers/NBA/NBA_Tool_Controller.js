angular.module('NBAApp').controller('NBAToolController', [ '$scope', '$filter', '$uibModal', '$window', function ($scope, $filter, $uibModal, $window) {
    var nba = this;

    $scope.alerts = [
      { type: 'info', msg: 'Please Upload/Load Players...', number: 1 }
    ];

    $scope.AllPlayers = [];
    $scope.AllTeams = [];
    $scope.Title =  "Main"
    $scope.Date = new Date()
    $scope.savedPastSettings = [];

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
        if(alert.type === type && alert.msg === message) {
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

    $scope.loadProjections = function(event) {
      var file = event.target.files[0];
        $scope.clearData();
        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            for(var i = 1; i < allTextLines.length; i++) {
              var headers = allTextLines[i].split(',');
              var PlayerName = "";
              var PlayerTeam = "";
              var PlayerMinutes = 0;
              var PlayerPoints = 0;
              var PlayerThrees = 0;
              var PlayerRebounds = 0;
              var PlayerAssists = 0;
              var PlayerSteals = 0;
              var PlayerBlocks = 0;
              var PlayerTurnovers = 0;

              for (var j = 0; j < headers.length; j++) {
                  switch (j) {
                    case 0:
                        PlayerName = headers[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim().toLowerCase();
                        break;
                    case 1:
                        PlayerTeam = headers[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                        break;
                    case 2:
                        PlayerMinutes = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 3:
                        PlayerPoints = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 4:
                        PlayerThrees = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 5:
                        PlayerRebounds = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 6:
                        PlayerAssists = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 7:
                        PlayerSteals = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 8:
                        PlayerBlocks = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                    case 9:
                        PlayerTurnovers = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                        break;
                  }
              }

              var PlayerFDPoints = ((PlayerPoints * 1) + (PlayerRebounds * 1.2) + (PlayerAssists * 1.5) + (PlayerSteals * 3) + (PlayerBlocks * 3) + (PlayerTurnovers * -1));
              var PlayerPerMinFDPoints = 0;
              if(PlayerMinutes !== 0) {
                PlayerPerMinFDPoints = PlayerFDPoints / PlayerMinutes;
              }


              $scope.AllPlayers.push({
                PlayerName : PlayerName,
                PlayerTeam : PlayerTeam,
                PlayerOpp : "",
                PlayerMinutes : PlayerMinutes,
                PlayerPoints : PlayerPoints,
                PlayerThrees : PlayerThrees,
                PlayerRebounds : PlayerRebounds,
                PlayerAssists : PlayerAssists,
                PlayerSteals : PlayerSteals,
                PlayerBlocks : PlayerBlocks,
                PlayerTurnovers : PlayerTurnovers,
                PlayerFDPoints : PlayerFDPoints,
                PlayerPerMinFDPoints : PlayerPerMinFDPoints,
                PlayerPerMinFDPointsCopy : PlayerPerMinFDPoints,
                PlayerPosition : "",
                PlayerOwnership : 0,
                PlayerSalary : 0,
                AdjustedOwnership : 0,
                Over : 0
              });
            }
        }

        $scope.$apply(function() {
          $scope.displayNewMessage("success", "Player projections file loaded succesfully");
        });

        reader.readAsText(file);
    }

    $scope.loadOwnership = function (event) {

      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');

            var playersNotFound = [];
            var playersInFile = [];
            for (var i = 1; i < allTextLines.length; i++) {
                if(allTextLines[i].length === 0) {
                  continue;
                }
                var data = allTextLines[i].split(',');

                var PlayerName = "";
                var PlayerSalary = 0;
                var PlayerPosition = "";
                var PlayerTeam = "";
                var PlayerOpp = "";
                var PlayerOwnership = 0;

                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0:
                            PlayerName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim().toLowerCase();
                            break;
                        case 1:
                            PlayerSalary = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 2:
                            PlayerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 4:
                            PlayerTeam = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 5:
                            PlayerOpp = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 6:
                            PlayerOwnership = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                    }
                }

                $scope.AllPlayers.forEach(function (player) {
                    if(player.PlayerName ===  PlayerName) {
                        player.PlayerSalary = PlayerSalary;
                        player.PlayerPosition = PlayerPosition;
                        player.PlayerTeam = PlayerTeam;
                        player.PlayerOpp = PlayerOpp;
                        player.PlayerOwnership = PlayerOwnership;
                        player.PlayerValue = (((player.PlayerPerMinFDPoints * player.PlayerMinutes) / player.PlayerSalary) * 1000);
                    }
                    if(!$scope.AllTeams.includes(PlayerTeam)) {
                      $scope.AllTeams.push(PlayerTeam);
                    }
                });



            }
            $scope.$apply(function() {
              $scope.displayNewMessage("success", "Ownership Data has been successfully loaded.");
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

    $scope.calcPositionMins = function(team, position) {
      var sumMin = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerTeam ===  team && player.PlayerPosition === position) {
            sumMin += player.PlayerMinutes;
          }
      });
      return sumMin;
    }
    $scope.calcMins = function(team) {
      var sumMin = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerTeam ===  team ) {
            sumMin += player.PlayerMinutes;
          }
      });
      return sumMin;
    }

    $scope.getMaxValue = function() {
      var currentMax = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerValue > currentMax) {
            currentMax = player.PlayerValue;
          }
      });
      return currentMax;
    }
    $scope.getMaxOwnership = function() {
      var currentMax = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerOwnership > currentMax) {
            currentMax = player.PlayerOwnership;
          }
      });
      return currentMax;
    }
    $scope.getMaxOwnershipPosition = function(position) {
      var currentMax = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerOwnership > currentMax && player.PlayerPosition === position) {
            currentMax = player.PlayerOwnership;
          }
      });
      return currentMax;
    }
    $scope.updatePlayerMinutes = function(playerName) {
      $scope.AllPlayers.forEach(function (player) {
          if(player.PlayerName === playerName) {
            player.PlayerValue = (((player.PlayerPerMinFDPoints * player.PlayerMinutes) / player.PlayerSalary) * 1000);
          }
      });
    }

    $scope.clearData = function() {
      $scope.Title = "Main";
      $scope.Date  = new Date()
      $scope.AllPlayers = [];
      $scope.AllTeams = [];
    }

    $scope.save = function() {
      $scope.Title = $scope.uuidv4();
      mainObj = {
        Title : $scope.Title,
        Date : $scope.Date,
        AllPlayers : $scope.AllPlayers,
        AllTeams : $scope.AllTeams
      }
      localStorage.setItem("DFSCOMBINE_" + $scope.Title, JSON.stringify(mainObj));
    }

    $scope.read = function(title) {
      $scope.savedPastSettings.forEach(function(singleSetting) {
        if(singleSetting.Title === title) {
          $scope.Title = singleSetting.Title;
          $scope.Date = Date.parse(singleSetting.Date);
          $scope.AllPlayers = singleSetting.AllPlayers;
          $scope.AllTeams = singleSetting.AllTeams;
        }
      });
      // for(var singleSetting in $scope.savedPastSettings) {
      //   if(singleSetting.Title === title) {
      //     $scope.Title = singleSetting.Title;
      //     $scope.Date = singleSetting.Date;
      //     $scope.AllPlayers = singleSetting.AllPlayers;
      //     $scope.AllTeams = singleSetting.AllTeams;
      //   }
      // }
    }

    $scope.loadPastSettings = function() {
      $scope.savedPastSettings = [];
      for(var i in localStorage) {
        if(i.includes("DFSCOMBINE")) {
          $scope.savedPastSettings.push(JSON.parse(localStorage[i]));
        }
        //console.log(localStorage[i]);
      }
    }


    $scope.ModifyAdjustedOwnership = function(player) {
      if(player.Over === undefined || player.Over === "" || player.Over === "-") {
        player.AdjustedOwnership = player.PlayerOwnership;
      }
      else {
        // var value = 100/player.PlayerOwnership;
        if(parseFloat(player.Over) < -100) {
          player.Over = -100;
        }
        var adjustment = 100 + parseFloat(player.Over);
        player.AdjustedOwnership = player.PlayerOwnership * (adjustment*0.01);
      }
    }
    $scope.getMaxAdjustedOwnershipPosition = function(position) {
      var currentMax = 0;
      $scope.AllPlayers.forEach(function (player) {
          if(player.AdjustedOwnership > currentMax && player.PlayerPosition === position) {
            currentMax = player.AdjustedOwnership;
          }
      });
      return currentMax;
    }
    $scope.uuidv4 = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    $scope.getGradientColor = function(min, max, number) {
        // strip the leading # if it's there

        var percent = number / max;

       end_color = "7FFF00";//green
       start_color = "FF0000";//red

       // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
       if(start_color.length == 3){
         start_color = start_color.replace(/(.)/g, '$1$1');
       }

       if(end_color.length == 3){
         end_color = end_color.replace(/(.)/g, '$1$1');
       }

       // get colors
       var start_red = parseInt(start_color.substr(0, 2), 16),
           start_green = parseInt(start_color.substr(2, 2), 16),
           start_blue = parseInt(start_color.substr(4, 2), 16);

       var end_red = parseInt(end_color.substr(0, 2), 16),
           end_green = parseInt(end_color.substr(2, 2), 16),
           end_blue = parseInt(end_color.substr(4, 2), 16);

       // calculate new color
       var diff_red = end_red - start_red;
       var diff_green = end_green - start_green;
       var diff_blue = end_blue - start_blue;

       diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
       diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
       diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

       // ensure 2 digits by color
       if( diff_red.length == 1 ) diff_red = '0' + diff_red
       if( diff_green.length == 1 ) diff_green = '0' + diff_green
       if( diff_blue.length == 1 ) diff_blue = '0' + diff_blue

       return '#' + diff_red + diff_green + diff_blue;
    }

}]);
