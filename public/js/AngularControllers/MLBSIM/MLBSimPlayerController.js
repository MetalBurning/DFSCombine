angular.module('MLBApp').controller('MLBSimPlayerController', function ($scope, $uibModalInstance, $filter, players) {

    $scope.Players = players;
    $scope.Filter = 'Sim_FD_Points';
    $scope.ReverseOrder = true;

    $scope.Players = $filter('orderBy')($scope.Players, $scope.Filter, $scope.ReverseOrder);




    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
