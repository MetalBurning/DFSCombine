var NHLApp = angular.module('NHLApp', ['ui.bootstrap']);

NHLApp.filter('position', function () {
    return function (allPlayers, input) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (input == '' || input == undefined) {
                filteredPlayers.push(element);
            }
            if (element._Position == input) {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})

NHLApp.filter('team', function () {
    return function (allPlayers, input) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (input.length == 0 || input == undefined) {
                filteredPlayers.push(element);
            }
            if (input.indexOf(element._Team) > -1) {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})
NHLApp.filter('sort', function () {
    return function (allPlayers) {
        var filteredPlayers = [];

        var compare = function (a, b) {
            if (a._FPPG < b._FPPG)
                return -1;
            if (a._FPPG > b._FPPG)
                return 1;
            return 0;
        }
        allPlayers.sort(compare);
        allPlayers.reverse();
        return allPlayers;
    };
})
NHLApp.filter('sumProjection', function () {
    return function (allPlayers) {
        var projectionSum = 0;
        allPlayers.forEach(function (player) {
            projectionSum = projectionSum + player._FPPG;
        });
        return projectionSum.toFixed(2);
    };
})
NHLApp.filter('sumActual', function () {
    return function (allPlayers) {
        var actualSum = 0;
        allPlayers.forEach(function (player) {
            actualSum = actualSum + player._ActualFantasyPoints;
        });
        return actualSum.toFixed(2);
    };
})
NHLApp.filter('playersInPosition', function () {
    return function (allPlayers, position) {
        var totalPlayers = 0;
        allPlayers.forEach(function (player) {
            if(player._Position == position) {
                totalPlayers++;
            }
        });
        return totalPlayers;
    };
})
NHLApp.filter('removePosition', function () {
    return function (players, position) {
        var filteredPlayers = [];
        players.forEach(function (player) {
            if (player._Position != position) {
                filteredPlayers.push(player);
            }
        });
        return filteredPlayers;
    };
})
NHLApp.filter('checkValidOnly', function () {
    return function (drafts, valid) {
        var filteredDrafts = [];
        drafts.forEach(function (draft) {
            if (valid) {
                if (draft.validTeam && draft.validSalary) {
                    filteredDrafts.push(draft);
                }
            }
            else
            {
                filteredDrafts.push(draft);
            }

        });
        return filteredDrafts;
    };
})
NHLApp.filter('removeCalcDraft', function () {
    return function (drafts, AVERAGE, STDEVIATION) {
        var maxProjectionDraft = parseFloat(AVERAGE + STDEVIATION);
        var minProjectionDraft = parseFloat(AVERAGE - STDEVIATION);

        var filteredDrafts = [];
        drafts.forEach(function (draft) {
            if (minProjectionDraft <= draft.projection && draft.projection <= maxProjectionDraft) {
                filteredDrafts.push(draft);
            }
        });
        return filteredDrafts;
    };
})

NHLApp.directive('setHeight', [ '$window', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', $window.innerHeight - 200 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
}]);
NHLApp.directive('setHeightDrafts', [ '$window', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', ($window.innerHeight - 200) / 2 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
}]);
