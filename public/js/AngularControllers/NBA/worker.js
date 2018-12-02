onmessage = function(e) {
  //console.log(e.data);
  var Drafts = BuildDrafts(e);
  self.postMessage(Drafts);
};

function BuildDrafts(playerData) {

  var _PG1PlayerPool = playerData.data[0];
  var _PG2PlayerPool = playerData.data[1];
  var _SG1PlayerPool = playerData.data[2];
  var _SG2PlayerPool = playerData.data[3];
  var _SF1PlayerPool = playerData.data[4];
  var _SF2PlayerPool = playerData.data[5];
  var _PF1PlayerPool = playerData.data[6];
  var _PF2PlayerPool = playerData.data[7];
  var _CPlayerPool = playerData.data[8];
  var Settings = playerData.data[9];

  var tempDrafts = [];
  var tempPlayerNamesList = [];

  var totalPossibleCurrentDraftsCount = 0;
  var _AllDraftData = [];
  //start draft building
  _PG1PlayerPool.forEach(function(PG1Player) {
      var tempDraft = {};
      tempDraft['PG1'] = PG1Player;
      _PG2PlayerPool.forEach(function(PG2Player) {
        tempDraft['PG2'] = PG2Player;
        _SG1PlayerPool.forEach(function(SG1Player) {
          tempDraft['SG1'] = SG1Player;
          _SG2PlayerPool.forEach(function(SG2Player) {
            tempDraft['SG2'] = SG2Player;
            _SF1PlayerPool.forEach(function(SF1Player) {
              tempDraft['SF1'] = SF1Player;
              _SF2PlayerPool.forEach(function(SF2Player) {
                tempDraft['SF2'] = SF2Player;
                _PF1PlayerPool.forEach(function(PF1Player) {
                  tempDraft['PF1'] = PF1Player;
                  _PF2PlayerPool.forEach(function(PF2Player) {
                    tempDraft['PF2'] = PF2Player;
                    _CPlayerPool.forEach(function(CPlayer) {

                      totalPossibleCurrentDraftsCount++;

                      tempDraft['C'] = CPlayer;
                      var finalPlayerList = [];
                      finalPlayerList.push(tempDraft['PG1']);
                      finalPlayerList.push(tempDraft['PG2']);
                      finalPlayerList.push(tempDraft['SG1']);
                      finalPlayerList.push(tempDraft['SG2']);
                      finalPlayerList.push(tempDraft['SF1']);
                      finalPlayerList.push(tempDraft['SF2']);
                      finalPlayerList.push(tempDraft['PF1']);
                      finalPlayerList.push(tempDraft['PF2']);
                      finalPlayerList.push(tempDraft['C']);
                      //player name list
                      var tempPlayerNames = {};
                      tempPlayerNames['PG'] = [];
                      tempPlayerNames['SG'] = [];
                      tempPlayerNames['SF'] = [];
                      tempPlayerNames['PF'] = [];
                      tempPlayerNames['C'] = [];
                      finalPlayerList.forEach(function(player) {
                        tempPlayerNames[player._Position].push(player);
                      });

                      //add only valid drafts
                      if(isDraftTeamValid(finalPlayerList) && isDraftSalaryValid(finalPlayerList) && !doesDraftHaveDupPlayers(finalPlayerList) && hasValidSettings(finalPlayerList, Settings) && hasValidMinSalarySettings(finalPlayerList, Settings)) {
                        //_AllDrafts.push(tempDraft);
                        var tempDataObj = {
                           FPPG: parseFloat(getDraftFPPG(finalPlayerList)),
                           FPPGDrop: parseFloat(getDraftFPPGDrop(finalPlayerList)),
                           Actual: parseFloat(getDraftActual(finalPlayerList)),
                           ActualDrop: parseFloat(getDraftActualDrop(finalPlayerList)),
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
                               if(tempPlayerNames['PG'].indexOf(tempPlayerNamesList[j]['PG'][0]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['PG'].indexOf(tempPlayerNamesList[j]['PG'][1]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['SG'].indexOf(tempPlayerNamesList[j]['SG'][0]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['SG'].indexOf(tempPlayerNamesList[j]['SG'][1]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['SF'].indexOf(tempPlayerNamesList[j]['SF'][0]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['SF'].indexOf(tempPlayerNamesList[j]['SF'][1]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['PF'].indexOf(tempPlayerNamesList[j]['PF'][0]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['PF'].indexOf(tempPlayerNamesList[j]['PF'][1]) !== -1) {
                                 playersInDraft++;
                               }
                               if(tempPlayerNames['C'].indexOf(tempPlayerNamesList[j]['C'][0]) !== -1) {
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
  function hasValidSettings(draft, settings) {
    if(!settings.Use_Salary_Cap) {
      return true;
    }
    else
    {
      var players_with_valid_salary = [];

      draft.forEach(function (player) {
        if(player._Salary >= settings.Min_Salary_Cap && player._Salary < settings.Max_Salary_Cap) {
          players_with_valid_salary.push(player);
        }
      });

      if(players_with_valid_salary.length >= settings.Min_Num_Salary_Cap_Players) {
        return true;
      }
    }
    return false;
  }
  function hasValidMinSalarySettings(draft, settings) {
    if(!settings.Use_Min_Players) {
      return true;
    }
    else
    {
      var contains_player_in_settings = false;

      draft.forEach(function (player) {
        if(settings.Min_Players.indexOf(player) !== -1) {
          contains_player_in_settings = true;
        }
      });
      if(!contains_player_in_settings) {
        return true;
      }
      if(contains_player_in_settings && getDraftSalaryLeft(draft) <= settings.Min_Players_Salary_Left) {
        return true;
      }
    }
    return false;
  }
  function getDraftFPPG(draft) {
      var totalFPPG = 0;
      draft.forEach(function (player) {
          totalFPPG = totalFPPG + player._FPPG;
      });
      totalFPPG = parseFloat(totalFPPG);
      return totalFPPG.toFixed(2);
  }
  function getDraftFPPGDrop(draft) {
      //splice lowest score out
      var totalFPPG = [];
      draft.forEach(function (player) {
          totalFPPG.push(player._FPPG);
      });
      totalFPPG.sort(function(a, b){return a-b});
      totalFPPG.splice(0, 1);

      //sum
      var totalFPPGDropped = 0;
      totalFPPG.forEach(function (FPPG) {
          totalFPPGDropped = totalFPPGDropped + FPPG;
      });
      totalFPPGDropped = parseFloat(totalFPPGDropped);
      return totalFPPGDropped.toFixed(2);
  }
  function getDraftActual(draft) {
      var totalActual = 0;
      draft.forEach(function (player) {
          totalActual = totalActual + player._ActualFantasyPoints;
      });
      totalActual = parseFloat(totalActual);
      return totalActual.toFixed(2);
  }
  function getDraftActualDrop(draft) {
    //splice lowest score out
    var totalActual = [];
    draft.forEach(function (player) {
        totalActual.push(player._ActualFantasyPoints);
    });
    totalActual.sort(function(a, b){return a-b});
    totalActual.splice(0, 1);

    //sum
    var totalActualDropped = 0;
    totalActual.forEach(function (ActualFantasyPoints) {
        totalActualDropped = totalActualDropped + ActualFantasyPoints;
    });
    totalActualDropped = parseFloat(totalActualDropped);
    return totalActualDropped.toFixed(2);
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
