angular.module('MLBApp').controller('MLBController', ['$http', '$scope', '$filter', '$uibModal', '$window', '$location', function ($http, $scope, $filter, $uibModal, $window, $location) {
    var mlb = this;

    $scope.alerts = [
      { type: 'info', msg: 'Loading Players....', number: 1 }
    ];

    $scope.Positions = [];
    $scope.AllPlayersMASTER = [];
    $scope.AllPlayers = [];
    $scope.AllTeams = [];
    $scope.Games = [];

    $scope.Number_Simulations = 50000;
    $scope.League_Regression = 100;
    $scope.Recent_Hitter_Regression = 15;
    $scope.Recent_Pitcher_Regression = 20;
    $scope.Auto_Match_Vegas = false;

    var compareNumbers = function(a, b) {
        return b-a;
    }
    //Set date from global date object set in the view
    $scope.Date = new Date(DateObj.Date);
    $scope.Past_Date = new Date(DateObj.Past_Date);
    $scope.Next_Date = new Date(DateObj.Next_Date);
    $scope.Updated_Date = new Date(DateObj.Updated_Date);
    $scope.Date = new Date($scope.Date.setDate($scope.Date.getDate() + 1));
    $scope.Past_Date = new Date($scope.Past_Date.setDate($scope.Past_Date.getDate() + 1));
    $scope.Next_Date = new Date($scope.Next_Date.setDate($scope.Next_Date.getDate() + 1));

    $scope.worker = new Worker('js/AngularControllers/MLBSIM/worker.js');
    console.log($scope.Updated_Date);

    $scope.GetStringDate = function(Date) {
      var Year = Date.getFullYear();
      var Month = Date.getMonth();
      Month++;
      var Day = Date.getDate();
      if(Day < 10) {
        Day = 0+''+Day;
      }
      if(Month < 10) {
        Month = 0+''+Month;
      }
      return Year+'-'+Month+'-'+Day;
    }

    $scope.timeSince = function(date) {
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval >= 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
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



    $scope.End_All_Simulations = function() {
      $scope.worker.terminate();
      $scope.worker = new Worker('js/AngularControllers/MLBSIM/worker.js');
      $scope.Sim_Building = false;
      $scope.Games.forEach(function(game) {
        game.Sim_Building = false;
      });
    }
    $scope.loadPlayers = function (event) {

      var yyyy = $scope.Date.getFullYear();
      var dd = $scope.Date.getDate();
      var mm = $scope.Date.getMonth()+1;
      if(dd<10)
      {
          dd='0'+dd;
      }

      if(mm<10)
      {
          mm='0'+mm;
      }

      var formData = new FormData();
      formData.append('Date', yyyy+"-"+mm+"-"+dd);

      $http.post("/MLBSimGetPlayers", formData, {
          headers: {
              "Content-Type": undefined,
              transformRequest: angular.identity
          }
      }).then(function successCallBack(response) {
          response.data.forEach(function(player) {

            player.Vegas_Runs = parseFloat(player.Vegas_Runs);

            player.H_PA = parseFloat(player.H_PA);
            player.Single_H = parseFloat(player.Single_H);
            player.Double_H = parseFloat(player.Double_H);
            player.Triple_H = parseFloat(player.Triple_H);
            player.HR_H = parseFloat(player.HR_H);
            player.SB_PA = parseFloat(player.SB_PA);
            player.SO_PA = parseFloat(player.SO_PA);
            player.SF_PA = parseFloat(player.SF_PA);
            player.HBP_PA = parseFloat(player.HBP_PA);
            player.BB_PA = parseFloat(player.BB_PA);

            player.H_PA_VS_L = parseFloat(player.H_PA_VS_L);
            player.Single_H_VS_L = parseFloat(player.Single_H_VS_L);
            player.Double_H_VS_L = parseFloat(player.Double_H_VS_L);
            player.Triple_H_VS_L = parseFloat(player.Triple_H_VS_L);
            player.HR_H_VS_L = parseFloat(player.HR_H_VS_L);
            player.SB_PA_VS_L = parseFloat(player.SB_PA_VS_L);
            player.SO_PA_VS_L = parseFloat(player.SO_PA_VS_L);
            player.SF_PA_VS_L = parseFloat(player.SF_PA_VS_L);
            player.HBP_PA_VS_L = parseFloat(player.HBP_PA_VS_L);
            player.BB_PA_VS_L = parseFloat(player.BB_PA_VS_L);
            player.Total_PA_VS_L  = parseInt(player.Total_PA_VS_L);
            player.Total_H_VS_L  = parseInt(player.Total_H_VS_L);

            if(isNaN(player.H_PA_VS_L)) {
              player.H_PA_VS_L = 0;
            }
            if(isNaN(player.Single_H_VS_L)) {
              player.Single_H_VS_L = 0;
            }
            if(isNaN(player.Double_H_VS_L)) {
              player.Double_H_VS_L = 0;
            }
            if(isNaN(player.Triple_H_VS_L)) {
              player.Triple_H_VS_L = 0;
            }
            if(isNaN(player.HR_H_VS_L)) {
              player.HR_H_VS_L = 0;
            }
            if(isNaN(player.SB_PA_VS_L)) {
              player.SB_PA_VS_L = 0;
            }
            if(isNaN(player.SO_PA_VS_L)) {
              player.SO_PA_VS_L = 0;
            }
            if(isNaN(player.SF_PA_VS_L)) {
              player.SF_PA_VS_L = 0;
            }
            if(isNaN(player.HBP_PA_VS_L)) {
              player.HBP_PA_VS_L = 0;
            }
            if(isNaN(player.BB_PA_VS_L)) {
              player.BB_PA_VS_L = 0;
            }
            if(isNaN(player.Total_PA_VS_L)) {
              player.Total_PA_VS_L = 1;
            }
            if(isNaN(player.Total_H_VS_L)) {
              player.Total_H_VS_L = 1;
            }

            player.H_PA_VS_L_Recent = parseFloat(player.H_PA_VS_L_Recent);
            player.Single_H_VS_L_Recent = parseFloat(player.Single_H_VS_L_Recent);
            player.Double_H_VS_L_Recent = parseFloat(player.Double_H_VS_L_Recent);
            player.Triple_H_VS_L_Recent = parseFloat(player.Triple_H_VS_L_Recent);
            player.HR_H_VS_L_Recent = parseFloat(player.HR_H_VS_L_Recent);
            player.SB_PA_VS_L_Recent = parseFloat(player.SB_PA_VS_L_Recent);
            player.SO_PA_VS_L_Recent = parseFloat(player.SO_PA_VS_L_Recent);
            player.SF_PA_VS_L_Recent = parseFloat(player.SF_PA_VS_L_Recent);
            player.HBP_PA_VS_L_Recent = parseFloat(player.HBP_PA_VS_L_Recent);
            player.BB_PA_VS_L_Recent = parseFloat(player.BB_PA_VS_L_Recent);
            player.Total_PA_VS_L_Recent  = parseInt(player.Total_PA_VS_L_Recent);
            player.Total_H_VS_L_Recent  = parseInt(player.Total_H_VS_L_Recent);

            if(isNaN(player.H_PA_VS_L_Recent)) {
              player.H_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.Single_H_VS_L_Recent)) {
              player.Single_H_VS_L_Recent = 0;
            }
            if(isNaN(player.Double_H_VS_L_Recent)) {
              player.Double_H_VS_L_Recent = 0;
            }
            if(isNaN(player.Triple_H_VS_L_Recent)) {
              player.Triple_H_VS_L_Recent = 0;
            }
            if(isNaN(player.HR_H_VS_L_Recent)) {
              player.HR_H_VS_L_Recent = 0;
            }
            if(isNaN(player.SB_PA_VS_L_Recent)) {
              player.SB_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.SO_PA_VS_L_Recent)) {
              player.SO_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.SF_PA_VS_L_Recent)) {
              player.SF_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.HBP_PA_VS_L_Recent)) {
              player.HBP_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.BB_PA_VS_L_Recent)) {
              player.BB_PA_VS_L_Recent = 0;
            }
            if(isNaN(player.Total_PA_VS_L_Recent)) {
              player.Total_PA_VS_L_Recent = 1;
            }
            if(isNaN(player.Total_H_VS_L_Recent)) {
              player.Total_H_VS_L_Recent = 1;
            }

            player.H_PA_VS_R = parseFloat(player.H_PA_VS_R);
            player.Single_H_VS_R = parseFloat(player.Single_H_VS_R);
            player.Double_H_VS_R = parseFloat(player.Double_H_VS_R);
            player.Triple_H_VS_R = parseFloat(player.Triple_H_VS_R);
            player.HR_H_VS_R = parseFloat(player.HR_H_VS_R);
            player.SB_PA_VS_R = parseFloat(player.SB_PA_VS_R);
            player.SO_PA_VS_R = parseFloat(player.SO_PA_VS_R);
            player.SF_PA_VS_R = parseFloat(player.SF_PA_VS_R);
            player.HBP_PA_VS_R = parseFloat(player.HBP_PA_VS_R);
            player.BB_PA_VS_R = parseFloat(player.BB_PA_VS_R);
            player.Total_PA_VS_R  = parseInt(player.Total_PA_VS_R);
            player.Total_H_VS_R  = parseInt(player.Total_H_VS_R);

            if(isNaN(player.H_PA_VS_R)) {
              player.H_PA_VS_R = 0;
            }
            if(isNaN(player.Single_H_VS_R)) {
              player.Single_H_VS_R = 0;
            }
            if(isNaN(player.Double_H_VS_R)) {
              player.Double_H_VS_R = 0;
            }
            if(isNaN(player.Triple_H_VS_R)) {
              player.Triple_H_VS_R = 0;
            }
            if(isNaN(player.HR_H_VS_R)) {
              player.HR_H_VS_R = 0;
            }
            if(isNaN(player.SB_PA_VS_R)) {
              player.SB_PA_VS_R = 0;
            }
            if(isNaN(player.SO_PA_VS_R)) {
              player.SO_PA_VS_R = 0;
            }
            if(isNaN(player.SF_PA_VS_R)) {
              player.SF_PA_VS_R = 0;
            }
            if(isNaN(player.HBP_PA_VS_R)) {
              player.HBP_PA_VS_R = 0;
            }
            if(isNaN(player.BB_PA_VS_R)) {
              player.BB_PA_VS_R = 0;
            }
            if(isNaN(player.Total_PA_VS_R)) {
              player.Total_PA_VS_R = 1;
            }
            if(isNaN(player.Total_H_VS_R)) {
              player.Total_H_VS_R = 1;
            }


            player.H_PA_VS_R_Recent = parseFloat(player.H_PA_VS_R_Recent);
            player.Single_H_VS_R_Recent = parseFloat(player.Single_H_VS_R_Recent);
            player.Double_H_VS_R_Recent = parseFloat(player.Double_H_VS_R_Recent);
            player.Triple_H_VS_R_Recent = parseFloat(player.Triple_H_VS_R_Recent);
            player.HR_H_VS_R_Recent = parseFloat(player.HR_H_VS_R_Recent);
            player.SB_PA_VS_R_Recent = parseFloat(player.SB_PA_VS_R_Recent);
            player.SO_PA_VS_R_Recent = parseFloat(player.SO_PA_VS_R_Recent);
            player.SF_PA_VS_R_Recent = parseFloat(player.SF_PA_VS_R_Recent);
            player.HBP_PA_VS_R_Recent = parseFloat(player.HBP_PA_VS_R_Recent);
            player.BB_PA_VS_R_Recent = parseFloat(player.BB_PA_VS_R_Recent);
            player.Total_PA_VS_R_Recent = parseInt(player.Total_PA_VS_R_Recent);
            player.Total_H_VS_R_Recent = parseInt(player.Total_H_VS_R_Recent);

            if(isNaN(player.H_PA_VS_R_Recent)) {
              player.H_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.Single_H_VS_R_Recent)) {
              player.Single_H_VS_R_Recent = 0;
            }
            if(isNaN(player.Double_H_VS_R_Recent)) {
              player.Double_H_VS_R_Recent = 0;
            }
            if(isNaN(player.Triple_H_VS_R_Recent)) {
              player.Triple_H_VS_R_Recent = 0;
            }
            if(isNaN(player.HR_H_VS_R_Recent)) {
              player.HR_H_VS_R_Recent = 0;
            }
            if(isNaN(player.SB_PA_VS_R_Recent)) {
              player.SB_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.SO_PA_VS_R_Recent)) {
              player.SO_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.SF_PA_VS_R_Recent)) {
              player.SF_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.HBP_PA_VS_R_Recent)) {
              player.HBP_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.BB_PA_VS_R_Recent)) {
              player.BB_PA_VS_R_Recent = 0;
            }
            if(isNaN(player.Total_PA_VS_R_Recent)) {
              player.Total_PA_VS_R_Recent = 1;
            }
            if(isNaN(player.Total_H_VS_R_Recent)) {
              player.Total_H_VS_R_Recent = 1;
            }
            player.H_PA_League = parseFloat(player.H_PA_League);
            player.Single_H_League = parseFloat(player.Single_H_League);
            player.Double_H_League = parseFloat(player.Double_H_League);
            player.Triple_H_League = parseFloat(player.Triple_H_League);
            player.HR_H_League = parseFloat(player.HR_H_League);
            player.SB_PA_League = parseFloat(player.SB_PA_League);
            player.SO_PA_League = parseFloat(player.SO_PA_League);
            player.SF_PA_League = parseFloat(player.SF_PA_League);
            player.HBP_PA_League = parseFloat(player.HBP_PA_League);
            player.BB_PA_League = parseFloat(player.BB_PA_League);

            player.H_PA_League_STD = parseFloat(player.H_PA_League_STD);
            player.Single_H_League_STD = parseFloat(player.Single_H_League_STD);
            player.Double_H_League_STD = parseFloat(player.Double_H_League_STD);
            player.Triple_H_League_STD = parseFloat(player.Triple_H_League_STD);
            player.HR_H_League_STD = parseFloat(player.HR_H_League_STD);
            player.SB_PA_League_STD = parseFloat(player.SB_PA_League_STD);
            player.SO_PA_League_STD = parseFloat(player.SO_PA_League_STD);
            player.SF_PA_League_STD = parseFloat(player.SF_PA_League_STD);
            player.HBP_PA_League_STD = parseFloat(player.HBP_PA_League_STD);
            player.BB_PA_League_STD = parseFloat(player.BB_PA_League_STD);

            player.H_PA_League_VS_R = parseFloat(player.H_PA_League_VS_R);
            player.Single_H_League_VS_R = parseFloat(player.Single_H_League_VS_R);
            player.Double_H_League_VS_R = parseFloat(player.Double_H_League_VS_R);
            player.Triple_H_League_VS_R = parseFloat(player.Triple_H_League_VS_R);
            player.HR_H_League_VS_R = parseFloat(player.HR_H_League_VS_R);
            player.SB_PA_League_VS_R = parseFloat(player.SB_PA_League_VS_R);
            player.SO_PA_League_VS_R = parseFloat(player.SO_PA_League_VS_R);
            player.SF_PA_League_VS_R = parseFloat(player.SF_PA_League_VS_R);
            player.HBP_PA_League_VS_R = parseFloat(player.HBP_PA_League_VS_R);
            player.BB_PA_League_VS_R = parseFloat(player.BB_PA_League_VS_R);

            player.H_PA_League_VS_R_STD = parseFloat(player.H_PA_League_VS_R_STD);
            player.Single_H_League_VS_R_STD = parseFloat(player.Single_H_League_VS_R_STD);
            player.Double_H_League_VS_R_STD = parseFloat(player.Double_H_League_VS_R_STD);
            player.Triple_H_League_VS_R_STD = parseFloat(player.Triple_H_League_VS_R_STD);
            player.HR_H_League_VS_R_STD = parseFloat(player.HR_H_League_VS_R_STD);
            player.SB_PA_League_VS_R_STD = parseFloat(player.SB_PA_League_VS_R_STD);
            player.SO_PA_League_VS_R_STD = parseFloat(player.SO_PA_League_VS_R_STD);
            player.SF_PA_League_VS_R_STD = parseFloat(player.SF_PA_League_VS_R_STD);
            player.HBP_PA_League_VS_R_STD = parseFloat(player.HBP_PA_League_VS_R_STD);
            player.BB_PA_League_VS_R_STD = parseFloat(player.BB_PA_League_VS_R_STD);

            player.H_PA_League_VS_L = parseFloat(player.H_PA_League_VS_L);
            player.Single_H_League_VS_L = parseFloat(player.Single_H_League_VS_L);
            player.Double_H_League_VS_L = parseFloat(player.Double_H_League_VS_L);
            player.Triple_H_League_VS_L = parseFloat(player.Triple_H_League_VS_L);
            player.HR_H_League_VS_L = parseFloat(player.HR_H_League_VS_L);
            player.SB_PA_League_VS_L = parseFloat(player.SB_PA_League_VS_L);
            player.SO_PA_League_VS_L = parseFloat(player.SO_PA_League_VS_L);
            player.SF_PA_League_VS_L = parseFloat(player.SF_PA_League_VS_L);
            player.HBP_PA_League_VS_L = parseFloat(player.HBP_PA_League_VS_L);
            player.BB_PA_League_VS_L = parseFloat(player.BB_PA_League_VS_L);

            player.H_PA_League_VS_L_STD = parseFloat(player.H_PA_League_VS_L_STD);
            player.Single_H_League_VS_L_STD = parseFloat(player.Single_H_League_VS_L_STD);
            player.Double_H_League_VS_L_STD = parseFloat(player.Double_H_League_VS_L_STD);
            player.Triple_H_League_VS_L_STD = parseFloat(player.Triple_H_League_VS_L_STD);
            player.HR_H_League_VS_L_STD = parseFloat(player.HR_H_League_VS_L_STD);
            player.SB_PA_League_VS_L_STD = parseFloat(player.SB_PA_League_VS_L_STD);
            player.SO_PA_League_VS_L_STD = parseFloat(player.SO_PA_League_VS_L_STD);
            player.SF_PA_League_VS_L_STD = parseFloat(player.SF_PA_League_VS_L_STD);
            player.HBP_PA_League_VS_L_STD = parseFloat(player.HBP_PA_League_VS_L_STD);
            player.BB_PA_League_VS_L_STD = parseFloat(player.BB_PA_League_VS_L_STD);

            //Pitcher bullpen stats
            player.H_PA_VS_L_Bullpen = parseFloat(player.H_PA_VS_L_Bullpen);
            player.Single_H_VS_L_Bullpen = parseFloat(player.Single_H_VS_L_Bullpen);
            player.Double_H_VS_L_Bullpen = parseFloat(player.Double_H_VS_L_Bullpen);
            player.Triple_H_VS_L_Bullpen = parseFloat(player.Triple_H_VS_L_Bullpen);
            player.HR_H_VS_L_Bullpen = parseFloat(player.HR_H_VS_L_Bullpen);
            player.SB_PA_VS_L_Bullpen = parseFloat(player.SB_PA_VS_L_Bullpen);
            player.SO_PA_VS_L_Bullpen = parseFloat(player.SO_PA_VS_L_Bullpen);
            player.SF_PA_VS_L_Bullpen = parseFloat(player.SF_PA_VS_L_Bullpen);
            player.HBP_PA_VS_L_Bullpen = parseFloat(player.HBP_PA_VS_L_Bullpen);
            player.BB_PA_VS_L_Bullpen = parseFloat(player.BB_PA_VS_L_Bullpen);

            player.H_PA_VS_R_Bullpen = parseFloat(player.H_PA_VS_R_Bullpen);
            player.Single_H_VS_R_Bullpen = parseFloat(player.Single_H_VS_R_Bullpen);
            player.Double_H_VS_R_Bullpen = parseFloat(player.Double_H_VS_R_Bullpen);
            player.Triple_H_VS_R_Bullpen = parseFloat(player.Triple_H_VS_R_Bullpen);
            player.HR_H_VS_R_Bullpen = parseFloat(player.HR_H_VS_R_Bullpen);
            player.SB_PA_VS_R_Bullpen = parseFloat(player.SB_PA_VS_R_Bullpen);
            player.SO_PA_VS_R_Bullpen = parseFloat(player.SO_PA_VS_R_Bullpen);
            player.SF_PA_VS_R_Bullpen = parseFloat(player.SF_PA_VS_R_Bullpen);
            player.HBP_PA_VS_R_Bullpen = parseFloat(player.HBP_PA_VS_R_Bullpen);
            player.BB_PA_VS_R_Bullpen = parseFloat(player.BB_PA_VS_R_Bullpen);

            player.IP_TBF_VS_Opp = parseFloat(player.IP_TBF_VS_Opp);
            player.IP_TBF = parseFloat(player.IP_TBF);
            player.IP_TBF_VS_Opp_Recent = parseFloat(player.IP_TBF_VS_Opp_Recent);
            player.IP_TBF_Recent = parseFloat(player.IP_TBF_Recent);
            player.IP_TBF_League_AVG = parseFloat(player.IP_TBF_League_AVG);
            player.IP_TBF_League_STD = parseFloat(player.IP_TBF_League_STD);
            if(isNaN(player.IP_TBF_VS_Opp)) {
              player.IP_TBF_VS_Opp = 0;
            }
            if(isNaN(player.IP_TBF)) {
              player.IP_TBF = 0;
            }
            if(isNaN(player.IP_TBF_VS_Opp_Recent)) {
              player.IP_TBF_VS_Opp_Recent = 0;
            }
            if(isNaN(player.IP_TBF_Recent)) {
              player.IP_TBF_Recent = 0;
            }

            player.TBF_VS_Opp = parseFloat(player.TBF_VS_Opp);
            player.TBF = parseFloat(player.TBF);
            player.TBF_VS_Opp_Recent = parseFloat(player.TBF_VS_Opp_Recent);
            player.TBF_Recent = parseFloat(player.TBF_Recent);
            player.TBF_League_AVG = parseFloat(player.TBF_League_AVG);
            player.TBF_League_STD = parseFloat(player.TBF_League_STD);
            if(isNaN(player.TBF_VS_Opp)) {
              player.TBF_VS_Opp = 0;
            }
            if(isNaN(player.TBF)) {
              player.TBF = 0;
            }
            if(isNaN(player.TBF_VS_Opp_Recent)) {
              player.TBF_VS_Opp_Recent = 0;
            }
            if(isNaN(player.TBF_Recent)) {
              player.TBF_Recent = 0;
            }
            //create player Sim Objectlayer.Sim_Single = 0;
            player.Sim_Data = [];


            $scope.AllPlayers.push(player);
            $scope.AllPlayersMASTER.push(player);

            var Game = {
              Home_Team : '',
              Away_Team : '',
              Date : '',
              Home_Players : [],
              Away_Players : [],
              Scores : [],
              Inning_Scores : [],
              Home_Score_AVG : 0,
              Away_Score_AVG : 0,
              Home_Win_Percent : 0,
              Away_Win_Percent : 0,
              Sim_Building : false
            }

            if(player.Home) {
              Game.Home_Team = player.Team;
              Game.Away_Team = player.Opp;
              Game.Date = player.Date;

              var GameIndex = $scope.Games.findIndex(obj => {
                return obj.Home_Team === Game.Home_Team && obj.Away_Team === Game.Away_Team && obj.Date === Game.Date
              });
              if(GameIndex === -1) {
                Game.Home_Players.push(player);
                $scope.Games.push(Game);
              }
              else {
                $scope.Games[GameIndex].Home_Players.push(player);
              }
            }
            else {
              Game.Away_Team = player.Team;
              Game.Home_Team = player.Opp;
              Game.Date = player.Date;

              var GameIndex = $scope.Games.findIndex(obj => {
                return obj.Home_Team === Game.Home_Team && obj.Away_Team === Game.Away_Team && obj.Date === Game.Date
              });
              if(GameIndex === -1) {
                Game.Away_Players.push(player);
                $scope.Games.push(Game);
              }
              else {
                $scope.Games[GameIndex].Away_Players.push(player);
              }
            }

          });
          if($scope.AllPlayers.length > 0) {
            $scope.displayNewMessage("success", "Players have been successfully loaded");
          }

          $scope.Set_Missing_BO();

      }, function errorCallBack(response) {
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

    $scope.loadPlayers();

    $scope.Download_Projections = function() {

      var csvRows = [];

      $scope.Games.forEach(function(Game) {
        Game.Home_Players.forEach(function(player) {
          csvRows.push({Name: player.Name, Sim_FD_Points: player.Sim_FD_Points, Sim_DK_Points: player.Sim_DK_Points, Sim_Y_Points: player.Sim_Y_Points});
        });
        Game.Away_Players.forEach(function(player) {
          csvRows.push({Name: player.Name, Sim_FD_Points: player.Sim_FD_Points, Sim_DK_Points: player.Sim_DK_Points, Sim_Y_Points: player.Sim_Y_Points});
        });
      });

      var csvContent = "data:text/csv;charset=utf-8,";
      csvContent = csvContent + "Player Name,FanDuel,DraftKings,Yahoo\n";

      csvRows.forEach(function(singleRow) {
        csvContent = csvContent +singleRow.Name+","+ singleRow.Sim_FD_Points+","+singleRow.Sim_DK_Points+","+singleRow.Sim_Y_Points+"\n";
      });
      var anchor = angular.element('<a/>');
      anchor.css({ display: 'none' }); // Make sure it's not visible
      angular.element(document.body).append(anchor); // Attach to document
      var CSVName = "";
      anchor.attr({
          href: encodeURI(csvContent),
          target: '_blank',
          download: 'DFSCombine_Pojections_'+$scope.Date+'.csv'
      })[0].click();

      anchor.remove(); // Clean it up afterwards


    }

    $scope.View_Projections = function() {

      var Players = [];
      $scope.Games.forEach(function(Game) {
        Game.Home_Players.forEach(function(player) {
          Players.push(player);
        });
        Game.Away_Players.forEach(function(player) {
          Players.push(player);
        });
      });
      var modalInstance = $uibModal.open({
          templateUrl: '/js/AngularControllers/modelMLBSim.html',
          controller: 'MLBSimPlayerController',
          size:'lg',
          resolve: {
              players: function () {
                  return Players;
              }
          }
      });
    }


    $scope.Set_Missing_BO = function() {
      $scope.Games.forEach(function(Game) {
        //Set Away Team missing BO
        var Away_Missing_BO = -1;
        for(var i = 1; i < 10; i++)
        {
          var Away_In_BO_Index = Game.Away_Players.findIndex(obj => {
            return  obj.Batting_Order === i
          });
          if(Away_In_BO_Index === -1) {
            //has missing BO
            Away_Missing_BO = i;
            continue;

          }
        }
        if(Away_Missing_BO > 0)
        {
          var Away_Missing_BO_Index = Game.Away_Players.findIndex(obj => {
            return obj.Batting_Order === undefined || obj.Batting_Order === null
          });
          Game.Away_Players[Away_Missing_BO_Index].Batting_Order = Away_Missing_BO;
        }
        //Set Home Team missing BO
        var Home_Missing_BO = -1;
        for(var i = 1; i < 10; i++)
        {
          var Home_In_BO_Index = Game.Home_Players.findIndex(obj => {
            return  obj.Batting_Order === i
          });
          if(Home_In_BO_Index === -1) {
            //has missing BO
            Home_Missing_BO = i;
            continue;

          }
        }
        if(Home_Missing_BO > 0)
        {
          var Away_Missing_BO_Index = Game.Home_Players.findIndex(obj => {
            return obj.Batting_Order === undefined || obj.Batting_Order === null
          });
          Game.Home_Players[Away_Missing_BO_Index].Batting_Order = Home_Missing_BO;
        }
      });
    }

    $scope.Create_Player_Sim_Object = function(Game) {
      Game.Away_Players.forEach(function(player) {
        player.Sim_Data.push({
          Sim_Single : 0,
          Sim_Double : 0,
          Sim_Triple : 0,
          Sim_HR : 0,
          Sim_SB : 0,
          Sim_SO : 0,
          Sim_HBP : 0,
          Sim_BB : 0,
          Sim_R_VS_Starting_P : 0,
          Sim_R_VS_Bullpen : 0,
          Sim_RBI : 0,
          Sim_PA : 0,

          Sim_P_H : 0,
          Sim_P_SO : 0,
          Sim_P_HBP : 0,
          Sim_P_BB : 0,
          Sim_P_IP : 0,
          Sim_P_CG : 0,
          Sim_P_ShutOut : 0,
          Sim_P_NH : 0,
          Sim_P_ER : 0,
          Sim_P_QS : 0,
          Sim_P_W : 0,

          Sim_FD_Points : 0,
          Sim_DK_Points : 0,
          Sim_Y_Points : 0
        });
      });
      Game.Home_Players.forEach(function(player) {
        player.Sim_Data.push({
          Sim_Single : 0,
          Sim_Double : 0,
          Sim_Triple : 0,
          Sim_HR : 0,
          Sim_SB : 0,
          Sim_SO : 0,
          Sim_HBP : 0,
          Sim_BB : 0,
          Sim_R_VS_Starting_P : 0,
          Sim_R_VS_Bullpen : 0,
          Sim_RBI : 0,
          Sim_PA : 0,

          Sim_P_H : 0,
          Sim_P_SO : 0,
          Sim_P_HBP : 0,
          Sim_P_BB : 0,
          Sim_P_IP : 0,
          Sim_P_CG : 0,
          Sim_P_ShutOut : 0,
          Sim_P_NH : 0,
          Sim_P_ER : 0,
          Sim_P_QS : 0,
          Sim_P_W : 0,

          Sim_FD_Points : 0,
          Sim_DK_Points : 0,
          Sim_Y_Points : 0
        });
      });
    }

    $scope.Set_Regression_Data = function(Game) {
      Game.Away_Players.forEach(function(player) {

        var League_VS_R_PAs = parseInt($scope.League_Regression);
        var League_VS_R_Hs = parseInt($scope.League_Regression/2);

        var Recent_VS_R_PAs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_PA_VS_R;
        var Recent_VS_R_Hs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_H_VS_R;
        if(player.Position === 'P') {
          Recent_VS_R_PAs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_PA_VS_R;
          Recent_VS_R_Hs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_H_VS_R;
        }
        if(League_VS_R_PAs < 10) {
          League_VS_R_PAs = 10;
        }
        if(League_VS_R_Hs < 5) {
          League_VS_R_Hs = 5;
        }

        player.H_PA_VS_R_Regression = ((player.H_PA_VS_R * player.Total_PA_VS_R) + (player.H_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.H_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.HR_H_VS_R_Regression = ((player.HR_H_VS_R * player.Total_H_VS_R) + (player.HR_H_VS_R_Recent * Recent_VS_R_Hs) + (player.HR_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Triple_H_VS_R_Regression = ((player.Triple_H_VS_R * player.Total_H_VS_R) + (player.Triple_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Triple_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Double_H_VS_R_Regression = ((player.Double_H_VS_R * player.Total_H_VS_R) + (player.Double_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Double_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Single_H_VS_R_Regression = ((player.Single_H_VS_R * player.Total_H_VS_R) + (player.Single_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Single_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.SB_PA_VS_R_Regression = ((player.SB_PA_VS_R * player.Total_PA_VS_R) + (player.SB_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SB_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.SO_PA_VS_R_Regression = ((player.SO_PA_VS_R * player.Total_PA_VS_R) + (player.SO_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SO_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.BB_PA_VS_R_Regression = ((player.BB_PA_VS_R * player.Total_PA_VS_R) + (player.BB_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.BB_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.HBP_PA_VS_R_Regression = ((player.HBP_PA_VS_R * player.Total_PA_VS_R) + (player.HBP_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.HBP_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.SF_PA_VS_R_Regression = ((player.SF_PA_VS_R * player.Total_PA_VS_R) + (player.SF_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SF_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);


        var League_VS_L_PAs = parseInt($scope.League_Regression);
        var League_VS_L_Hs = parseInt($scope.League_Regression/2);

        var Recent_VS_L_PAs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_PA_VS_L;
        var Recent_VS_L_Hs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_H_VS_L;
        if(player.Position === 'P') {
          Recent_VS_L_PAs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_PA_VS_L;
          Recent_VS_L_Hs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_H_VS_L;
        }
        if(League_VS_L_PAs < 10) {
          League_VS_L_PAs = 10;
        }
        if(League_VS_L_Hs < 5) {
          League_VS_L_Hs = 5;
        }

        player.H_PA_VS_L_Regression = ((player.H_PA_VS_L * player.Total_PA_VS_L) + (player.H_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.H_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.HR_H_VS_L_Regression = ((player.HR_H_VS_L * player.Total_H_VS_L) + (player.HR_H_VS_L_Recent * Recent_VS_L_Hs) + (player.HR_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Triple_H_VS_L_Regression = ((player.Triple_H_VS_L * player.Total_H_VS_L) + (player.Triple_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Triple_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Double_H_VS_L_Regression = ((player.Double_H_VS_L * player.Total_H_VS_L) + (player.Double_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Double_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Single_H_VS_L_Regression = ((player.Single_H_VS_L * player.Total_H_VS_L) + (player.Single_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Single_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.SB_PA_VS_L_Regression = ((player.SB_PA_VS_L * player.Total_PA_VS_L) + (player.SB_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SB_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.SO_PA_VS_L_Regression = ((player.SO_PA_VS_L * player.Total_PA_VS_L) + (player.SO_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SO_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.BB_PA_VS_L_Regression = ((player.BB_PA_VS_L * player.Total_PA_VS_L) + (player.BB_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.BB_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.HBP_PA_VS_L_Regression = ((player.HBP_PA_VS_L * player.Total_PA_VS_L) + (player.HBP_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.HBP_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.SF_PA_VS_L_Regression = ((player.SF_PA_VS_L * player.Total_PA_VS_L) + (player.SF_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SF_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);

        var Pitcher_Base = 600;
        var Recent_Base = Pitcher_Base * ($scope.Recent_Pitcher_Regression * 0.01);
        var League_Base = parseInt($scope.League_Regression);
        Pitcher_Base = Pitcher_Base - Recent_Base ;

        player.TBF_Regression = ((player.TBF * Pitcher_Base) + (player.TBF_Recent * Recent_Base) + (player.TBF_League_AVG * League_Base)) / (Pitcher_Base + Recent_Base + League_Base);
        player.TBF_VS_Opp_Regression = ((player.TBF_VS_Opp * Pitcher_Base) + (player.TBF_VS_Opp_Recent * Recent_Base) ) / (Pitcher_Base + Recent_Base);

        player.IP_TBF_Regression = ((player.IP_TBF * Pitcher_Base) + (player.IP_TBF_Recent * Recent_Base) + (player.IP_TBF_League_AVG * League_Base)) / (Pitcher_Base + Recent_Base + League_Base);
        player.IP_TBF_VS_Opp_Regression = ((player.IP_TBF_VS_Opp * Pitcher_Base) + (player.IP_TBF_VS_Opp_Recent * Recent_Base) ) / (Pitcher_Base + Recent_Base);


        if(player.Total_PA_VS_R < 100 && player.Position === 'P') {
          //player has small amount of data
          var New_Pitcher_Boost = 1.10;
          player.H_PA_VS_R_Regression = player.H_PA_VS_R_Regression * New_Pitcher_Boost;
          player.HR_H_VS_R_Regression = player.HR_H_VS_R_Regression * New_Pitcher_Boost;
          player.Triple_H_VS_R_Regression = player.Triple_H_VS_R_Regression * New_Pitcher_Boost;
          player.Double_H_VS_R_Regression = player.Double_H_VS_R_Regression * New_Pitcher_Boost;
          player.Single_H_VS_R_Regression = player.Single_H_VS_R_Regression * New_Pitcher_Boost;
          player.SB_PA_VS_R_Regression = player.SB_PA_VS_R_Regression * New_Pitcher_Boost;
          player.SO_PA_VS_R_Regression = player.SO_PA_VS_R_Regression * New_Pitcher_Boost;
          player.BB_PA_VS_R_Regression = player.BB_PA_VS_R_Regression * New_Pitcher_Boost;
          player.HBP_PA_VS_R_Regression = player.HBP_PA_VS_R_Regression * New_Pitcher_Boost;
          New_Pitcher_Boost = 0.90;
          player.SO_PA_VS_R_Regression = player.SO_PA_VS_R_Regression * New_Pitcher_Boost;
          player.TBF_Regression = player.TBF_Regression * New_Pitcher_Boost;
        }
        if(player.Total_PA_VS_L < 100 && player.Position === 'P') {
          //player has small amount of data
          var New_Pitcher_Boost = 1.10;
          player.H_PA_VS_L_Regression = player.H_PA_VS_L_Regression * New_Pitcher_Boost;
          player.HR_H_VS_L_Regression = player.HR_H_VS_L_Regression * New_Pitcher_Boost;
          player.Triple_H_VS_L_Regression = player.Triple_H_VS_L_Regression * New_Pitcher_Boost;
          player.Double_H_VS_L_Regression = player.Double_H_VS_L_Regression * New_Pitcher_Boost;
          player.Single_H_VS_L_Regression = player.Single_H_VS_L_Regression * New_Pitcher_Boost;
          player.SB_PA_VS_L_Regression = player.SB_PA_VS_L_Regression * New_Pitcher_Boost;
          player.SO_PA_VS_L_Regression = player.SO_PA_VS_L_Regression * New_Pitcher_Boost;
          player.BB_PA_VS_L_Regression = player.BB_PA_VS_L_Regression * New_Pitcher_Boost;
          player.HBP_PA_VS_L_Regression = player.HBP_PA_VS_L_Regression * New_Pitcher_Boost;
          New_Pitcher_Boost = 0.90;
          player.SO_PA_VS_L_Regression = player.SO_PA_VS_L_Regression * New_Pitcher_Boost;
          player.TBF_Regression = player.TBF_Regression * New_Pitcher_Boost;
        }

      });
      Game.Home_Players.forEach(function(player) {

        var League_VS_R_PAs = parseInt($scope.League_Regression);
        var League_VS_R_Hs = parseInt($scope.League_Regression/2);

        var Recent_VS_R_PAs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_PA_VS_R;
        var Recent_VS_R_Hs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_H_VS_R;

        if(player.Position === 'P') {
          Recent_VS_R_PAs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_PA_VS_R;
          Recent_VS_R_Hs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_H_VS_R;
        }

        if(League_VS_R_PAs < 10) {
          League_VS_R_PAs = 10;
        }
        if(League_VS_R_Hs < 5) {
          League_VS_R_Hs = 5;
        }

        player.H_PA_VS_R_Regression = ((player.H_PA_VS_R * player.Total_PA_VS_R) + (player.H_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.H_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.HR_H_VS_R_Regression = ((player.HR_H_VS_R * player.Total_H_VS_R) + (player.HR_H_VS_R_Recent * Recent_VS_R_Hs) + (player.HR_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Triple_H_VS_R_Regression = ((player.Triple_H_VS_R * player.Total_H_VS_R) + (player.Triple_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Triple_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Double_H_VS_R_Regression = ((player.Double_H_VS_R * player.Total_H_VS_R) + (player.Double_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Double_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.Single_H_VS_R_Regression = ((player.Single_H_VS_R * player.Total_H_VS_R) + (player.Single_H_VS_R_Recent * Recent_VS_R_Hs) + (player.Single_H_League_VS_R * League_VS_R_Hs)) / (player.Total_H_VS_R + Recent_VS_R_Hs + League_VS_R_Hs);
        player.SB_PA_VS_R_Regression = ((player.SB_PA_VS_R * player.Total_PA_VS_R) + (player.SB_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SB_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.SO_PA_VS_R_Regression = ((player.SO_PA_VS_R * player.Total_PA_VS_R) + (player.SO_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SO_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.BB_PA_VS_R_Regression = ((player.BB_PA_VS_R * player.Total_PA_VS_R) + (player.BB_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.BB_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.HBP_PA_VS_R_Regression = ((player.HBP_PA_VS_R * player.Total_PA_VS_R) + (player.HBP_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.HBP_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);
        player.SF_PA_VS_R_Regression = ((player.SF_PA_VS_R * player.Total_PA_VS_R) + (player.SF_PA_VS_R_Recent * Recent_VS_R_PAs) + (player.SF_PA_League_VS_R * League_VS_R_PAs)) / (player.Total_PA_VS_R + Recent_VS_R_PAs + League_VS_R_PAs);


        var League_VS_L_PAs = parseInt($scope.League_Regression);
        var League_VS_L_Hs = parseInt($scope.League_Regression/2);

        var Recent_VS_L_PAs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_PA_VS_L;
        var Recent_VS_L_Hs = ($scope.Recent_Hitter_Regression * 0.01) * player.Total_H_VS_L;
        if(player.Position === 'P') {
          Recent_VS_L_PAs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_PA_VS_L;
          Recent_VS_L_Hs = ($scope.Recent_Pitcher_Regression * 0.01) * player.Total_H_VS_L;
        }

        if(League_VS_L_PAs < 10) {
          League_VS_L_PAs = 10;
        }
        if(League_VS_L_Hs < 5) {
          League_VS_L_Hs = 5;
        }

        player.H_PA_VS_L_Regression = ((player.H_PA_VS_L * player.Total_PA_VS_L) + (player.H_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.H_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.HR_H_VS_L_Regression = ((player.HR_H_VS_L * player.Total_H_VS_L) + (player.HR_H_VS_L_Recent * Recent_VS_L_Hs) + (player.HR_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Triple_H_VS_L_Regression = ((player.Triple_H_VS_L * player.Total_H_VS_L) + (player.Triple_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Triple_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Double_H_VS_L_Regression = ((player.Double_H_VS_L * player.Total_H_VS_L) + (player.Double_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Double_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.Single_H_VS_L_Regression = ((player.Single_H_VS_L * player.Total_H_VS_L) + (player.Single_H_VS_L_Recent * Recent_VS_L_Hs) + (player.Single_H_League_VS_L * League_VS_L_Hs)) / (player.Total_H_VS_L + Recent_VS_L_Hs + League_VS_L_Hs);
        player.SB_PA_VS_L_Regression = ((player.SB_PA_VS_L * player.Total_PA_VS_L) + (player.SB_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SB_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.SO_PA_VS_L_Regression = ((player.SO_PA_VS_L * player.Total_PA_VS_L) + (player.SO_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SO_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.BB_PA_VS_L_Regression = ((player.BB_PA_VS_L * player.Total_PA_VS_L) + (player.BB_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.BB_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.HBP_PA_VS_L_Regression = ((player.HBP_PA_VS_L * player.Total_PA_VS_L) + (player.HBP_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.HBP_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);
        player.SF_PA_VS_L_Regression = ((player.SF_PA_VS_L * player.Total_PA_VS_L) + (player.SF_PA_VS_L_Recent * Recent_VS_L_PAs) + (player.SF_PA_League_VS_L * League_VS_L_PAs)) / (player.Total_PA_VS_L + Recent_VS_L_PAs + League_VS_L_PAs);

        var Pitcher_Base = 600;
        var Recent_Base = Pitcher_Base * ($scope.Recent_Pitcher_Regression * 0.01);
        var League_Base = parseInt($scope.League_Regression);
        Pitcher_Base = Pitcher_Base - Recent_Base;

        player.TBF_Regression = ((player.TBF * Pitcher_Base) + (player.TBF_Recent * Recent_Base) + (player.TBF_League_AVG * League_Base)) / (Pitcher_Base + Recent_Base + League_Base);
        player.TBF_VS_Opp_Regression = ((player.TBF_VS_Opp * Pitcher_Base) + (player.TBF_VS_Opp_Recent * Recent_Base) ) / (Pitcher_Base + Recent_Base);

        player.IP_TBF_Regression = ((player.IP_TBF * Pitcher_Base) + (player.IP_TBF_Recent * Recent_Base) + (player.IP_TBF_League_AVG * League_Base)) / (Pitcher_Base + Recent_Base + League_Base);
        player.IP_TBF_VS_Opp_Regression = ((player.IP_TBF_VS_Opp * Pitcher_Base) + (player.IP_TBF_VS_Opp_Recent * Recent_Base) ) / (Pitcher_Base + Recent_Base);

        if(player.Total_PA_VS_R < 100 && player.Position === 'P') {
          //player has small amount of data
          var New_Pitcher_Boost = 1.10;
          player.H_PA_VS_R_Regression = player.H_PA_VS_R_Regression * New_Pitcher_Boost;
          player.HR_H_VS_R_Regression = player.HR_H_VS_R_Regression * New_Pitcher_Boost;
          player.Triple_H_VS_R_Regression = player.Triple_H_VS_R_Regression * New_Pitcher_Boost;
          player.Double_H_VS_R_Regression = player.Double_H_VS_R_Regression * New_Pitcher_Boost;
          player.Single_H_VS_R_Regression = player.Single_H_VS_R_Regression * New_Pitcher_Boost;
          player.SB_PA_VS_R_Regression = player.SB_PA_VS_R_Regression * New_Pitcher_Boost;
          player.SO_PA_VS_R_Regression = player.SO_PA_VS_R_Regression * New_Pitcher_Boost;
          player.BB_PA_VS_R_Regression = player.BB_PA_VS_R_Regression * New_Pitcher_Boost;
          player.HBP_PA_VS_R_Regression = player.HBP_PA_VS_R_Regression * New_Pitcher_Boost;
          New_Pitcher_Boost = 0.90;
          player.SO_PA_VS_R_Regression = player.SO_PA_VS_R_Regression * New_Pitcher_Boost;
          player.TBF_Regression = player.TBF_Regression * New_Pitcher_Boost;
        }
        if(player.Total_PA_VS_L < 100 && player.Position === 'P') {
          //player has small amount of data
          var New_Pitcher_Boost = 1.10;
          player.H_PA_VS_L_Regression = player.H_PA_VS_L_Regression * New_Pitcher_Boost;
          player.HR_H_VS_L_Regression = player.HR_H_VS_L_Regression * New_Pitcher_Boost;
          player.Triple_H_VS_L_Regression = player.Triple_H_VS_L_Regression * New_Pitcher_Boost;
          player.Double_H_VS_L_Regression = player.Double_H_VS_L_Regression * New_Pitcher_Boost;
          player.Single_H_VS_L_Regression = player.Single_H_VS_L_Regression * New_Pitcher_Boost;
          player.SB_PA_VS_L_Regression = player.SB_PA_VS_L_Regression * New_Pitcher_Boost;
          player.SO_PA_VS_L_Regression = player.SO_PA_VS_L_Regression * New_Pitcher_Boost;
          player.BB_PA_VS_L_Regression = player.BB_PA_VS_L_Regression * New_Pitcher_Boost;
          player.HBP_PA_VS_L_Regression = player.HBP_PA_VS_L_Regression * New_Pitcher_Boost;
          New_Pitcher_Boost = 0.90;
          player.SO_PA_VS_L_Regression = player.SO_PA_VS_L_Regression * New_Pitcher_Boost;
          player.TBF_Regression = player.TBF_Regression * New_Pitcher_Boost;
        }
      });
    }

    $scope.Start_All_Simulations = function() {
      $scope.Clear_Games_Sim_Data();
      // $scope.worker.postMessage([$scope.Games, $scope.Number_Simulations, $scope.League_Regression, $scope.Recent_Hitter_Regression, $scope.Recent_Pitcher_Regression]);
      // $scope.Sim_Building = true;
      for(var j = 0; j < $scope.Games.length; j++) {
          $scope.Start_Simulation($scope.Games[j]);
      }
      $scope.Sim_Building = false;

      // $scope.Games.forEach(function(Game) {
      //   $scope.Start_Simulation(Game);
      // });

    }


    $scope.Start_Simulation = function(Game) {
      $scope.Clear_Game_Sim_Data(Game);
      var Game_Index = $scope.Games.findIndex(obj => {
        return obj.Home_Team === Game.Home_Team && obj.Away_Team === Game.Away_Team && obj.Date === Game.Date
      });
      $scope.Games[Game_Index].Sim_Building = true;
      $scope.worker.postMessage([[$scope.Games[Game_Index]], $scope.Number_Simulations, $scope.League_Regression, $scope.Recent_Hitter_Regression, $scope.Recent_Pitcher_Regression, $scope.Auto_Match_Vegas]);


      $scope.worker.onmessage = function(event) {
          Game_Index = $scope.Games.findIndex(obj => {
            return obj.Home_Team === event.data[0].Home_Team && obj.Away_Team === event.data[0].Away_Team
          });
          $scope.Games[Game_Index].Home_Team = event.data[0].Home_Team;
          $scope.Games[Game_Index].Away_Team = event.data[0].Away_Team;
          $scope.Games[Game_Index].Home_Players = event.data[0].Home_Players;
          $scope.Games[Game_Index].Away_Players = event.data[0].Away_Players;
          $scope.Games[Game_Index].Scores = event.data[0].Scores;
          $scope.Games[Game_Index].Inning_Scores = event.data[0].Inning_Scores;
          $scope.Games[Game_Index].Home_Score_AVG = event.data[0].Home_Score_AVG;
          $scope.Games[Game_Index].Away_Score_AVG = event.data[0].Away_Score_AVG;
          $scope.Games[Game_Index].Home_Win_Percent = event.data[0].Home_Win_Percent;
          $scope.Games[Game_Index].Away_Win_Percent = event.data[0].Away_Win_Percent;
          $scope.Games[Game_Index].Sim_Building = false;
          $scope.Sim_Building = false;

          $scope.$apply();
      };


      // var iterations = $scope.Number_Simulations;
      //
      // $scope.Clear_Player_Sim_Object(Game);
      //
      // $scope.Set_Regression_Data(Game);
      //
      // for(var j = 0; j < iterations; j++) {
      //     //var t0 = performance.now();
      //     $scope.Create_Player_Sim_Object(Game);
      //
      //     Game.Inning_Scores.push([]);
      //
      //     $scope.Run_Single_Sim(Game, j);
      //     //var t1 = performance.now();
      //     //$scope.Update_Game_Scores(Game, j);
      //
      // }
      // $scope.Remove_Games_Out_Of_Vegas(Game);
      //
      // $scope.Update_Player_Fantasy_Scores(Game, iterations);
      // $scope.Update_Game_Data(Game);
    }

    $scope.Run_Single_Sim = function(Game, iteration) {
      var Max_Innings = 54;
      var Home_Score = 0;
      var Away_Score = 0;

      var Home_Current_BO = 1;
      var Away_Current_BO = 1;

      var Total_Inning_Outs = 0;

      var Home_Starting_P_Still_Playing = true;
      var Away_Starting_P_Still_Playing = true;

      var Bases = {
        First_Base_On_Base : false,
        First_Base_Player_ID : 0,
        Second_Base_On_Base : false,
        Second_Base_Player_ID : 0,
        Third_Base_On_Base : false,
        Third_Base_Player_ID : 0
      };

      var Current_Inning = 0;

      var Home_Team_Batting = false;

      var Away_Pitcher_Index = Game.Away_Players.findIndex(obj => {
        return obj.Position === 'P'
      });
      var Home_Pitcher_Index = Game.Home_Players.findIndex(obj => {
        return obj.Position === 'P'
      });

      for(var j = 0; j < Max_Innings; j++) {
        Game.Inning_Scores[iteration].push({Home_Score: 0, Away_Score : 0});
      }

      //Start main game loop
      while(Current_Inning < Max_Innings) {
        if(Home_Team_Batting) {

          var Num_Outs = $scope.Start_AB(Home_Team_Batting, Game, Home_Current_BO, Away_Starting_P_Still_Playing, Bases, iteration);

          if(Away_Starting_P_Still_Playing) {
            var Expected_IP_Per_BF = $scope.Get_IP_Per_BF(Game.Away_Players[Away_Pitcher_Index]);
            var Expected_BF = $scope.Get_BF_Per_Game(Game.Away_Players[Away_Pitcher_Index]);
            if(Game.Away_Players[Away_Pitcher_Index].Sim_Data[iteration].Sim_P_IP > (Expected_IP_Per_BF * Expected_BF) || Game.Away_Players[Away_Pitcher_Index].Sim_Data[iteration].Sim_P_ER > 5) {
              Away_Starting_P_Still_Playing = !Away_Starting_P_Still_Playing;
            }
          }

          Home_Current_BO++;
          if(Home_Current_BO > 9) {
            Home_Current_BO = 1;
          }
          if (Num_Outs > 0)
          {
              Total_Inning_Outs += Num_Outs;

              Current_Inning += Num_Outs;
              if(Current_Inning < Max_Innings) {
                Game.Inning_Scores[iteration][Current_Inning].Home_Score = $scope.Get_Home_Current_Score(Game, iteration);
                Game.Inning_Scores[iteration][Current_Inning].Away_Score = $scope.Get_Away_Current_Score(Game, iteration);
              }

              if (Total_Inning_Outs >= 3)
              {
                  Home_Team_Batting = !Home_Team_Batting;

                  Bases.First_Base_On_Base = 0;
                  Bases.Second_Base_On_Base = 0;
                  Bases.Third_Base_On_Base = 0;

                  Total_Inning_Outs = 0;
              }
          }
        }
        else {

          var Num_Outs = $scope.Start_AB(Home_Team_Batting, Game, Away_Current_BO, Home_Starting_P_Still_Playing, Bases, iteration);

          if(Home_Starting_P_Still_Playing) {
            var Expected_IP_Per_BF = $scope.Get_IP_Per_BF(Game.Home_Players[Home_Pitcher_Index]);
            var Expected_BF = $scope.Get_BF_Per_Game(Game.Home_Players[Home_Pitcher_Index]);
            if(Game.Home_Players[Home_Pitcher_Index].Sim_Data[iteration].Sim_P_IP > (Expected_IP_Per_BF * Expected_BF) || Game.Home_Players[Home_Pitcher_Index].Sim_Data[iteration].Sim_P_ER > 5) {
              Home_Starting_P_Still_Playing = !Home_Starting_P_Still_Playing;
            }
          }

          Away_Current_BO++;
          if(Away_Current_BO > 9) {
            Away_Current_BO = 1;
          }
          if (Num_Outs > 0)
          {
              Total_Inning_Outs += Num_Outs;

              Current_Inning += Num_Outs;
              if(Current_Inning < Max_Innings) {
                Game.Inning_Scores[iteration][Current_Inning].Home_Score = $scope.Get_Home_Current_Score(Game, iteration);
                Game.Inning_Scores[iteration][Current_Inning].Away_Score = $scope.Get_Away_Current_Score(Game, iteration);
              }
              if (Total_Inning_Outs >= 3)
              {
                  Home_Team_Batting = !Home_Team_Batting;

                  Bases.First_Base_On_Base = 0;
                  Bases.Second_Base_On_Base = 0;
                  Bases.Third_Base_On_Base = 0;

                  Total_Inning_Outs = 0;
              }
          }
        }
      }

    }


    $scope.Remove_Games_Out_Of_Vegas = function(Game) {
      var Home_Score_Recalculated_AVG = $scope.Get_Home_AVG_Score(Game);
      var Away_Score_Recalculated_AVG = $scope.Get_Away_AVG_Score(Game);


      for(var m = 0; m < Game.Inning_Scores.length; m++) {
        if(Home_Score_Recalculated_AVG < Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG < Game.Away_Players[0].Vegas_Runs) {
          //need to increase home scores avg and away score average
          for(var j = 0; j < Game.Inning_Scores.length; j++) {
            if(Game.Inning_Scores[j][53].Home_Score < Game.Home_Players[0].Vegas_Runs && Game.Inning_Scores[j][53].Away_Score < Game.Away_Players[0].Vegas_Runs) {
              //remove
              Game.Inning_Scores.splice(j, 1);
              for(var k = 0; k < Game.Home_Players.length; k++) {
                Game.Home_Players[k].Sim_Data.splice(j, 1);
              }
              for(var k = 0; k < Game.Away_Players.length; k++) {
                Game.Away_Players[k].Sim_Data.splice(j, 1);
              }
            }
            Home_Score_Recalculated_AVG = $scope.Get_Home_AVG_Score(Game);
            Away_Score_Recalculated_AVG = $scope.Get_Away_AVG_Score(Game);

            if(Home_Score_Recalculated_AVG >= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG >= Game.Away_Players[0].Vegas_Runs) {
              break;
            }
          }
          if(Home_Score_Recalculated_AVG >= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG >= Game.Away_Players[0].Vegas_Runs) {
            break;
          }
        }
        else if(Home_Score_Recalculated_AVG > Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG > Game.Away_Players[0].Vegas_Runs) {
          //need to increase home scores avg and away score
          for(var j = 0; j < Game.Inning_Scores.length; j++) {
            if(Game.Inning_Scores[j][53].Home_Score > Game.Home_Players[0].Vegas_Runs && Game.Inning_Scores[j][53].Away_Score > Game.Away_Players[0].Vegas_Runs) {
              //remove
              Game.Inning_Scores.splice(j, 1);
              for(var k = 0; k < Game.Home_Players.length; k++) {
                Game.Home_Players[k].Sim_Data.splice(j, 1);
              }
              for(var k = 0; k < Game.Away_Players.length; k++) {
                Game.Away_Players[k].Sim_Data.splice(j, 1);
              }
            }
            Home_Score_Recalculated_AVG = $scope.Get_Home_AVG_Score(Game);
            Away_Score_Recalculated_AVG = $scope.Get_Away_AVG_Score(Game);

            if(Home_Score_Recalculated_AVG <= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG <= Game.Away_Players[0].Vegas_Runs) {
              break;
            }
          }
          if(Home_Score_Recalculated_AVG <= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG <= Game.Away_Players[0].Vegas_Runs) {
            break;
          }
        }
        else if(Home_Score_Recalculated_AVG < Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG > Game.Away_Players[0].Vegas_Runs) {
          //need to decrease home and increase away
          for(var j = 0; j < Game.Inning_Scores.length; j++) {
            if(Game.Inning_Scores[j][53].Home_Score < Game.Home_Players[0].Vegas_Runs && Game.Inning_Scores[j][53].Away_Score > Game.Away_Players[0].Vegas_Runs) {
              //remove
              Game.Inning_Scores.splice(j, 1);
              for(var k = 0; k < Game.Home_Players.length; k++) {
                Game.Home_Players[k].Sim_Data.splice(j, 1);
              }
              for(var k = 0; k < Game.Away_Players.length; k++) {
                Game.Away_Players[k].Sim_Data.splice(j, 1);
              }
            }
            Home_Score_Recalculated_AVG = $scope.Get_Home_AVG_Score(Game);
            Away_Score_Recalculated_AVG = $scope.Get_Away_AVG_Score(Game);

            if(Home_Score_Recalculated_AVG >= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG <= Game.Away_Players[0].Vegas_Runs) {
              break;
            }
          }
          if(Home_Score_Recalculated_AVG >= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG <= Game.Away_Players[0].Vegas_Runs) {
            break;
          }
        }
        else if(Home_Score_Recalculated_AVG > Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG < Game.Away_Players[0].Vegas_Runs) {
          //need to increase home and decrease away
          for(var j = 0; j < Game.Inning_Scores.length; j++) {
            if(Game.Inning_Scores[j][53].Home_Score > Game.Home_Players[0].Vegas_Runs && Game.Inning_Scores[j][53].Away_Score < Game.Away_Players[0].Vegas_Runs) {
              //remove
              Game.Inning_Scores.splice(j, 1);
              for(var k = 0; k < Game.Home_Players.length; k++) {
                Game.Home_Players[k].Sim_Data.splice(j, 1);
              }
              for(var k = 0; k < Game.Away_Players.length; k++) {
                Game.Away_Players[k].Sim_Data.splice(j, 1);
              }
            }
            Home_Score_Recalculated_AVG = $scope.Get_Home_AVG_Score(Game);
            Away_Score_Recalculated_AVG = $scope.Get_Away_AVG_Score(Game);

            if(Home_Score_Recalculated_AVG <= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG >= Game.Away_Players[0].Vegas_Runs) {
              break;
            }
          }
          if(Home_Score_Recalculated_AVG <= Game.Home_Players[0].Vegas_Runs && Away_Score_Recalculated_AVG >= Game.Away_Players[0].Vegas_Runs) {
            break;
          }
        }
      }
    }
    $scope.Get_Away_AVG_Score = function(Game) {
      var Away_Total_Runs = 0;
      Game.Inning_Scores.forEach(function(Score) {
        Away_Total_Runs += Score[53].Away_Score;
      });
      return Away_Total_Runs / Game.Inning_Scores.length;
    }
    $scope.Get_Home_AVG_Score = function(Game) {
      var Home_Total_Runs = 0;
      Game.Inning_Scores.forEach(function(Score) {
        Home_Total_Runs += Score[53].Home_Score;
      });
      return Home_Total_Runs / Game.Inning_Scores.length;
    }
    $scope.Get_Home_Current_Score = function(Game, iteration) {
      var Home_Total_Runs = 0;
      Game.Home_Players.forEach(function(player) {
        Home_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Starting_P;
        Home_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Bullpen;
      });
      return Home_Total_Runs;
    }
    $scope.Get_Away_Current_Score = function(Game, iteration) {
      var Away_Total_Runs = 0;
      Game.Away_Players.forEach(function(player) {
        Away_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Starting_P;
        Away_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Bullpen;
      });
      return Away_Total_Runs;
    }
    $scope.Clear_Games_Sim_Data = function() {
      $scope.Games.forEach(function(Game) {
        Game.Home_Players.forEach(function(player) {
          player.Sim_Data = [];
          player.Sim_FD_Points = 0;
        });
        Game.Away_Players.forEach(function(player) {
          player.Sim_Data = [];
          player.Sim_FD_Points = 0;

        });
        Game.Scores = [];
        Game.Inning_Scores = [];
      });
    }
    $scope.Clear_Game_Sim_Data = function(Game) {
      Game.Home_Players.forEach(function(player) {
        player.Sim_Data = [];
        player.Sim_FD_Points = 0;
      });
      Game.Away_Players.forEach(function(player) {
        player.Sim_Data = [];
        player.Sim_FD_Points = 0;

      });
      Game.Scores = [];
      Game.Inning_Scores = [];
    }
    $scope.Update_Game_Scores = function(Game, iteration) {
      var Home_Total_Runs = 0;
      Game.Home_Players.forEach(function(player) {
        Home_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Starting_P;
        Home_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Bullpen;

      });

      var Away_Total_Runs = 0;
      Game.Away_Players.forEach(function(player) {
        Away_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Starting_P;
        Away_Total_Runs += player.Sim_Data[iteration].Sim_R_VS_Bullpen;
      });

      Game.Scores.push({Home_Score: Home_Total_Runs, Away_Score: Away_Total_Runs});
    }

    $scope.Update_Game_Data = function(Game) {
      var Home_Total_Runs = 0;
      var Away_Total_Runs = 0;
      var Home_Won = 0;
      var Away_Won = 0;
      var Total_Game_Counter = 0;
      Game.Inning_Scores.forEach(function(game) {
        Home_Total_Runs += game[53].Home_Score;
        Away_Total_Runs += game[53].Away_Score;
        if(game[53].Home_Score > game[53].Away_Score) {
          Home_Won++;
        }
        else if (game[53].Away_Score > game[53].Home_Score) {
          Away_Won++;
        }
        Total_Game_Counter++;
      });
      Game.Home_Win_Percent = Home_Won / Total_Game_Counter;
      Game.Away_Win_Percent = Away_Won / Total_Game_Counter;

      Game.Home_Score_AVG = Home_Total_Runs / Total_Game_Counter;
      Game.Away_Score_AVG = Away_Total_Runs / Total_Game_Counter;
    }

    $scope.Update_Player_Fantasy_Scores = function(Game, iterations) {

      var Home_Total_Runs_VS_Starting_P = 0;
      var Away_Total_Runs_VS_Starting_P = 0;
      var Home_Total_Runs = 0;
      var Away_Total_Runs = 0;
      Game.Home_Players.forEach(function(player) {
        player.Sim_Data.forEach(function(Sim_Data) {
          if(player.Position !== 'P') {
            Home_Total_Runs_VS_Starting_P += Sim_Data.Sim_R_VS_Starting_P;
            Home_Total_Runs += Sim_Data.Sim_R_VS_Starting_P;
            Home_Total_Runs += Sim_Data.Sim_R_VS_Bullpen;
          }
        });
      });
      Game.Away_Players.forEach(function(player) {
        player.Sim_Data.forEach(function(Sim_Data) {
          if(player.Position !== 'P') {
            Away_Total_Runs_VS_Starting_P += Sim_Data.Sim_R_VS_Starting_P;
            Away_Total_Runs += Sim_Data.Sim_R_VS_Starting_P;
            Away_Total_Runs += Sim_Data.Sim_R_VS_Bullpen;
          }
        });
      });

      Game.Home_Players.forEach(function(player) {
        var Sim_Counter = 0;
        player.Sim_Data.forEach(function(Sim_Data) {

          if(player.Position !== 'P') {
            Home_Total_Runs_VS_Starting_P += Sim_Data.Sim_R_VS_Starting_P;
            Sim_Data.Sim_FD_Points = ((Sim_Data.Sim_R_VS_Starting_P * 3.2) + (Sim_Data.Sim_R_VS_Bullpen * 3.2) + (Sim_Data.Sim_BB * 3) + (Sim_Data.Sim_RBI * 3.5) + (Sim_Data.Sim_HBP * 3) + (Sim_Data.Sim_Single * 3)+ (Sim_Data.Sim_Double * 6)+ (Sim_Data.Sim_Triple * 9)+ (Sim_Data.Sim_HR * 12)+ (Sim_Data.Sim_SB * 6));
            Sim_Data.Sim_DK_Points = ((Sim_Data.Sim_R_VS_Starting_P * 2) + (Sim_Data.Sim_R_VS_Bullpen * 2) + (Sim_Data.Sim_BB * 2) + (Sim_Data.Sim_RBI * 2) + (Sim_Data.Sim_HBP * 2) + (Sim_Data.Sim_Single * 3)+ (Sim_Data.Sim_Double * 5)+ (Sim_Data.Sim_Triple * 8)+ (Sim_Data.Sim_HR * 10)+ (Sim_Data.Sim_SB * 5));

          }
          else {
            if(Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Away_Score < 4 && Sim_Data.Sim_P_IP > 17) {
              Sim_Data.Sim_P_QS = 1;
            }
            if(Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Away_Score < Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Home_Score && Game.Inning_Scores[Sim_Counter][53].Away_Score < Game.Inning_Scores[Sim_Counter][53].Home_Score  && Sim_Data.Sim_P_IP > 15) {
              Sim_Data.Sim_P_W = 1;
            }
            Sim_Data.Sim_FD_Points = ((Sim_Data.Sim_P_ER * -3) + (Sim_Data.Sim_P_SO * 3) + (Sim_Data.Sim_P_IP * 1) + (Sim_Data.Sim_P_W * 6) + (Sim_Data.Sim_P_QS * 4));
            Sim_Data.Sim_DK_Points = ((Sim_Data.Sim_P_ER * -2) + (Sim_Data.Sim_P_SO * 2) + ((Sim_Data.Sim_P_IP/3)*2.25) + (Sim_Data.Sim_P_W * 4) + (Sim_Data.Sim_P_H * -0.6)+ (Sim_Data.Sim_P_BB * -0.6)+ (Sim_Data.Sim_P_HBP * -0.6) + (Sim_Data.Sim_P_CG * 2.5) + (Sim_Data.Sim_P_CGSO * 2.5)+ (Sim_Data.Sim_P_NH * 5));

            Sim_Counter++;
          }

        });
        var FD_Points_Total = 0;
        for(var i = 0; i < player.Sim_Data.length; i++) {
            FD_Points_Total += player.Sim_Data[i].Sim_FD_Points;
        }
        var FD_AVG = FD_Points_Total / player.Sim_Data.length;
        player.Sim_FD_Points = FD_AVG;
      });

      Game.Away_Players.forEach(function(player) {
        var Sim_Counter = 0;

        player.Sim_Data.forEach(function(Sim_Data) {
          if(player.Position !== 'P') {
            Away_Total_Runs_VS_Starting_P += Sim_Data.Sim_R_VS_Starting_P;
            Sim_Data.Sim_FD_Points = ((Sim_Data.Sim_R_VS_Starting_P * 3.2) + (Sim_Data.Sim_R_VS_Bullpen * 3.2) + (Sim_Data.Sim_BB * 3) + (Sim_Data.Sim_RBI * 3.5) + (Sim_Data.Sim_HBP * 3) + (Sim_Data.Sim_Single * 3)+ (Sim_Data.Sim_Double * 6)+ (Sim_Data.Sim_Triple * 9)+ (Sim_Data.Sim_HR * 12)+ (Sim_Data.Sim_SB * 6));
            Sim_Data.Sim_DK_Points = ((Sim_Data.Sim_R_VS_Starting_P * 2) + (Sim_Data.Sim_R_VS_Bullpen * 2) + (Sim_Data.Sim_BB * 2) + (Sim_Data.Sim_RBI * 2) + (Sim_Data.Sim_HBP * 2) + (Sim_Data.Sim_Single * 3)+ (Sim_Data.Sim_Double * 5)+ (Sim_Data.Sim_Triple * 8)+ (Sim_Data.Sim_HR * 10)+ (Sim_Data.Sim_SB * 5));

          }
          else {
            if(Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Home_Score < 4 && Sim_Data.Sim_P_IP > 17) {
              Sim_Data.Sim_P_QS = 1;
            }
            if(Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Home_Score < Game.Inning_Scores[Sim_Counter][Sim_Data.Sim_P_IP].Away_Score && Game.Inning_Scores[Sim_Counter][53].Home_Score < Game.Inning_Scores[Sim_Counter][53].Away_Score && Sim_Data.Sim_P_IP > 15) {
              Sim_Data.Sim_P_W = 1;
            }
            Sim_Data.Sim_FD_Points = ((Sim_Data.Sim_P_ER * -3) + (Sim_Data.Sim_P_SO * 3) + (Sim_Data.Sim_P_IP * 1) + (Sim_Data.Sim_P_W * 6) + (Sim_Data.Sim_P_QS * 4));
            Sim_Data.Sim_DK_Points = ((Sim_Data.Sim_P_ER * -2) + (Sim_Data.Sim_P_SO * 2) + ((Sim_Data.Sim_P_IP/3)*2.25) + (Sim_Data.Sim_P_W * 4) + (Sim_Data.Sim_P_H * -0.6)+ (Sim_Data.Sim_P_BB * -0.6)+ (Sim_Data.Sim_P_HBP * -0.6) + (Sim_Data.Sim_P_CG * 2.5) + (Sim_Data.Sim_P_CGSO * 2.5)+ (Sim_Data.Sim_P_NH * 5));

            Sim_Counter++;
          }
        });
        var FD_Points_Total = 0;
        for(var i = 0; i < player.Sim_Data.length; i++) {
            FD_Points_Total += player.Sim_Data[i].Sim_FD_Points;
        }
        var FD_AVG = FD_Points_Total / player.Sim_Data.length;
        player.Sim_FD_Points = FD_AVG;
      });

      Game.Home_Score = Home_Total_Runs / iterations;
      Game.Away_Score = Away_Total_Runs / iterations;
    }

    $scope.Start_AB = function(Home_Team_Batting, Game, BO, Starting_P, Bases, Game_Num) {
      var Hitter_Index = 0;
      var Pitcher_Index = 0;
      var Hitter = null;
      var Pitcher = null;
      if(Home_Team_Batting) {
        Hitter_Index = Game.Home_Players.findIndex(obj => {
          return obj.Batting_Order === BO
        });
        Pitcher_Index = Game.Away_Players.findIndex(obj => {
          return obj.Position === 'P'
        });
        Hitter = Game.Home_Players[Hitter_Index];
        Pitcher = Game.Away_Players[Pitcher_Index];
      }
      else {
        Hitter_Index = Game.Away_Players.findIndex(obj => {
          return obj.Batting_Order === BO
        });
        Pitcher_Index = Game.Home_Players.findIndex(obj => {
          return obj.Position === 'P'
        });
        Hitter = Game.Away_Players[Hitter_Index];
        Pitcher = Game.Home_Players[Pitcher_Index];
      }

      //add player PA
      if(Home_Team_Batting) {
        Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_PA += 1;
        if(Starting_P) {
          Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_BF += 1;
        }
      }
      else {
        Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_PA += 1;
        if(Starting_P) {
          Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_BF += 1;
        }
      }


      //Stolen BASE LOGIC
      if(Bases.First_Base_On_Base && !Bases.Second_Base_On_Base) {
        var Random_Num_SB = Math.random();

        if(Home_Team_Batting) {
          //home team
          var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
            return obj.Player_ID === Bases.First_Base_Player_ID
          });
          if(Random_Num_SB < Game.Home_Players[On_Base_Player_Index].SB_PA) {
            //stolen base
            Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_SB += 1;
            //move first to second
            Bases.Second_Base_On_Base = true;
            Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
            Bases.First_Base_On_Base = false;
          }
        }
        else {
          //Away Team
          var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
            return obj.Player_ID === Bases.First_Base_Player_ID
          });
          if(Random_Num_SB < Game.Away_Players[On_Base_Player_Index].SB_PA) {
            //stolen base
            Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_SB += 1;
            //move first to second
            Bases.Second_Base_On_Base = true;
            Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
            Bases.First_Base_On_Base = false;
          }
        }
      }

      var Total_Odds = 1;
      var Hit_NH_Odds = this.Hit_NH(Hitter, Pitcher, Starting_P);//0 - hodds
      var SO_NSO_Odds = this.SO_NSO(Hitter, Pitcher, Starting_P);//hodd - soodds
      var BB_NBB_Odds = this.BB_NBB(Hitter, Pitcher, Starting_P);//soodds - bbodds
      var HBP_NHBP_Odds = this.HBP_NHBP(Hitter, Pitcher, Starting_P);//hbpodds - hbpodds

      if(isNaN(Hit_NH_Odds) || isNaN(SO_NSO_Odds) || isNaN(BB_NBB_Odds) || isNaN(HBP_NHBP_Odds))
      {
          console.log("NaN in hitng sim_ab odds area");
      }

      var Hit_Final_Odds = 0 + Hit_NH_Odds;
      var SO_Final_Odds = Hit_Final_Odds + SO_NSO_Odds;
      var BB_Final_Odds = SO_Final_Odds + BB_NBB_Odds;
      var HBP_Final_Odds = BB_Final_Odds + HBP_NHBP_Odds;

      var Random_Num = Math.random();




      if (Random_Num <= Hit_Final_Odds) {
        //hit
        var HR_NHR_Odds = this.HR_NHR(Hitter, Pitcher, Starting_P);//0 - hodds
        var Triple_NTriple_Odds = this.Triple_NTriple(Hitter, Pitcher, Starting_P);//hodd - soodds
        var Double_NDouble_Odds = this.Double_NDouble(Hitter, Pitcher, Starting_P);//soodds - bbodds

        var HR_Final_Odds = 0 + HR_NHR_Odds;
        var Triple_Final_Odds = HR_Final_Odds + Triple_NTriple_Odds;
        var Double_Final_Odds = Triple_Final_Odds + Double_NDouble_Odds;

        Random_Num = Math.random();
        if (Random_Num <= HR_Final_Odds) {
            //HR
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_HR += 1;
              if(Starting_P) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
              }
              else {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_HR += 1;
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_R += 1;
              if(Starting_P) {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;
            }

            //check third base
            if(Bases.Third_Base_On_Base) {
              if(Home_Team_Batting) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Third_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Third_Base_Player_ID
                });

                if(Starting_P) {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              Bases.Third_Base_On_Base = false;
            }
            //check second base
            if(Bases.Second_Base_On_Base) {
              if(Home_Team_Batting) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              Bases.Second_Base_On_Base = false;
            }
            //check first base
            if (Bases.First_Base_On_Base)
            {
                if(Home_Team_Batting) {
                  Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                  var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                    return obj.Player_ID === Bases.First_Base_Player_ID
                  });
                  if(Starting_P) {
                    Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                    Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                  }
                  else {
                    Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                  }
                }
                else {
                  Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                  var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                    return obj.Player_ID === Bases.First_Base_Player_ID
                  });
                  if(Starting_P) {
                    Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                    Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                  }
                  else {
                    Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                  }
                }
                Bases.First_Base_On_Base = false;
            }
            return 0;
        }
        else if(HR_Final_Odds < Random_Num && Random_Num <= Triple_Final_Odds) {
          //Triple
          if(Home_Team_Batting) {
            Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Triple += 1;
            if(Starting_P) {
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }
          else {
            Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Triple += 1;
            if(Starting_P) {
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }


          //BASES LOGIC
          //check third base
          if(Bases.Third_Base_On_Base) {
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
          }
          //check second base
          if(Bases.Second_Base_On_Base) {
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            Bases.Second_Base_On_Base = false;
          }
          //check first base
          if (Bases.First_Base_On_Base)
          {
              if(Home_Team_Batting) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              Bases.First_Base_On_Base = false;
          }
          //acutally add player to BASES
          Bases.Third_Base_On_Base = true;
          Bases.Third_Base_Player_ID = Hitter.Player_ID;
          return 0;

        } else if(Triple_Final_Odds < Random_Num && Random_Num <= Double_Final_Odds) {
          //Double
          if(Home_Team_Batting) {
            Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Double += 1;
            if(Starting_P) {
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }
          else {
            Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Double += 1;
            if(Starting_P) {
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }

          //BASES LOGIC
          //check third base
          if(Bases.Third_Base_On_Base) {
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }

            Bases.Third_Base_On_Base = false;
          }
          //check second base
          if(Bases.Second_Base_On_Base) {
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
          }
          //check first base
          if (Bases.First_Base_On_Base) {
            var Runner_Scoring_From_First_RND = Math.random();
            //Runners typically score from first ~45% of the time
            if(Runner_Scoring_From_First_RND < 0.45) {
              //runner scores
              if(Home_Team_Batting) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              Bases.First_Base_On_Base = false;
            } else {
              //runner goes to third
              if(Home_Team_Batting) {
                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              }
              else {
                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              }
              Bases.First_Base_On_Base = false;
            }

          }
          //acutally add player to BASES
          Bases.Second_Base_On_Base = true;
          Bases.Second_Base_Player_ID = Hitter.Player_ID;
          return 0;
        }
        else {
          //Single
          if(Home_Team_Batting) {
            Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Single += 1;
            if(Starting_P) {
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }
          else {
            Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_Single += 1;
            if(Starting_P) {
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_H += 1;
            }
          }

          //BASES LOGIC
          //check third base
          if(Bases.Third_Base_On_Base) {
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }

            Bases.Third_Base_On_Base = false;
          }
          //check second base
          if(Bases.Second_Base_On_Base) {

            var Runner_Scoring_From_Second_RND = Math.random();
            //Runners typically score from first ~60% of the time
            if(Runner_Scoring_From_Second_RND < 0.60) {
              //runner scores
              if(Home_Team_Batting) {
                Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
              else {
                Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                if(Starting_P) {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                  Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
                }
                else {
                  Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
                }
              }
            } else {
              //runner goes to third
              if(Home_Team_Batting) {
                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              }
              else {
                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              }
            }
            Bases.Second_Base_On_Base = false;

          }
          //check first base
          if (Bases.First_Base_On_Base) {
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
            }
          }

          //acutally add player to BASES
          Bases.First_Base_On_Base = true;
          Bases.First_Base_Player_ID = Hitter.Player_ID;


        }

        return 0;

      } else if(Hit_Final_Odds < Random_Num && Random_Num <= SO_Final_Odds) {
        //SO
        if(Home_Team_Batting) {
          Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_SO += 1;
          if(Starting_P) {
            Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_SO += 1;
            Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_IP += 1;
          }
        }
        else {
          Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_SO += 1;
          if(Starting_P) {
            Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_SO += 1;
            Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_IP += 1;
          }
        }
        return 1;
      }
      else if(SO_Final_Odds < Random_Num && Random_Num <= BB_Final_Odds) {
        //BB
        if(Home_Team_Batting) {
          Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_BB += 1;
          if(Starting_P) {
            Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_BB += 1;
          }
        }
        else {
          Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_BB += 1;
          if(Starting_P) {
            Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_BB += 1;
          }
        }

        //BASES LOGIC
        //Bases loaded
        if(Bases.Third_Base_On_Base && Bases.Second_Base_On_Base && Bases.First_Base_On_Base) {
          //move third home
          if(Home_Team_Batting) {
            Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

            var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
              return obj.Player_ID === Bases.Third_Base_Player_ID
            });
            if(Starting_P) {
              Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
            }
            else {
              Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
            }
          }
          else {
            Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

            var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
              return obj.Player_ID === Bases.Third_Base_Player_ID
            });
            if(Starting_P) {
              Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
            }
            else {
              Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
            }
          }
          Bases.Third_Base_On_Base = false;

          //move second to third
          if(Home_Team_Batting) {
            var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
              return obj.Player_ID === Bases.Second_Base_Player_ID
            });
            Bases.Third_Base_On_Base = true;
            Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
            Bases.Second_Base_On_Base = false;
          }
          else {
            var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
              return obj.Player_ID === Bases.Second_Base_Player_ID
            });
            Bases.Third_Base_On_Base = true;
            Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
            Bases.Second_Base_On_Base = false;
          }

          //move first to second
          if(Home_Team_Batting) {
            var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
              return obj.Player_ID === Bases.First_Base_Player_ID
            });
            Bases.Second_Base_On_Base = true;
            Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
            Bases.First_Base_On_Base = false;
          }
          else {
            var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
              return obj.Player_ID === Bases.First_Base_Player_ID
            });
            Bases.Second_Base_On_Base = true;
            Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
            Bases.First_Base_On_Base = false;
          }

          //move hitter to first
          Bases.First_Base_On_Base = true;
          Bases.First_Base_Player_ID = Hitter.Player_ID;

        }
        else {
          //Bases not loaded
          //check third base
          //nothing happens to third if bases not loaded

          //check if both second & first
          if(Bases.Second_Base_On_Base && Bases.First_Base_On_Base) {
            //move second to third
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              Bases.Third_Base_On_Base = true;
              Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              Bases.Second_Base_On_Base = false;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              Bases.Third_Base_On_Base = true;
              Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              Bases.Second_Base_On_Base = false;
            }
            //move first to second
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }
            //move hitter to first
            Bases.First_Base_On_Base = true;
            Bases.First_Base_Player_ID = Hitter.Player_ID;
          }
          else if (Bases.First_Base_On_Base) {
            //move first to second
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }
            //move hitter to first
            Bases.First_Base_On_Base = true;
            Bases.First_Base_Player_ID = Hitter.Player_ID;
          }
        }

          return 0;
        }
        else if (BB_Final_Odds < Random_Num && Random_Num <= HBP_Final_Odds) {
          //HBP
          if(Home_Team_Batting) {
            Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_HBP += 1;
            if(Starting_P) {
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_HBP += 1;
            }
          }
          else {
            Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_HBP += 1;
            if(Starting_P) {
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_HBP += 1;
            }
          }

          //BASES LOGIC
          //Bases loaded
          if(Bases.Third_Base_On_Base && Bases.Second_Base_On_Base && Bases.First_Base_On_Base) {
            //move third home
            if(Home_Team_Batting) {
              Game.Home_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Home_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            else {
              Game.Away_Players[Hitter_Index].Sim_Data[Game_Num].Sim_RBI += 1;

              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Third_Base_Player_ID
              });
              if(Starting_P) {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Starting_P += 1;
                Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_ER += 1;
              }
              else {
                Game.Away_Players[On_Base_Player_Index].Sim_Data[Game_Num].Sim_R_VS_Bullpen += 1;
              }
            }
            Bases.Third_Base_On_Base = false;

            //move second to third
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              Bases.Third_Base_On_Base = true;
              Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              Bases.Second_Base_On_Base = false;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.Second_Base_Player_ID
              });
              Bases.Third_Base_On_Base = true;
              Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              Bases.Second_Base_On_Base = false;
            }

            //move first to second
            if(Home_Team_Batting) {
              var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }
            else {
              var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                return obj.Player_ID === Bases.First_Base_Player_ID
              });
              Bases.Second_Base_On_Base = true;
              Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
              Bases.First_Base_On_Base = false;
            }

            //move hitter to first
            Bases.First_Base_On_Base = true;
            Bases.First_Base_Player_ID = Hitter.Player_ID;

          }
          else {
            //Bases not loaded
            //check third base
            //nothing happens to third if bases not loaded

            //check if both second & first
            if(Bases.Second_Base_On_Base && Bases.First_Base_On_Base) {
              //move second to third
              if(Home_Team_Batting) {
                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
                Bases.Second_Base_On_Base = false;
              }
              else {
                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.Second_Base_Player_ID
                });
                Bases.Third_Base_On_Base = true;
                Bases.Third_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
                Bases.Second_Base_On_Base = false;
              }
              //move first to second
              if(Home_Team_Batting) {
                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Second_Base_On_Base = true;
                Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
                Bases.First_Base_On_Base = false;
              }
              else {
                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Second_Base_On_Base = true;
                Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
                Bases.First_Base_On_Base = false;
              }
              //move hitter to first
              Bases.First_Base_On_Base = true;
              Bases.First_Base_Player_ID = Hitter.Player_ID;
            }
            else if (Bases.First_Base_On_Base) {
              //move first to second
              if(Home_Team_Batting) {
                var On_Base_Player_Index = Game.Home_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Second_Base_On_Base = true;
                Bases.Second_Base_Player_ID = Game.Home_Players[On_Base_Player_Index].Player_ID;
                Bases.First_Base_On_Base = false;
              }
              else {
                var On_Base_Player_Index = Game.Away_Players.findIndex(obj => {
                  return obj.Player_ID === Bases.First_Base_Player_ID
                });
                Bases.Second_Base_On_Base = true;
                Bases.Second_Base_Player_ID = Game.Away_Players[On_Base_Player_Index].Player_ID;
                Bases.First_Base_On_Base = false;
              }
              //move hitter to first
              Bases.First_Base_On_Base = true;
              Bases.First_Base_Player_ID = Hitter.Player_ID;
            }
          }
          return 0;
        }
        else {
          //Out
          if(Starting_P) {
            if(Home_Team_Batting) {
              Game.Away_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_IP += 1;
            }
            else {
              Game.Home_Players[Pitcher_Index].Sim_Data[Game_Num].Sim_P_IP += 1;
            }
          }

          return 1;
        }
        return 0;
      }


    $scope.HR_NHR = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;
      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.HR_H_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.HR_H_League_VS_L;
          Hitter_Stat_League_STD = Hitter.HR_H_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.HR_H_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.HR_H_League_VS_R;
          Hitter_Stat_League_STD = Hitter.HR_H_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.HR_H_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.HR_H_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.HR_H_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.HR_H_League_VS_L;
            Hitter_Stat_League_STD = Hitter.HR_H_League_VS_L_STD;

            Pitcher_Stat = Pitcher.HR_H_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.HR_H_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.HR_H_League_VS_R;
            Hitter_Stat_League_STD = Hitter.HR_H_League_VS_R_STD;

            Pitcher_Stat = Pitcher.HR_H_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.HR_H_VS_R_Regression + Hitter.HR_H_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.HR_H_League_VS_R + Hitter.HR_H_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.HR_H_League_VS_R_STD + Hitter.HR_H_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.HR_H_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.HR_H_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.HR_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.HR_H_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.HR_H_VS_R_Bullpen + Pitcher.HR_H_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.HR_H_League_VS_R + Pitcher.HR_H_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.HR_H_League_VS_R_STD+ Pitcher.HR_H_League_VS_L_STD)/2;
        }
      }


      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      if(Hitter.Hand === 'L') {
        Final_Z = Final_Z * Hitter.Stadium_Right_HR;
      }
      else {
        Final_Z = Final_Z * Hitter.Stadium_Left_HR;
      }

      return Final_Z;
    }

    $scope.Triple_NTriple = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.Triple_H_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.Triple_H_League_VS_L;
          Hitter_Stat_League_STD = Hitter.Triple_H_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.Triple_H_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.Triple_H_League_VS_R;
          Hitter_Stat_League_STD = Hitter.Triple_H_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.Triple_H_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.Triple_H_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.Triple_H_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.Triple_H_League_VS_L;
            Hitter_Stat_League_STD = Hitter.Triple_H_League_VS_L_STD;

            Pitcher_Stat = Pitcher.Triple_H_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.Triple_H_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.Triple_H_League_VS_R;
            Hitter_Stat_League_STD = Hitter.Triple_H_League_VS_R_STD;

            Pitcher_Stat = Pitcher.Triple_H_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.Triple_H_VS_R_Regression + Hitter.Triple_H_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.Triple_H_League_VS_R + Hitter.Triple_H_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.Triple_H_League_VS_R_STD + Hitter.Triple_H_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.Triple_H_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.Triple_H_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.Triple_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.Triple_H_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.Triple_H_VS_R_Bullpen + Pitcher.Triple_H_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.Triple_H_League_VS_R + Pitcher.Triple_H_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.Triple_H_League_VS_R_STD+ Pitcher.Triple_H_League_VS_L_STD)/2;
        }
      }



      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }
      if(Hitter.Hand === 'L') {
        Final_Z = Final_Z * Hitter.Stadium_Right_Triple;
      }
      else {
        Final_Z = Final_Z * Hitter.Stadium_Left_Triple;
      }
      return Final_Z;
    }

    $scope.Double_NDouble = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.Double_H_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.Double_H_League_VS_L;
          Hitter_Stat_League_STD = Hitter.Double_H_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.Double_H_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.Double_H_League_VS_R;
          Hitter_Stat_League_STD = Hitter.Double_H_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.Double_H_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.Double_H_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.Double_H_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.Double_H_League_VS_L;
            Hitter_Stat_League_STD = Hitter.Double_H_League_VS_L_STD;

            Pitcher_Stat = Pitcher.Double_H_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.Double_H_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.Double_H_League_VS_R;
            Hitter_Stat_League_STD = Hitter.Double_H_League_VS_R_STD;

            Pitcher_Stat = Pitcher.Double_H_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_L_STD;
          }
        }
      } else {
        //bullpen
        Hitter_Stat = (Hitter.Double_H_VS_R_Regression + Hitter.Double_H_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.Double_H_League_VS_R + Hitter.Double_H_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.Double_H_League_VS_R_STD + Hitter.Double_H_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.Double_H_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.Double_H_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.Double_H_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.Double_H_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.Double_H_VS_R_Bullpen + Pitcher.Double_H_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.Double_H_League_VS_R + Pitcher.Double_H_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.Double_H_League_VS_R_STD+ Pitcher.Double_H_League_VS_L_STD)/2;
        }
      }

      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;


      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }
      if(Hitter.Hand === 'L') {
        Final_Z = Final_Z * Hitter.Stadium_Right_Double;
      }
      else {
        Final_Z = Final_Z * Hitter.Stadium_Left_Double;
      }

      return Final_Z;
    }

    $scope.Hit_NH = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Pitcher.Hand === 'L') {
        Hitter_Stat = Hitter.H_PA_VS_L_Regression;
        Hitter_Stat_League_AVG = Hitter.H_PA_League_VS_L;
        Hitter_Stat_League_STD = Hitter.H_PA_League_VS_L_STD;
      }
      else if(Pitcher.Hand === 'R') {
        Hitter_Stat = Hitter.H_PA_VS_R_Regression;
        Hitter_Stat_League_AVG = Hitter.H_PA_League_VS_R;
        Hitter_Stat_League_STD = Hitter.H_PA_League_VS_R_STD;
      }
      if(Starting_P) {
        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.H_PA_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.H_PA_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.H_PA_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.H_PA_League_VS_L;
            Hitter_Stat_League_STD = Hitter.H_PA_League_VS_L_STD;

            Pitcher_Stat = Pitcher.H_PA_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.H_PA_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.H_PA_League_VS_R;
            Hitter_Stat_League_STD = Hitter.H_PA_League_VS_R_STD;

            Pitcher_Stat = Pitcher.H_PA_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.H_PA_VS_R_Regression + Hitter.H_PA_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.H_PA_League_VS_R + Hitter.H_PA_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.H_PA_League_VS_R_STD + Hitter.H_PA_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.H_PA_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.H_PA_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.H_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.H_PA_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.H_PA_VS_R_Bullpen + Pitcher.H_PA_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.H_PA_League_VS_R + Pitcher.H_PA_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.H_PA_League_VS_R_STD+ Pitcher.H_PA_League_VS_L_STD)/2;
        }
      }


      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }
      if(Hitter.Hand === 'L') {
        Final_Z = Final_Z * Hitter.Stadium_Right_AVG;
      }
      else {
        Final_Z = Final_Z * Hitter.Stadium_Left_AVG;
      }


      return Final_Z;
    }
    $scope.SO_NSO = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.SO_PA_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.SO_PA_League_VS_L;
          Hitter_Stat_League_STD = Hitter.SO_PA_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.SO_PA_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.SO_PA_League_VS_R;
          Hitter_Stat_League_STD = Hitter.SO_PA_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.SO_PA_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.SO_PA_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.SO_PA_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.SO_PA_League_VS_L;
            Hitter_Stat_League_STD = Hitter.SO_PA_League_VS_L_STD;

            Pitcher_Stat = Pitcher.SO_PA_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.SO_PA_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.SO_PA_League_VS_R;
            Hitter_Stat_League_STD = Hitter.SO_PA_League_VS_R_STD;

            Pitcher_Stat = Pitcher.SO_PA_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.SO_PA_VS_R_Regression + Hitter.SO_PA_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.SO_PA_League_VS_R + Hitter.SO_PA_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.SO_PA_League_VS_R_STD + Hitter.SO_PA_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.SO_PA_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.SO_PA_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.SO_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.SO_PA_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.SO_PA_VS_R_Bullpen + Pitcher.SO_PA_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.SO_PA_League_VS_R + Pitcher.SO_PA_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.SO_PA_League_VS_R_STD+ Pitcher.SO_PA_League_VS_L_STD)/2;
        }
      }



      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      return Final_Z;
    }

    $scope.BB_NBB = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.BB_PA_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.BB_PA_League_VS_L;
          Hitter_Stat_League_STD = Hitter.BB_PA_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.BB_PA_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.BB_PA_League_VS_R;
          Hitter_Stat_League_STD = Hitter.BB_PA_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.BB_PA_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.BB_PA_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.BB_PA_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.BB_PA_League_VS_L;
            Hitter_Stat_League_STD = Hitter.BB_PA_League_VS_L_STD;

            Pitcher_Stat = Pitcher.BB_PA_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.BB_PA_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.BB_PA_League_VS_R;
            Hitter_Stat_League_STD = Hitter.BB_PA_League_VS_R_STD;

            Pitcher_Stat = Pitcher.BB_PA_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.BB_PA_VS_R_Regression + Hitter.BB_PA_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.BB_PA_League_VS_R + Hitter.BB_PA_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.BB_PA_League_VS_R_STD + Hitter.BB_PA_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.BB_PA_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.BB_PA_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.BB_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.BB_PA_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.BB_PA_VS_R_Bullpen + Pitcher.BB_PA_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.BB_PA_League_VS_R + Pitcher.BB_PA_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.BB_PA_League_VS_R_STD+ Pitcher.BB_PA_League_VS_L_STD)/2;
        }
      }



      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      return Final_Z;
    }

    $scope.HBP_NHBP = function(Hitter, Pitcher, Starting_P) {

      var Hitter_Stat = null;
      var Hitter_Stat_League_AVG = null;
      var Hitter_Stat_League_STD = null;

      var Pitcher_Stat = null;
      var Pitcher_Stat_League_AVG = null;
      var Pitcher_Stat_League_STD = null;

      if(Starting_P) {
        if(Pitcher.Hand === 'L') {
          Hitter_Stat = Hitter.HBP_PA_VS_L_Regression;
          Hitter_Stat_League_AVG = Hitter.HBP_PA_League_VS_L;
          Hitter_Stat_League_STD = Hitter.HBP_PA_League_VS_L_STD;
        }
        else if(Pitcher.Hand === 'R') {
          Hitter_Stat = Hitter.HBP_PA_VS_R_Regression;
          Hitter_Stat_League_AVG = Hitter.HBP_PA_League_VS_R;
          Hitter_Stat_League_STD = Hitter.HBP_PA_League_VS_R_STD;
        }

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.HBP_PA_VS_L_Regression;
          Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.HBP_PA_VS_R_Regression;
          Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_R_STD;
        }
        else {
          if(Pitcher.Hand === 'L') {
            Hitter_Stat = Hitter.HBP_PA_VS_L_Regression;
            Hitter_Stat_League_AVG = Hitter.HBP_PA_League_VS_L;
            Hitter_Stat_League_STD = Hitter.HBP_PA_League_VS_L_STD;

            Pitcher_Stat = Pitcher.HBP_PA_VS_R_Regression;
            Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_R;
            Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_R_STD;
          }
          else {
            Hitter_Stat = Hitter.HBP_PA_VS_R_Regression;
            Hitter_Stat_League_AVG = Hitter.HBP_PA_League_VS_R;
            Hitter_Stat_League_STD = Hitter.HBP_PA_League_VS_R_STD;

            Pitcher_Stat = Pitcher.HBP_PA_VS_L_Regression;
            Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_L;
            Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_L_STD;
          }
        }
      }
      else {
        //bullpen
        Hitter_Stat = (Hitter.HBP_PA_VS_R_Regression + Hitter.HBP_PA_VS_L_Regression)/2;
        Hitter_Stat_League_AVG = (Hitter.HBP_PA_League_VS_R + Hitter.HBP_PA_League_VS_L)/2;
        Hitter_Stat_League_STD = (Hitter.HBP_PA_League_VS_R_STD + Hitter.HBP_PA_League_VS_L_STD)/2;

        if(Hitter.Hand === 'L') {
          Pitcher_Stat = Pitcher.HBP_PA_VS_L_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_L;
          Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_L_STD;
        }
        else if(Hitter.Hand === 'R') {
          Pitcher_Stat = Pitcher.HBP_PA_VS_R_Bullpen;
          Pitcher_Stat_League_AVG = Pitcher.HBP_PA_League_VS_R;
          Pitcher_Stat_League_STD = Pitcher.HBP_PA_League_VS_R_STD;
        }
        else {
          Pitcher_Stat = (Pitcher.HBP_PA_VS_R_Bullpen + Pitcher.HBP_PA_VS_L_Bullpen)/2;
          Pitcher_Stat_League_AVG = (Pitcher.HBP_PA_League_VS_R + Pitcher.HBP_PA_League_VS_L)/2;
          Pitcher_Stat_League_STD = (Pitcher.HBP_PA_League_VS_R_STD+ Pitcher.HBP_PA_League_VS_L_STD)/2;
        }
      }



      var AVG = (Hitter_Stat_League_AVG + Pitcher_Stat_League_AVG) / 2;
      var STD = (Hitter_Stat_League_STD + Pitcher_Stat_League_STD) / 2;

      var Batter_Z_Score = (Hitter_Stat - Hitter_Stat_League_AVG) / Hitter_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = Batter_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      return Final_Z;
    }
    $scope.Get_IP_Per_BF = function(Pitcher) {

      var Pitchers_Stat_VS_Opp = Pitcher.IP_TBF_VS_Opp_Regression;
      var Pitcher_Stat = Pitcher.IP_TBF_Regression;
      var Pitcher_Stat_League_AVG = Pitcher.IP_TBF_League_AVG;
      var Pitcher_Stat_League_STD = Pitcher.IP_TBF_League_STD;


      var AVG = Pitcher_Stat_League_AVG;
      var STD = Pitcher_Stat_League_STD;

      var VS_Opp_Z_Score = (Pitchers_Stat_VS_Opp - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = VS_Opp_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      return Final_Z;
    }
    $scope.Get_BF_Per_Game = function(Pitcher) {

      var Pitchers_Stat_VS_Opp = Pitcher.TBF_VS_Opp_Regression;
      var Pitcher_Stat = Pitcher.TBF_Regression;
      var Pitcher_Stat_League_AVG = Pitcher.TBF_League_AVG;
      var Pitcher_Stat_League_STD = Pitcher.TBF_League_STD;


      var AVG = Pitcher_Stat_League_AVG;
      var STD = Pitcher_Stat_League_STD;

      var VS_Opp_Z_Score = (Pitchers_Stat_VS_Opp - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;
      var Pitcher_Z_Score = (Pitcher_Stat - Pitcher_Stat_League_AVG) / Pitcher_Stat_League_STD;

      var Z_Score_Sum = VS_Opp_Z_Score + Pitcher_Z_Score;
      var Final_Z = AVG + (Z_Score_Sum * STD);

      if (Final_Z < 0)
      {
          Final_Z = 0;
      }

      return Final_Z;
    }
}]);
