onmessage = function(e) {
  console.log(e.data);
  var Drafts = BuildDrafts(e);
  self.postMessage(Drafts);
};

function BuildDrafts(playerData) {

  var _QBPlayerPool = playerData.data[0];
  var _RB1PlayerPool = playerData.data[1];
  var _RB2PlayerPool = playerData.data[2];
  var _WR1PlayerPool = playerData.data[3];
  var _WR2PlayerPool = playerData.data[4];
  var _WR3PlayerPool = playerData.data[5];
  var _TEPlayerPool = playerData.data[6];
  var _KPlayerPool = playerData.data[7];
  var _DSTPlayerPool = playerData.data[8];

  var tempDrafts = [];
  var tempPlayerNamesList = [];

  var totalPossibleCurrentDraftsCount = 0;
  var _AllDraftData = [];
  //start draft building
  _QBPlayerPool.forEach(function(QBPlayer) {
      var tempDraft = {};
      tempDraft['QB'] = QBPlayer;
      _RB1PlayerPool.forEach(function(RB1Player) {
        tempDraft['RB1'] = RB1Player;
        _RB2PlayerPool.forEach(function(RB2Player) {
          tempDraft['RB2'] = RB2Player;
          _WR1PlayerPool.forEach(function(WR1Player) {
            tempDraft['WR1'] = WR1Player;
            _WR2PlayerPool.forEach(function(WR2Player) {
              tempDraft['WR2'] = WR2Player;
              _WR3PlayerPool.forEach(function(WR3Player) {
                tempDraft['WR3'] = WR3Player;
                _TEPlayerPool.forEach(function(TEPlayer) {
                  tempDraft['TE'] = TEPlayer;
                  _KPlayerPool.forEach(function(KPlayer) {
                    tempDraft['K'] = KPlayer;
                    _DSTPlayerPool.forEach(function(DSTPlayer) {

                      totalPossibleCurrentDraftsCount++;
                      tempDraft['DST'] = DSTPlayer;

                      var finalPlayerList = [];
                      finalPlayerList.push(tempDraft['QB']);
                      finalPlayerList.push(tempDraft['RB1']);
                      finalPlayerList.push(tempDraft['RB2']);
                      finalPlayerList.push(tempDraft['WR1']);
                      finalPlayerList.push(tempDraft['WR2']);
                      finalPlayerList.push(tempDraft['WR3']);
                      finalPlayerList.push(tempDraft['TE']);
                      finalPlayerList.push(tempDraft['K']);
                      finalPlayerList.push(tempDraft['DST']);
                      //player name list
                      var tempPlayerNames = {};
                      tempPlayerNames['QB'] = [];
                      tempPlayerNames['RB'] = [];
                      tempPlayerNames['WR'] = [];
                      tempPlayerNames['TE'] = [];
                      tempPlayerNames['K'] = [];
                      tempPlayerNames['DST'] = [];
                      finalPlayerList.forEach(function(player) {
                        tempPlayerNames[player._Position].push(player);
                      });

                      //add only valid drafts
                      if(isDraftTeamValid(finalPlayerList) && isDraftSalaryValid(finalPlayerList) && !doesDraftHaveDupPlayers(finalPlayerList)) {
                        //_AllDrafts.push(tempDraft);
                        var tempDataObj = { FPPG: parseFloat(getDraftFPPG(finalPlayerList)),
                           Actual: parseFloat(getDraftActual(finalPlayerList)),
                           validTeam: isDraftTeamValid(finalPlayerList),
                           validSalary: isDraftSalaryValid(finalPlayerList),
                           salaryLeft: parseInt(getDraftSalaryLeft(finalPlayerList)),
                           players: finalPlayerList,
                           playerNames: tempPlayerNames,
                           playersPositionData: JSON.parse(JSON.stringify(tempDraft)),
                           displayDetails: false,
                           pointsPerDollar:  parseFloat(averageValue(finalPlayerList)),
                           averageRank: parseFloat(averageRank(finalPlayerList))
                         };
                         var sameDraft = false;
                         if(tempPlayerNamesList.length > 0) {
                           for(var j = tempPlayerNamesList.length-1; j >= 0; j--) {
                             var playersInDraft = 0;
                             if(tempPlayerNames['QB'].indexOf(tempPlayerNamesList[j]['QB'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['RB'].indexOf(tempPlayerNamesList[j]['RB'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['RB'].indexOf(tempPlayerNamesList[j]['RB'][1]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['WR'].indexOf(tempPlayerNamesList[j]['WR'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['WR'].indexOf(tempPlayerNamesList[j]['WR'][1]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['WR'].indexOf(tempPlayerNamesList[j]['WR'][2]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['TE'].indexOf(tempPlayerNamesList[j]['TE'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['K'].indexOf(tempPlayerNamesList[j]['K'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(tempPlayerNames['DST'].indexOf(tempPlayerNamesList[j]['DST'][0]) !== -1) {
                               playersInDraft++;
                             }
                             if(playersInDraft === 9) {
                               //same draft, dont add tempDraft
                               sameDraft = true;
                               break;
                             }
                           }
                           if(!sameDraft) {
                             _AllDraftData.push(tempDataObj);//store valid only
                             tempPlayerNamesList.push(tempPlayerNames);
                           }
                         } else {
                            _AllDraftData.push(tempDataObj);//store valid only
                            tempPlayerNamesList.push(tempPlayerNames);
                         }
                        //_AllDraftData.push(tempDataObj);//store valid only
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    return _AllDraftData;
}



  function isDraftTeamValid(draft) {
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
  function isDraftSalaryValid(draft) {
      var startingSalary = 60000;
      draft.forEach(function (player) {
          startingSalary = startingSalary - player._Salary;
      });
      return (startingSalary >= 0) ? true : false;
  }
  function doesDraftHaveDupPlayers(draft) {
    var players = [];
    var hasDups = false;
    draft.forEach(function (player) {
        if(players.indexOf(player._Name) > -1) {
          hasDups = true;
        } else {
          players.push(player._Name);
        }
    });
    return hasDups;
  }
  function getDraftFPPG(draft) {
      var totalFPPG = 0;
      draft.forEach(function (player) {
          totalFPPG = totalFPPG + player._FPPG;
      });
      totalFPPG = parseFloat(totalFPPG);
      return totalFPPG.toFixed(2);
  }
  function getDraftActual(draft) {
      var totalActual = 0;
      draft.forEach(function (player) {
          totalActual = totalActual + player._ActualFantasyPoints;
      });
      totalActual = parseFloat(totalActual);
      return totalActual.toFixed(2);
  }
  function getDraftSalaryLeft(draft) {
      var startingSalary = 60000;
      draft.forEach(function (player) {
          startingSalary = startingSalary - player._Salary;
      });
      startingSalary = parseInt(startingSalary);
      return startingSalary;
  }
  function averageValue(draft) {
    var value = 0;
    draft.forEach(function (player) {
        value = parseFloat(value) + parseFloat(player._ProjectedPointsPerDollar);
    });
    value = parseFloat(value);
    return (value / (draft.length)).toFixed(5);
  }
  function averageRank(finalPlayerList) {
    var average = 0;
    finalPlayerList.forEach(function(player) {
      average = average + player._Rank;
    });
    average = parseFloat(average / finalPlayerList.length);
    return (average).toFixed(2);
  }
