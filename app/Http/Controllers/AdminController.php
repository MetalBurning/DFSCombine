<?php

namespace App\Http\Controllers;

use Auth;
use Response;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use stdClass;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function admin()
    {
        return view('admin');
    }

    public static function getPlayerID($name)
    {
      $playerID = -1;
      $playerID = DB::connection('mysql_NBA')->table('player_names')->select('id')->where('Full_Name', $name)->orWhere('Alias', $name)->orWhere('Alias2', $name)->orWhere('Alias1', $name)->value('id');
      // if($playerID == -1 || $playerID == null) {
      //   throw new Exception("Player ID not found: ".$name);
      // }
      return $playerID;
    }
    public static function getTeamID($team)
    {
      $teamID = -1;
      $teamID = DB::connection('mysql_NBA')->table('teams')->select('id')->where('FantasyCruncherTeam', $team)
      ->orWhere('SwishTeam', $team)->orWhere('SportsBookTeam', $team)->orWhere('BasketBall_Reference', $team)->orWhere('LineStar', $team)->value('id');
      return $teamID;
    }

    public function uploadBDBFile(Request $request)
    {
      $userID = Auth::user()->id;

      $this->validate($request, [
        'csvFile' => 'required|file|mimes:csv,txt',
      ]);

      $file = $request->file('csvFile');

      $firstLine = true;
      $players = [];
      try {
        $fileRead = fopen($file,"r");
        while(!feof($fileRead))
        {
          if(!$firstLine) {
            $data = fgetcsv($fileRead);

            $player = new stdClass();
            $player->Game_ID = $data[1];
            $player->Date = $data[2];
            $player->Name = $data[4];
            $player->Position = $data[5];
            $player->PlayerID = AdminController::getPlayerID($player->Name);
            $player->Team = $data[6];
            $player->Opponent = $data[7];
            $player->Team_ID = AdminController::getTeamID($player->Team);
            $player->Opponent_ID = AdminController::getTeamID($player->Opponent);
            if($data[8] == "R") {
              $player->Home = 0;
            }
            else {
              $player->Home = 1;
            }
            $player->Starter = $data[9];
            $player->Min = $data[10];
            $player->FG = $data[11];
            $player->FGA = $data[12];
            $player->ThreeP = $data[13];
            $player->ThreePA = $data[14];
            $player->FT = $data[15];
            $player->FTA = $data[16];
            $player->ORB = $data[17];
            $player->DRB = $data[18];
            $player->A = $data[20];
            $player->PF = $data[21];
            $player->ST = $data[22];
            $player->TO = $data[23];
            $player->BL = $data[24];
            $player->PTS = $data[25];
            $player->Usage = $data[26];
            $player->Days_Rest = $data[27];

            if($player->PlayerID != null) {
              //insert
              DB::connection('mysql_NBA')->table('BDB')->insert(
                  ['Game_ID' => $player->Game_ID, 'Player_ID' => $player->Player_ID, 'Date' => $player->Date, 'Position' => $player->Position,
                  'Team_ID' => $player->Team_ID, 'Opp_ID' => $player->Opp_ID, 'Home' => $player->Home, 'Starter' => $player->Starter,
                  'Min' => $player->Min, 'FG' => $player->FG, 'FGA' => $player->FGA, 'ThreeP' => $player->ThreeP, 'ThreePA' => $player->ThreePA,
                  'FT' => $player->FT, 'FTA' => $player->FTA, 'ORB' => $player->ORB, 'DRB' => $player->DRB, 'A' => $player->A, 'PF' => $player->PF,
                  'ST' => $player->ST, 'TO' => $player->TO, 'BL' => $player->BL, 'PTS' => $player->PTS, 'Usage' => $player->Usage, 'Days_Rest' => $player->Days_Rest]
              );
            }

          } else {
            $firstLine = false;
            fgetcsv($fileRead);
          }
        }
        fclose($fileRead);
      } catch(\Exception $e) {
        printf($e);
        $errorMessage = array('error' => 'Incorrect file structure.');
        return Response::json($errorMessage, 500);
      }
      return Response::json($players, 200);
    }

    public function loadFDSlate(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'csvFile' => 'required|file|mimes:csv,txt',
          'SlateName' => 'required|alpha_num',
          'SlateDate' => 'required|date',
          'SlateSite' => 'required|alpha'
        ]);

        $file = $request->file('csvFile');
        $Slate_Name = $request->SlateName;
        $Date = $request->SlateDate;
        $Site = $request->SlateSite;



        $firstLine = true;
        $players = [];
        try {
          $fileRead = fopen($file,"r");
          while(!feof($fileRead))
          {
            if(!$firstLine) {
              $data = fgetcsv($fileRead);

              if($Site == "FD") {
                $player = new stdClass();
                $player->_PlayerSlateID = $data[0];
                $player->_Position = $data[1];
                $player->_Name = $data[2] . " " . $data[4];
                $player->_PlayerID = AdminController::getPlayerID($player->_Name);
                $player->_FPPG = $data[5];
                $player->_ActualFantasyPoints = -1;
                $player->_GamesPlayed = $data[6];
                $player->_Salary = $data[7];
                $player->_Game = $data[8];
                $player->_Team = $data[9];
                $player->_Team_ID = AdminController::getTeamID($player->_Team);
                $player->_Opponent = $data[10];
                $player->_Opponent_ID = AdminController::getTeamID($player->_Opponent);
                $pos = strpos($player->_Game, "@");
                $firstTeam = trim(substr($player->_Game, 0, $pos));
                $secondTeam = trim(substr($player->_Game, ($pos+1), 3));

                if($firstTeam == $player->_Team) {
                  $player->_Home = 0;
                }
                else {
                  $player->_Home = 1;
                }
              }
              else if($Site == "DK") {
                $player = new stdClass();
                $player->_Position = $data[0];
                $player->_Name = $data[2];
                $player->_PlayerSlateID = $data[3];
                $player->_PlayerID = AdminController::getPlayerID($player->_Name);
                $player->_Salary = $data[5];
                $player->_Game = $data[6];
                $player->_Team = $data[7];

                $pos = strpos($player->_Game, "@");
                $firstTeam = trim(substr($player->_Game, 0, $pos));
                $secondTeam = trim(substr($player->_Game, ($pos+1), 3));

                if($firstTeam == $player->_Team) {
                  $player->_Home = 0;
                  $player->_Opponent = $secondTeam;
                }
                else if($secondTeam == $player->_Team){
                  $player->_Home = 1;
                  $player->_Opponent = $firstTeam;
                }
                $player->_Team_ID = AdminController::getTeamID($player->_Team);
                $player->_Opponent_ID = AdminController::getTeamID($player->_Opponent);
              }






              if($player->_PlayerSlateID != null) {
                //insert
                DB::connection('mysql_NBA')->table('slate_data')->insert(
                    ['Slate_Name' => $Slate_Name, 'Player_ID' => $player->_PlayerID, 'Date' => $Date, 'Player_Slate_ID' => $player->_PlayerSlateID,
                    'Salary' => $player->_Salary, 'Position' => $player->_Position, 'Team_ID' => $player->_Team_ID, 'Opp_ID' => $player->_Opponent_ID,
                    'Site' => $request->SlateSite, 'Home' => $player->_Home]
                );
              }

            } else {
              $firstLine = false;
              fgetcsv($fileRead);
            }
          }
          fclose($fileRead);
        } catch(\Exception $e) {
          printf($e);
          $errorMessage = array('error' => 'Incorrect file structure.');
          return Response::json($errorMessage, 500);
        }
        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'NBA', 'action' => 'playerLoad', 'actionDetails' =>  'FanDuel', 'actionDetailsLarge' => json_encode($players)]
        );
        return Response::json($players, 200);
    }



}
