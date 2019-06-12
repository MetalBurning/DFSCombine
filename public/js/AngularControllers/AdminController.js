"use strict";
var AdminApp = angular.module('AdminApp', ['ui.bootstrap']);

AdminApp.controller('AdminController', ['$http', '$scope','$uibModal', '$window', function ($http, $scope, $uibModal, $window) {
  var admin = this;
  admin.SlateName = "";

  $scope._User = {};//_User.ends_at.date
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

  $scope.loadSlate = function (event) {

    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('csvFile', event.target.files[0]);
    formData.append('SlateName', admin.SlateName);
    formData.append('SlateDate', admin.SlateDate.toISOString().split('T')[0]);
    formData.append('SlateSite', admin.SlateSite);

    // console.log(admin.SlateName);

    $http.post("/admin/loadFDSlate", formData, {
        headers: {
            "Content-Type": undefined,
            transformRequest: angular.identity
        }
    }).then(function successCallBack(response) {
      $scope.displayNewMessage("success", "Slate data successfully added to DB");

    }, function errorCallBack(response) {
        console.log(response);
        $scope.displayNewMessage("danger", "Error: Something went wrong uploading slate data");
    });

    //clear input
    angular.forEach(
      angular.element("input[type='file']"),
      function(inputElem) {
        angular.element(inputElem).val(null);
      }
    );
  }
  $scope.uploadBDBFile = function (event) {

    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('csvFile', event.target.files[0]);


    $http.post("/admin/uploadBDBFile", formData, {
        headers: {
            "Content-Type": undefined,
            transformRequest: angular.identity
        }
    }).then(function successCallBack(response) {
      $scope.displayNewMessage("success", "Slate data successfully added to DB");

    }, function errorCallBack(response) {
        console.log(response);
        $scope.displayNewMessage("danger", "Error: Something went wrong uploading slate data");
    });

    //clear input
    angular.forEach(
      angular.element("input[type='file']"),
      function(inputElem) {
        angular.element(inputElem).val(null);
      }
    );
  }
}]);

AdminApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
