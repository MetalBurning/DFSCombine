"use strict";
var AccountApp = angular.module('AccountApp', ['ui.bootstrap']);

AccountApp.controller('AccountController', ['$http', '$scope','$uibModal', function ($http, $scope, $uibModal) {

  $scope._User = {};
  $scope.alerts = [
    { type: 'info', msg: 'Welcome!', number: 1 }
  ];


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

  $http.post("/accountDetails").then(function successCallBack(response) {
    console.log(response.data);
    $scope._User = response.data;
  }, function errorCallBack(response) {
      console.log(response);
      $scope.displayNewMessage("danger", "Error: Players could not be loaded.");
  });
}]);
