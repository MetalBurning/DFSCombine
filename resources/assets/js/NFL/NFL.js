"use strict";
var NFLApp = angular.module('NFLApp', ['ui.bootstrap']);

NFLApp.filter('positionDK', function () {
    return function (allPlayers, searchPosition) {
        var filteredPlayers = [];
        allPlayers.forEach(function (player) {
            if (searchPosition == '' || searchPosition == undefined) {
              filteredPlayers.push(player);
            } else if(searchPosition === 'FLEX') {
              if(player._Position !== 'DST' && player._Position !== 'QB') {
                filteredPlayers.push(player);
              }
            } else if (player._Position.indexOf(searchPosition.replace(/[0-9]/g, '')) !== -1) {
              filteredPlayers.push(player);
            }
        });
        return filteredPlayers;
    };
})

NFLApp.filter('removeDupDrafts', function() {
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
NFLApp.filter('position', function () {
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

NFLApp.filter('removeInjured', function () {
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
NFLApp.filter('removeOut', function () {
    return function (allPlayers) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (element._playerInjured != 'danger') {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})
NFLApp.filter('team', function () {
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

NFLApp.filter('weeks', function () {
    return function (allPlayers, input) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (input.length == 0 || input == undefined) {
                filteredPlayers.push(element);
            }
            if (input.indexOf(element._WeekNum) > -1) {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})
NFLApp.filter('sort', function () {
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
NFLApp.filter('sumProjection', function () {
    return function (allPlayers) {
        var projectionSum = 0;
        allPlayers.forEach(function (player) {
            projectionSum = projectionSum + player._FPPG;
        });
        return projectionSum.toFixed(2);
    };
})
NFLApp.filter('sumActual', function () {
    return function (allPlayers) {
        var actualSum = 0;
        allPlayers.forEach(function (player) {
            actualSum = actualSum + player._ActualFantasyPoints;
        });
        return actualSum.toFixed(2);
    };
})
NFLApp.filter('playersInPosition', function () {
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
NFLApp.filter('removePosition', function () {
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
NFLApp.filter('checkValidOnly', function () {
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
NFLApp.filter('randomize', function () {
    return function (drafts) {
        var currentIndex = drafts.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = drafts[currentIndex];
            drafts[currentIndex] = drafts[randomIndex];
            drafts[randomIndex] = temporaryValue;
        }
        return drafts;
    };
})
NFLApp.filter('removeCalcDraft', function () {
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
          }else if(sortType === 'averageRank') {
            if (max >= draft.averageRank && draft.averageRank >= min) {
              filteredDrafts.push(draft);
            }
          }

        });
        return filteredDrafts;
    };
})

NFLApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

NFLApp.directive('setHeight', ['$window', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', $window.innerHeight - 200 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
}]);
NFLApp.directive('setHeightDrafts',['$window', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', ($window.innerHeight - 200) / 2 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
}]);
