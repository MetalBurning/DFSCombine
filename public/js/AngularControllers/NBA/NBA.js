"use strict";
var NBAApp = angular.module('NBAApp', ['ui.bootstrap']);

NBAApp.filter('positionDK', function () {
    return function (allPlayers, searchPosition) {
        var filteredPlayers = [];
        if(searchPosition === 'UTIL') {
          return allPlayers;
        }
        allPlayers.forEach(function (player) {
            if (searchPosition == '' || searchPosition == undefined) {
              filteredPlayers.push(player);
            } else if (player._Position.indexOf(searchPosition) !== -1) {
              filteredPlayers.push(player);
            }
        });
        return filteredPlayers;
    };
})

NBAApp.filter('removeDupDrafts', function() {
  return function(allDrafts) {
    var tempDrafts = allDrafts;
    allDrafts.foreach(function(draft) {
      draft.players.forEach(function(player) {
        switch(player.Pos) {

        }
      });
    });
  }

});

NBAApp.filter('position', function () {
    return function (allPlayers, searchPosition) {
        var filteredPlayers = [];
        if(searchPosition === '' || searchPosition === null || searchPosition === undefined) {
          return allPlayers;
        }
        allPlayers.forEach(function (player) {
          if (searchPosition == '' || searchPosition == undefined) {
            filteredPlayers.push(player);
          } else if (searchPosition.indexOf(player._Position) !== -1) {
            filteredPlayers.push(player);
          }
        });
        return filteredPlayers;
    };
})

NBAApp.filter('removeInjured', function () {
    return function (allPlayers) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (element._playerInjured != 'danger' && element._playerInjured != 'warning') {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})

NBAApp.filter('team', function () {
    return function (allPlayers, team) {
        var filteredPlayers = [];
        if(team === 'All' || team === undefined || team === '' || team === null) {
          return allPlayers;
        }
        allPlayers.forEach(function (player) {
          if (team === player._Team) {
            filteredPlayers.push(player);
          }
        });
        return filteredPlayers;
    };
})
NBAApp.filter('sort', function () {
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
NBAApp.filter('sumProjection', function () {
    return function (allPlayers) {
        var projectionSum = 0;
        allPlayers.forEach(function (player) {
            projectionSum = projectionSum + player._FPPG;
        });
        return projectionSum.toFixed(2);
    };
})
NBAApp.filter('sumActual', function () {
    return function (allPlayers) {
        var actualSum = 0;
        allPlayers.forEach(function (player) {
            actualSum = actualSum + player._ActualFantasyPoints;
        });
        return actualSum.toFixed(2);
    };
})
NBAApp.filter('playersInPosition', function () {
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
NBAApp.filter('removePosition', function () {
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
NBAApp.filter('checkValidOnly', function () {
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
NBAApp.filter('removeCalcDraft', function () {
    return function (drafts, topRange, bottomRange, sortType ) {
        var max = parseFloat(topRange);
        var min = parseFloat(bottomRange);

        var filteredDrafts = [];
        drafts.forEach(function (draft) {
          if(sortType === 'FPPG') {
            if (max >= draft.FPPG && draft.FPPG >= min) {
              filteredDrafts.push(draft);
            }
          } else if(sortType === 'Actual') {
            if (max >= draft.Actual && draft.Actual >= min) {
              filteredDrafts.push(draft);
            }
          } else if(sortType === 'salaryLeft') {
            if (max >= draft.salaryLeft && draft.salaryLeft >= min) {
              filteredDrafts.push(draft);
            }
          } else if(sortType === 'pointsPerDollar') {
            if (max >= draft.pointsPerDollar && draft.pointsPerDollar >= min) {
              filteredDrafts.push(draft);
            }
          }

        });
        return filteredDrafts;
    };
})


NBAApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

NBAApp.directive('setHeight', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', $window.innerHeight - 200 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
});
NBAApp.directive('setHeightDrafts', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', ($window.innerHeight - 200) / 2 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
});
