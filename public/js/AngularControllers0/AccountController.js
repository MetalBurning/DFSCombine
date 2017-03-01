"use strict";
var AccountApp = angular.module('AccountApp', ['ui.bootstrap']);

AccountApp.controller('AccountController', ['$http', '$scope','$uibModal', '$window', function ($http, $scope, $uibModal, $window) {

  $scope._User = {};//_User.ends_at.date
  $scope.alerts = [
    { type: 'info', msg: 'Welcome!', number: 1 }
  ];

  $scope.disabledUpdate = false;
  $scope.disabledSubButton = false;

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
      $scope.displayNewMessage("danger", "Error: account details could not be loaded.");
  });

  $scope.cancelSubscription = function() {
    $scope.disabledSubButton = true;
    $http.post("/cancelSubscription").then(function successCallBack(response) {
      $scope.displayNewMessage("warning", "Subscription cancelled.");
      $scope._User.onGracePeriod = true;
      $scope._User.ends_at = response.data;
      $scope.disabledSubButton = false;
    }, function errorCallBack(response) {
        $scope.disabledSubButton = false;
        $scope.displayNewMessage("danger", "Error: subscription not cancelled. Please contact support.");
    });
  }
  $scope.resumeSubscription = function() {
    $scope.disabledSubButton = true;
    $http.post("/resumeSubscription").then(function successCallBack(response) {
      $scope.displayNewMessage("success", "Subscription resumed.");
      $scope._User.onGracePeriod = false;
      $scope._User.ends_at = null;
      $scope.disabledSubButton = false;
    }, function errorCallBack(response) {
      $scope.disabledSubButton = false;
        $scope.displayNewMessage("danger", "Error: subscription not resumed. Please contact support.");
    });
  }
  $scope.updateEmail = function() {
    $scope.disabledUpdate = true;
    $http.post("/update", {'email': $scope._User.email} ).then(function successCallBack(response) {
      $scope.displayNewMessage("info", "Email updated.");
      $scope.disabledUpdate = false;
    }, function errorCallBack(response) {
        $scope.displayNewMessage("danger", "Error: email update failed. "+ response.data.email);
        $scope.disabledUpdate = false;
    });
  }
}]);
