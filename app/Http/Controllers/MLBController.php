<?php

namespace App\Http\Controllers;

use Auth;
use Response;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use stdClass;
use \App\library\Player;
use Illuminate\Support\Facades\Cache;

class MLBController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
      //  $this->middleware('subscribed');
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function MLB()
    {
        return view('MLB');
    }

    public function MLBSim(Request $request)
    {
      $userID = Auth::user()->id;

      $this->validate($request, [
        'Date' => 'required|date_format:Y-m-d'
      ]);
      $Date = $request->input('Date');

      $Hitters_On_Date = DB::connection('mysql_MLB')->select(
        "SELECT
        Player_ID,
        Team_ID,
        Opp_ID,
        Home_Game,
        Batting_Hand,
        Batting_Order,
        pn.Full_Name,
        tm.FantasyCruncherTeam AS Team,
        opp.FantasyCruncherTeam AS Opp
        FROM player_hitter_fc_stats
        INNER JOIN player_names AS pn ON pn.id = Player_ID
        INNER JOIN teams AS tm ON tm.id = Team_ID
        INNER JOIN teams AS opp ON opp.id = Opp_ID

        WHERE Raw_Date = '$Date' ");

        $Past_Most_Recent_Date = DB::connection('mysql_MLB')->select(
          "SELECT Distinct(Raw_Date) FROM mlbfd.player_hitter_fc_stats WHERE Raw_Date < '$Date' ORDER BY Raw_Date DESC LIMIT 1");

        if(count($Past_Most_Recent_Date) == 0) {
          $Past_Date = $Date;
        }
        else {
          $Past_Date  = date('Y-m-d', strtotime($Past_Most_Recent_Date[0]->Raw_Date));
        }

        $Next_Most_Recent_Date = DB::connection('mysql_MLB')->select(
          "SELECT Distinct(Raw_Date) FROM mlbfd.player_hitter_fc_stats WHERE Raw_Date > '$Date' ORDER BY Raw_Date ASC LIMIT 1");

        if(count($Next_Most_Recent_Date) == 0) {
          $Next_Date = $Date;
        }
        else {
          $Next_Date  = date('Y-m-d', strtotime($Next_Most_Recent_Date[0]->Raw_Date));
        }


        if(count($Hitters_On_Date) == 0) {

          $Most_Recent_Date = DB::connection('mysql_MLB')->select(
            "SELECT Distinct(Raw_Date) FROM mlbfd.player_hitter_fc_stats ORDER BY Raw_Date DESC LIMIT 1");
          $Date = date('Y-m-d', strtotime($Most_Recent_Date[0]->Raw_Date));

          return redirect('/MLBSim?Date='.$Date);

        }


      return view('MLBSim', ['Date' => $Date, 'Past_Date' => $Past_Date, 'Next_Date' => $Next_Date]);
    }

    public function MLBSimGetPlayers(Request $request)
    {
      $userID = Auth::user()->id;


      $this->validate($request, [
        'Date' => 'required|date_format:Y-m-d'
      ]);

      $Date = $request->input('Date');

      $Final_Hitters = array();
      $Final_Pitchers = array();

      $Date_30_Days = date('Y-m-d', strtotime('-300 days', strtotime($Date)));
      $Season_Start_2021 = date('Y-m-d', strtotime("03/01/2021"));
      $Season_Start_2020 = date('Y-m-d', strtotime("03/01/2020"));
      $Season_Start_2019 = date('Y-m-d', strtotime("03/01/2019"));
      $Season_Start_2018 = date('Y-m-d', strtotime("03/01/2018"));
      $Season_Start_2017 = date('Y-m-d', strtotime("03/01/2017"));

      $Recent_Hitters_Data = date('Y-m-d', strtotime('-7 days', strtotime($Date)));

      $Current_Season_Date = null;
      if($Season_Start_2021 < $Date) {
        $Current_Season_Date = $Season_Start_2021;
      }
      else if($Season_Start_2020 < $Date) {
        $Current_Season_Date = $Season_Start_2020;
      }
      else if($Season_Start_2019 < $Date) {
        $Current_Season_Date = $Season_Start_2019;
      }
      else if($Season_Start_2018 < $Date) {
        $Current_Season_Date = $Season_Start_2018;
      }
      else  {
        $Current_Season_Date = $Season_Start_2017;
      }




      if (Cache::has('All_Players_'.$Date)) {
        $Cache_Players = Cache::get('All_Players_'.$Date);
      //  print_r($Cache_Players);
        return json_encode($Cache_Players);
      }
      else {
        $Hitters_League = DB::connection('mysql_MLB')->select(
          "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            STD(l.H / l.PA) AS H_PA_STD,
            (SUM(l.Single) / SUM(l.H)) AS Single_H,
            STD(l.Single / l.H) AS Single_H_STD,
            (SUM(l.Doubles) / SUM(l.H)) AS Double_H,
            STD(l.Doubles / l.H) AS Double_H_STD,
            (SUM(l.Triple) / SUM(l.H)) AS Triple_H,
            STD(l.Triple / l.H) AS Triple_H_STD,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            STD(l.HR / l.H) AS HR_H_STD,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            STD(l.SB / l.PA) AS SB_PA_STD,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            STD(l.SO / l.PA) AS SO_PA_STD,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            STD(l.HBP / l.PA) AS HBP_PA_STD,
            (SUM(l.BB) / SUM(l.PA)) AS BB_PA,
            STD(l.BB / l.PA) AS BB_PA_STD,
            (SUM(l.Total_Pitches_Faced) / SUM(l.PA)) AS Pitches_PA,
            STD(l.Total_Pitches_Faced / l.PA) AS Pitches_PA_STD,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
          FROM bdb_data AS l
          WHERE l.Date < '$Date' "
          );

        $Hitters_League_VS_Left = DB::connection('mysql_MLB')->select(
          "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            STD(l.H / l.PA) AS H_PA_STD,
            (SUM(l.1B) / SUM(l.H)) AS Single_H,
            STD(l.1B / l.H) AS Single_H_STD,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            STD(l.2B / l.H) AS Double_H_STD,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            STD(l.3B / l.H) AS Triple_H_STD,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            STD(l.HR / l.H) AS HR_H_STD,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            STD(l.SB / l.PA) AS SB_PA_STD,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            STD(l.SO / l.PA) AS SO_PA_STD,
            (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
            STD(l.SF / l.PA) AS SF_PA_STD,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            STD(l.HBP / l.PA) AS HBP_PA_STD,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
            STD((l.BB+l.IBB) / l.PA) AS BB_PA_STD,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
          FROM hitter_data_lefties AS l
          WHERE l.Date < '$Date' "
          );
        $Hitters_League_VS_Right = DB::connection('mysql_MLB')->select(
          "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            STD(l.H / l.PA) AS H_PA_STD,
            (SUM(l.1B) / SUM(l.H)) AS Single_H,
            STD(l.1B / l.H) AS Single_H_STD,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            STD(l.2B / l.H) AS Double_H_STD,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            STD(l.3B / l.H) AS Triple_H_STD,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            STD(l.HR / l.H) AS HR_H_STD,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            STD(l.SB / l.PA) AS SB_PA_STD,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            STD(l.SO / l.PA) AS SO_PA_STD,
            (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
            STD(l.SF / l.PA) AS SF_PA_STD,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            STD(l.HBP / l.PA) AS HBP_PA_STD,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
            STD((l.BB+l.IBB) / l.PA) AS BB_PA_STD,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
          FROM hitter_data_righties AS l
          WHERE l.Date < '$Date' "
          );

          $Pitchers_League_VS_L = DB::connection('mysql_MLB')->select(
            "SELECT
              (SUM(l.H) / SUM(l.TBF)) AS H_PA,
              STD(l.H / l.TBF) AS H_PA_STD,
              (SUM(l.Singles) / SUM(l.H)) AS Single_H,
              STD(l.Singles / l.H) AS Single_H_STD,
              (SUM(l.2B) / SUM(l.H)) AS Double_H,
              STD(l.2B / l.H) AS Double_H_STD,
              (SUM(l.3B) / SUM(l.H)) AS Triple_H,
              STD(l.3B / l.H) AS Triple_H_STD,
              (SUM(l.HR) / SUM(l.H)) AS HR_H,
              STD(l.HR / l.H) AS HR_H_STD,
              (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
              STD(l.SO / l.TBF) AS SO_PA_STD,
              (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
              STD(l.HBP / l.TBF) AS HBP_PA_STD,
              (SUM(l.BB) / SUM(l.TBF)) AS BB_PA,
              STD(l.BB / l.TBF) AS BB_PA_STD,
              SUM(l.TBF) AS Total_PA,
              SUM(l.H) AS Total_H
            FROM pitcher_data_lefties AS l
            WHERE l.Date < '$Date' "
            );
          $Pitchers_League_VS_R = DB::connection('mysql_MLB')->select(
            "SELECT
              (SUM(l.H) / SUM(l.TBF)) AS H_PA,
              STD(l.H / l.TBF) AS H_PA_STD,
              (SUM(l.Singles) / SUM(l.H)) AS Single_H,
              STD(l.Singles / l.H) AS Single_H_STD,
              (SUM(l.2B) / SUM(l.H)) AS Double_H,
              STD(l.2B / l.H) AS Double_H_STD,
              (SUM(l.3B) / SUM(l.H)) AS Triple_H,
              STD(l.3B / l.H) AS Triple_H_STD,
              (SUM(l.HR) / SUM(l.H)) AS HR_H,
              STD(l.HR / l.H) AS HR_H_STD,
              (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
              STD(l.SO / l.TBF) AS SO_PA_STD,
              (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
              STD(l.HBP / l.TBF) AS HBP_PA_STD,
              (SUM(l.BB) / SUM(l.TBF)) AS BB_PA,
              STD(l.BB / l.TBF) AS BB_PA_STD,
              SUM(l.TBF) AS Total_PA,
              SUM(l.H) AS Total_H
            FROM pitcher_data_righties AS l
            WHERE l.Date < '$Date' "
            );
          $Pitchers_League = new Player();
          $Pitchers_League->H_PA_League = ($Pitchers_League_VS_L[0]->H_PA + $Pitchers_League_VS_R[0]->H_PA)/2;
          $Pitchers_League->H_PA_League_VS_L = $Pitchers_League_VS_L[0]->H_PA;
          $Pitchers_League->H_PA_League_VS_R = $Pitchers_League_VS_R[0]->H_PA;

          $Pitchers_League->H_PA_League_STD = ($Pitchers_League_VS_L[0]->H_PA_STD + $Pitchers_League_VS_R[0]->H_PA_STD)/2;
          $Pitchers_League->H_PA_League_VS_L_STD = $Pitchers_League_VS_L[0]->H_PA_STD;
          $Pitchers_League->H_PA_League_VS_R_STD = $Pitchers_League_VS_R[0]->H_PA_STD;

          $Pitchers_League->Single_H_League = ($Pitchers_League_VS_L[0]->Single_H + $Pitchers_League_VS_R[0]->Single_H)/2;
          $Pitchers_League->Single_H_League_VS_L = $Pitchers_League_VS_L[0]->Single_H;
          $Pitchers_League->Single_H_League_VS_R = $Pitchers_League_VS_R[0]->Single_H;

          $Pitchers_League->Single_H_League_STD = ($Pitchers_League_VS_L[0]->Single_H_STD + $Pitchers_League_VS_R[0]->Single_H_STD)/2;
          $Pitchers_League->Single_H_League_VS_L_STD = $Pitchers_League_VS_L[0]->Single_H_STD;
          $Pitchers_League->Single_H_League_VS_R_STD = $Pitchers_League_VS_R[0]->Single_H_STD;

          $Pitchers_League->Double_H_League = ($Pitchers_League_VS_L[0]->Double_H + $Pitchers_League_VS_R[0]->Double_H)/2;
          $Pitchers_League->Double_H_League_VS_L = $Pitchers_League_VS_L[0]->Double_H;
          $Pitchers_League->Double_H_League_VS_R = $Pitchers_League_VS_R[0]->Double_H;

          $Pitchers_League->Double_H_League_STD = ($Pitchers_League_VS_L[0]->Double_H_STD + $Pitchers_League_VS_R[0]->Double_H_STD)/2;
          $Pitchers_League->Double_H_League_VS_L_STD = $Pitchers_League_VS_L[0]->Double_H_STD;
          $Pitchers_League->Double_H_League_VS_R_STD = $Pitchers_League_VS_R[0]->Double_H_STD;

          $Pitchers_League->Triple_H_League = ($Pitchers_League_VS_L[0]->Triple_H + $Pitchers_League_VS_R[0]->Triple_H)/2;
          $Pitchers_League->Triple_H_League_VS_L = $Pitchers_League_VS_L[0]->Triple_H;
          $Pitchers_League->Triple_H_League_VS_R = $Pitchers_League_VS_R[0]->Triple_H;

          $Pitchers_League->Triple_H_League_STD = ($Pitchers_League_VS_L[0]->Triple_H_STD + $Pitchers_League_VS_R[0]->Triple_H_STD)/2;
          $Pitchers_League->Triple_H_League_VS_L_STD = $Pitchers_League_VS_L[0]->Triple_H_STD;
          $Pitchers_League->Triple_H_League_VS_R_STD = $Pitchers_League_VS_R[0]->Triple_H_STD;

          $Pitchers_League->HR_H_League = ($Pitchers_League_VS_L[0]->HR_H + $Pitchers_League_VS_R[0]->HR_H)/2;
          $Pitchers_League->HR_H_League_VS_L = $Pitchers_League_VS_L[0]->HR_H;
          $Pitchers_League->HR_H_League_VS_R = $Pitchers_League_VS_R[0]->HR_H;

          $Pitchers_League->HR_H_League_STD = ($Pitchers_League_VS_L[0]->HR_H_STD + $Pitchers_League_VS_R[0]->HR_H_STD)/2;
          $Pitchers_League->HR_H_League_VS_L_STD = $Pitchers_League_VS_L[0]->HR_H_STD;
          $Pitchers_League->HR_H_League_VS_R_STD = $Pitchers_League_VS_R[0]->HR_H_STD;

          $Pitchers_League->SO_PA_League = ($Pitchers_League_VS_L[0]->SO_PA + $Pitchers_League_VS_R[0]->SO_PA)/2;
          $Pitchers_League->SO_PA_League_VS_L = $Pitchers_League_VS_L[0]->SO_PA;
          $Pitchers_League->SO_PA_League_VS_R = $Pitchers_League_VS_R[0]->SO_PA;

          $Pitchers_League->SO_PA_League_STD = ($Pitchers_League_VS_L[0]->SO_PA_STD + $Pitchers_League_VS_R[0]->SO_PA_STD)/2;
          $Pitchers_League->SO_PA_League_VS_L_STD = $Pitchers_League_VS_L[0]->SO_PA_STD;
          $Pitchers_League->SO_PA_League_VS_R_STD = $Pitchers_League_VS_R[0]->SO_PA_STD;

          $Pitchers_League->HBP_PA_League = ($Pitchers_League_VS_L[0]->HBP_PA + $Pitchers_League_VS_R[0]->HBP_PA)/2;
          $Pitchers_League->HBP_PA_League_VS_L = $Pitchers_League_VS_L[0]->HBP_PA;
          $Pitchers_League->HBP_PA_League_VS_R = $Pitchers_League_VS_R[0]->HBP_PA;

          $Pitchers_League->HBP_PA_League_STD = ($Pitchers_League_VS_L[0]->HBP_PA_STD + $Pitchers_League_VS_R[0]->HBP_PA_STD)/2;
          $Pitchers_League->HBP_PA_League_VS_L_STD = $Pitchers_League_VS_L[0]->HBP_PA_STD;
          $Pitchers_League->HBP_PA_League_VS_R_STD = $Pitchers_League_VS_R[0]->HBP_PA_STD;

          $Pitchers_League->BB_PA_League = ($Pitchers_League_VS_L[0]->BB_PA + $Pitchers_League_VS_R[0]->BB_PA)/2;
          $Pitchers_League->BB_PA_League_VS_L = $Pitchers_League_VS_L[0]->BB_PA;
          $Pitchers_League->BB_PA_League_VS_R = $Pitchers_League_VS_R[0]->BB_PA;

          $Pitchers_League->BB_PA_League_STD = ($Pitchers_League_VS_L[0]->BB_PA_STD + $Pitchers_League_VS_R[0]->BB_PA_STD)/2;
          $Pitchers_League->BB_PA_League_VS_L_STD = $Pitchers_League_VS_L[0]->BB_PA_STD;
          $Pitchers_League->BB_PA_League_VS_R_STD = $Pitchers_League_VS_R[0]->BB_PA_STD;

          $Pitchers_League->Total_PA = ($Pitchers_League_VS_L[0]->Total_PA + $Pitchers_League_VS_R[0]->Total_PA)/2;
          $Pitchers_League->Total_H = ($Pitchers_League_VS_L[0]->Total_H + $Pitchers_League_VS_R[0]->Total_H)/2;

        $Hitters_On_Date = DB::connection('mysql_MLB')->select(
          "SELECT
          Player_ID,
          f.Team_ID,
          Opp_ID,
          Home_Game,
          Batting_Hand,
          Batting_Order,
          pn.Full_Name,
          tm.FantasyCruncherTeam AS Team,
          opp.FantasyCruncherTeam AS Opp,
          Stadium_ID,
          v.Projected_Runs AS Projected_Runs,
          f.Date
          FROM player_hitter_fc_stats AS f
          INNER JOIN player_names AS pn ON pn.id = Player_ID
          INNER JOIN teams AS tm ON tm.id = f.Team_ID
          INNER JOIN teams AS opp ON opp.id = Opp_ID
          INNER JOIN vegas AS v ON v.Team_ID = f.Team_ID AND v.Date = f.Raw_Date
          WHERE f.Raw_Date = '$Date' ");

        foreach ($Hitters_On_Date as &$singleHitter) {
          $newHitter = new Player();
          $newHitter->Player_ID = $singleHitter->Player_ID;
          $newHitter->Team_ID = $singleHitter->Team_ID;
          $newHitter->Opp_ID = $singleHitter->Opp_ID;
          $newHitter->Home = $singleHitter->Home_Game;
          $newHitter->Batting_Order = $singleHitter->Batting_Order;
          $newHitter->Hand = $singleHitter->Batting_Hand;
          $newHitter->Name = $singleHitter->Full_Name;
          $newHitter->Team = $singleHitter->Team;
          $newHitter->Opp = $singleHitter->Opp;
          $newHitter->Stadium_ID = $singleHitter->Stadium_ID;
          $newHitter->Vegas_Runs = $singleHitter->Projected_Runs;
          $newHitter->Date = $singleHitter->Date;

          $Hitter_VS_Left = DB::connection('mysql_MLB')->select(
            "SELECT
              (SUM(l.H) / SUM(l.PA)) AS H_PA,
              (SUM(l.1B) / SUM(l.H)) AS Single_H,
              (SUM(l.2B) / SUM(l.H)) AS Double_H,
              (SUM(l.3B) / SUM(l.H)) AS Triple_H,
              (SUM(l.HR) / SUM(l.H)) AS HR_H,
              (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
              (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
              (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
              (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
              ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
              SUM(l.PA) AS Total_PA,
              SUM(l.H) AS Total_H
            FROM hitter_data_lefties AS l
            INNER JOIN bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date
            WHERE l.Date < '$Date' AND l.Player_ID = $newHitter->Player_ID AND bd.Home = $newHitter->Home"
            );
          $newHitter->H_PA_VS_L = $Hitter_VS_Left[0]->H_PA;

          $newHitter->Single_H_VS_L = $Hitter_VS_Left[0]->Single_H;

          $newHitter->Double_H_VS_L = $Hitter_VS_Left[0]->Double_H;

          $newHitter->Triple_H_VS_L = $Hitter_VS_Left[0]->Triple_H;

          $newHitter->HR_H_VS_L = $Hitter_VS_Left[0]->HR_H;

          $newHitter->SB_PA_VS_L = $Hitter_VS_Left[0]->SB_PA;

          $newHitter->SO_PA_VS_L = $Hitter_VS_Left[0]->SO_PA;

          $newHitter->SF_PA_VS_L = $Hitter_VS_Left[0]->SF_PA;

          $newHitter->HBP_PA_VS_L = $Hitter_VS_Left[0]->HBP_PA;

          $newHitter->BB_PA_VS_L = $Hitter_VS_Left[0]->BB_PA;

          $newHitter->Total_PA_VS_L = $Hitter_VS_Left[0]->Total_PA;
          $newHitter->Total_H_VS_L = $Hitter_VS_Left[0]->Total_H;

          $Hitter_VS_Left_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            (SUM(l.1B) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM hitter_data_lefties AS l
              INNER JOIN bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date
              WHERE '$Recent_Hitters_Data' < l.Date AND l.Date < '$Date' AND l.Player_ID = $newHitter->Player_ID AND bd.Home = $newHitter->Home "
            );
            $newHitter->H_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->H_PA;

            $newHitter->Single_H_VS_L_Recent = $Hitter_VS_Left_Recent[0]->Single_H;

            $newHitter->Double_H_VS_L_Recent = $Hitter_VS_Left_Recent[0]->Double_H;

            $newHitter->Triple_H_VS_L_Recent = $Hitter_VS_Left_Recent[0]->Triple_H;

            $newHitter->HR_H_VS_L_Recent = $Hitter_VS_Left_Recent[0]->HR_H;

            $newHitter->SB_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->SB_PA;

            $newHitter->SO_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->SO_PA;

            $newHitter->SF_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->SF_PA;

            $newHitter->HBP_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->HBP_PA;

            $newHitter->BB_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->BB_PA;

            $newHitter->Total_PA_VS_L_Recent = $Hitter_VS_Left_Recent[0]->Total_PA;
            $newHitter->Total_H_VS_L_Recent = $Hitter_VS_Left_Recent[0]->Total_H;


          $Hitter_VS_Right = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            (SUM(l.1B) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM hitter_data_righties AS l
            INNER JOIN bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date
            WHERE l.Date < '$Date' AND l.Player_ID = $newHitter->Player_ID AND bd.Home = $newHitter->Home"
            );
            $newHitter->H_PA_VS_R = $Hitter_VS_Right[0]->H_PA;

            $newHitter->Single_H_VS_R = $Hitter_VS_Right[0]->Single_H;

            $newHitter->Double_H_VS_R = $Hitter_VS_Right[0]->Double_H;

            $newHitter->Triple_H_VS_R = $Hitter_VS_Right[0]->Triple_H;

            $newHitter->HR_H_VS_R = $Hitter_VS_Right[0]->HR_H;

            $newHitter->SB_PA_VS_R = $Hitter_VS_Right[0]->SB_PA;

            $newHitter->SO_PA_VS_R = $Hitter_VS_Right[0]->SO_PA;

            $newHitter->SF_PA_VS_R = $Hitter_VS_Right[0]->SF_PA;

            $newHitter->HBP_PA_VS_R = $Hitter_VS_Right[0]->HBP_PA;

            $newHitter->BB_PA_VS_R = $Hitter_VS_Right[0]->BB_PA;

            $newHitter->Total_PA_VS_R = $Hitter_VS_Right[0]->Total_PA;
            $newHitter->Total_H_VS_R = $Hitter_VS_Right[0]->Total_H;

          $Hitter_VS_Right_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.PA)) AS H_PA,
            (SUM(l.1B) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
            (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
            (SUM(l.SF) / SUM(l.PA)) AS SF_PA,
            (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.PA)) AS BB_PA,
            SUM(l.PA) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM hitter_data_righties AS l
              INNER JOIN bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date
              WHERE '$Recent_Hitters_Data' < l.Date AND l.Date < '$Date' AND l.Player_ID = $newHitter->Player_ID AND bd.Home = $newHitter->Home  "
            );
            $newHitter->H_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->H_PA;

            $newHitter->Single_H_VS_R_Recent = $Hitter_VS_Right_Recent[0]->Single_H;

            $newHitter->Double_H_VS_R_Recent = $Hitter_VS_Right_Recent[0]->Double_H;

            $newHitter->Triple_H_VS_R_Recent = $Hitter_VS_Right_Recent[0]->Triple_H;

            $newHitter->HR_H_VS_R_Recent = $Hitter_VS_Right_Recent[0]->HR_H;

            $newHitter->SB_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->SB_PA;

            $newHitter->SO_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->SO_PA;

            $newHitter->SF_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->SF_PA;

            $newHitter->HBP_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->HBP_PA;

            $newHitter->BB_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->BB_PA;

            $newHitter->Total_PA_VS_R_Recent = $Hitter_VS_Right_Recent[0]->Total_PA;
            $newHitter->Total_H_VS_R_Recent = $Hitter_VS_Right_Recent[0]->Total_H;


          $Hitters_VS_Both = DB::connection('mysql_MLB')->select(
            "SELECT
              (SUM(l.H) / SUM(l.PA)) AS H_PA,
              (SUM(l.Single) / SUM(l.H)) AS Single_H,
              (SUM(l.Doubles) / SUM(l.H)) AS Double_H,
              (SUM(l.Triple) / SUM(l.H)) AS Triple_H,
              (SUM(l.HR) / SUM(l.H)) AS HR_H,
              (SUM(l.SB) / SUM(l.PA)) AS SB_PA,
              (SUM(l.SO) / SUM(l.PA)) AS SO_PA,
              (SUM(l.HBP) / SUM(l.PA)) AS HBP_PA,
              (SUM(l.BB) / SUM(l.PA)) AS BB_PA,
              (SUM(l.Total_Pitches_Faced) / SUM(l.PA)) AS Pitches_PA,
              SUM(l.PA) AS Total_PA,
              SUM(l.H) AS Total_H
            FROM bdb_data AS l
            WHERE l.Date < '$Date' AND l.Player_ID = $newHitter->Player_ID "
            );

            $newHitter->H_PA = $Hitters_VS_Both[0]->H_PA;
            $newHitter->Single_H = $Hitters_VS_Both[0]->Single_H;
            $newHitter->Double_H = $Hitters_VS_Both[0]->Double_H;
            $newHitter->Triple_H = $Hitters_VS_Both[0]->Triple_H;
            $newHitter->HR_H = $Hitters_VS_Both[0]->HR_H;
            $newHitter->SB_PA = $Hitters_VS_Both[0]->SB_PA;
            $newHitter->SO_PA = $Hitters_VS_Both[0]->SO_PA;
            $newHitter->HBP_PA = $Hitters_VS_Both[0]->HBP_PA;
            $newHitter->BB_PA = $Hitters_VS_Both[0]->BB_PA;
            $newHitter->Pitches_PA = $Hitters_VS_Both[0]->Pitches_PA;
            $newHitter->Total_PA = $Hitters_VS_Both[0]->Total_PA;
            $newHitter->Total_H = $Hitters_VS_Both[0]->Total_H;


            //get league data
            $newHitter->H_PA_League = $Hitters_League[0]->H_PA;
            $newHitter->H_PA_League_VS_L = $Hitters_League_VS_Left[0]->H_PA;
            $newHitter->H_PA_League_VS_R = $Hitters_League_VS_Right[0]->H_PA;

            $newHitter->H_PA_League_STD = $Hitters_League[0]->H_PA_STD;
            $newHitter->H_PA_League_VS_L_STD = $Hitters_League_VS_Left[0]->H_PA_STD;
            $newHitter->H_PA_League_VS_R_STD = $Hitters_League_VS_Right[0]->H_PA_STD;

            $newHitter->Single_H_League = $Hitters_League[0]->Single_H;
            $newHitter->Single_H_League_VS_L = $Hitters_League_VS_Left[0]->Single_H;
            $newHitter->Single_H_League_VS_R = $Hitters_League_VS_Right[0]->Single_H;

            $newHitter->Single_H_League_STD = $Hitters_League[0]->Single_H_STD;
            $newHitter->Single_H_League_VS_L_STD = $Hitters_League_VS_Left[0]->Single_H_STD;
            $newHitter->Single_H_League_VS_R_STD = $Hitters_League_VS_Right[0]->Single_H_STD;

            $newHitter->Double_H_League = $Hitters_League[0]->Double_H;
            $newHitter->Double_H_League_VS_L = $Hitters_League_VS_Left[0]->Double_H;
            $newHitter->Double_H_League_VS_R = $Hitters_League_VS_Right[0]->Double_H;

            $newHitter->Double_H_League_STD = $Hitters_League[0]->Double_H_STD;
            $newHitter->Double_H_League_VS_L_STD = $Hitters_League_VS_Left[0]->Double_H_STD;
            $newHitter->Double_H_League_VS_R_STD = $Hitters_League_VS_Right[0]->Double_H_STD;

            $newHitter->Triple_H_League = $Hitters_League[0]->Triple_H;
            $newHitter->Triple_H_League_VS_L = $Hitters_League_VS_Left[0]->Triple_H;
            $newHitter->Triple_H_League_VS_R = $Hitters_League_VS_Right[0]->Triple_H;

            $newHitter->Triple_H_League_STD = $Hitters_League[0]->Triple_H_STD;
            $newHitter->Triple_H_League_VS_L_STD = $Hitters_League_VS_Left[0]->Triple_H_STD;
            $newHitter->Triple_H_League_VS_R_STD = $Hitters_League_VS_Right[0]->Triple_H_STD;

            $newHitter->HR_H_League = $Hitters_League[0]->HR_H;
            $newHitter->HR_H_League_VS_L = $Hitters_League_VS_Left[0]->HR_H;
            $newHitter->HR_H_League_VS_R = $Hitters_League_VS_Right[0]->HR_H;

            $newHitter->HR_H_League_STD = $Hitters_League[0]->HR_H_STD;
            $newHitter->HR_H_League_VS_L_STD = $Hitters_League_VS_Left[0]->HR_H_STD;
            $newHitter->HR_H_League_VS_R_STD = $Hitters_League_VS_Right[0]->HR_H_STD;

            $newHitter->SB_PA_League = $Hitters_League[0]->SB_PA;
            $newHitter->SB_PA_League_VS_L = $Hitters_League_VS_Left[0]->SB_PA;
            $newHitter->SB_PA_League_VS_R = $Hitters_League_VS_Right[0]->SB_PA;

            $newHitter->SB_PA_League_STD = $Hitters_League[0]->SB_PA_STD;
            $newHitter->SB_PA_League_VS_L_STD = $Hitters_League_VS_Left[0]->SB_PA_STD;
            $newHitter->SB_PA_League_VS_R_STD = $Hitters_League_VS_Right[0]->SB_PA_STD;

            $newHitter->SO_PA_League = $Hitters_League[0]->SO_PA;
            $newHitter->SO_PA_League_VS_L = $Hitters_League_VS_Left[0]->SO_PA;
            $newHitter->SO_PA_League_VS_R = $Hitters_League_VS_Right[0]->SO_PA;

            $newHitter->SO_PA_League_STD = $Hitters_League[0]->SO_PA_STD;
            $newHitter->SO_PA_League_VS_L_STD = $Hitters_League_VS_Left[0]->SO_PA_STD;
            $newHitter->SO_PA_League_VS_R_STD = $Hitters_League_VS_Right[0]->SO_PA_STD;

            $newHitter->HBP_PA_League = $Hitters_League[0]->HBP_PA;
            $newHitter->HBP_PA_League_VS_L = $Hitters_League_VS_Left[0]->HBP_PA;
            $newHitter->HBP_PA_League_VS_R = $Hitters_League_VS_Right[0]->HBP_PA;

            $newHitter->HBP_PA_League_STD = $Hitters_League[0]->HBP_PA_STD;
            $newHitter->HBP_PA_League_VS_L_STD = $Hitters_League_VS_Left[0]->HBP_PA_STD;
            $newHitter->HBP_PA_League_VS_R_STD = $Hitters_League_VS_Right[0]->HBP_PA_STD;

            $newHitter->BB_PA_League = $Hitters_League[0]->BB_PA;
            $newHitter->BB_PA_League_VS_L = $Hitters_League_VS_Left[0]->BB_PA;
            $newHitter->BB_PA_League_VS_R = $Hitters_League_VS_Right[0]->BB_PA;

            $newHitter->BB_PA_League_STD = $Hitters_League[0]->BB_PA_STD;
            $newHitter->BB_PA_League_VS_L_STD = $Hitters_League_VS_Left[0]->BB_PA_STD;
            $newHitter->BB_PA_League_VS_R_STD = $Hitters_League_VS_Right[0]->BB_PA_STD;

            $newHitter->Pitches_PA_League = $Hitters_League[0]->Pitches_PA;
            $newHitter->Pitches_PA_League_STD = $Hitters_League[0]->Pitches_PA_STD;

            $newHitter->Total_PA_League = $Hitters_League[0]->Total_PA;
            $newHitter->Total_H_League = $Hitters_League[0]->Total_H;


            $Stadium_Data = DB::connection('mysql_MLB')->select(
              "SELECT
                l.Left_HR,
                l.Left_Triple,
                l.Left_Double,
                l.Left_Single,
                l.Left_AVG,
                l.Right_HR,
                l.Right_Triple,
                l.Right_Double,
                l.Right_Single,
                l.Right_AVG
              FROM park_sw_data AS l
              WHERE l.Team_ID = $newHitter->Stadium_ID "
              );

              $newHitter->Stadium_Left_HR = $Stadium_Data[0]->Left_HR;
              $newHitter->Stadium_Left_Triple = $Stadium_Data[0]->Left_Triple;
              $newHitter->Stadium_Left_Double = $Stadium_Data[0]->Left_Double;
              $newHitter->Stadium_Left_Single = $Stadium_Data[0]->Left_Single;
              $newHitter->Stadium_Left_AVG = $Stadium_Data[0]->Left_AVG;
              $newHitter->Stadium_Right_HR = $Stadium_Data[0]->Right_HR;
              $newHitter->Stadium_Right_Triple = $Stadium_Data[0]->Right_Triple;
              $newHitter->Stadium_Right_Double = $Stadium_Data[0]->Right_Double;
              $newHitter->Stadium_Right_Single = $Stadium_Data[0]->Right_Single;
              $newHitter->Stadium_Right_AVG = $Stadium_Data[0]->Right_AVG;


            array_push($Final_Hitters, $newHitter);

        }

        //Pitcher DATA

        //Pitcher bullpen
        $Date_Minus_Days = date('Y-m-d', strtotime('-300 days', strtotime($Date)));

        $Team_Bullpen_Data_VS_L = DB::connection('mysql_MLB')->select(
          "SELECT
      		bd.Team_ID,
      		(SUM(l.H) / SUM(l.TBF)) AS H_PA,
          (SUM(l.Singles) / SUM(l.H)) AS Single_H,
          (SUM(l.2B) / SUM(l.H)) AS Double_H,
          (SUM(l.3B) / SUM(l.H)) AS Triple_H,
          (SUM(l.HR) / SUM(l.H)) AS HR_H,
          (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
          (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
          ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,
          SUM(l.TBF) AS Total_PA,
          SUM(l.H) AS Total_H
          FROM mlbfd.pitcher_data_lefties AS l
          INNER JOIN mlbfd.bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date AND bd.Starting_Pitcher = 0 AND bd.Total_Pitches > 0
          WHERE '$Date_Minus_Days' < bd.Date AND bd.Date < '$Date'
          GROUP BY bd.Team_ID"
          );
        $Team_Bullpen_Data_VS_R = DB::connection('mysql_MLB')->select(
          "SELECT
      		bd.Team_ID,
      		(SUM(l.H) / SUM(l.TBF)) AS H_PA,
          (SUM(l.Singles) / SUM(l.H)) AS Single_H,
          (SUM(l.2B) / SUM(l.H)) AS Double_H,
          (SUM(l.3B) / SUM(l.H)) AS Triple_H,
          (SUM(l.HR) / SUM(l.H)) AS HR_H,
          (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
          (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
          ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,
          SUM(l.TBF) AS Total_PA,
          SUM(l.H) AS Total_H
          FROM mlbfd.pitcher_data_righties AS l
          INNER JOIN mlbfd.bdb_data AS bd ON bd.Player_ID = l.Player_ID AND bd.Date = l.Date AND bd.Starting_Pitcher = 0 AND bd.Total_Pitches > 0
          WHERE '$Date_Minus_Days' < bd.Date AND bd.Date < '$Date'
          GROUP BY bd.Team_ID"
          );

        //Actual Pitcher Data
        $Pitchers_On_Date = DB::connection('mysql_MLB')->select(
          "SELECT
          Player_ID,
          f.Team_ID,
          Opp_ID,
          Home_Game,
          Pitching_Hand,
          pn.Full_Name,
          tm.FantasyCruncherTeam AS Team,
          opp.FantasyCruncherTeam AS Opp,
          Stadium_ID,
          v.Projected_Runs AS Projected_Runs,
          f.Date
          FROM player_pitcher_fc_stats AS f
          INNER JOIN player_names AS pn ON pn.id = Player_ID
          INNER JOIN teams AS tm ON tm.id = Team_ID
          INNER JOIN teams AS opp ON opp.id = Opp_ID
          INNER JOIN vegas AS v ON v.Team_ID = f.Team_ID AND v.Date = f.Raw_Date
          WHERE f.Raw_Date = '$Date' ");

        foreach ($Pitchers_On_Date as &$singlePitcher) {
          $newPitcher = new Player();
          $newPitcher->Player_ID = $singlePitcher->Player_ID;
          $newPitcher->Team_ID = $singlePitcher->Team_ID;
          $newPitcher->Opp_ID = $singlePitcher->Opp_ID;
          $newPitcher->Home = $singlePitcher->Home_Game;
          $newPitcher->Hand = $singlePitcher->Pitching_Hand;
          $newPitcher->Name = $singlePitcher->Full_Name;
          $newPitcher->Team = $singlePitcher->Team;
          $newPitcher->Opp = $singlePitcher->Opp;
          $newPitcher->Position = "P";
          $newPitcher->Stadium_ID = $singlePitcher->Stadium_ID;
          $newPitcher->Vegas_Runs = $singlePitcher->Projected_Runs;
          $newPitcher->Date = $singlePitcher->Date;

          $Pitcher_VS_Left = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.TBF)) AS H_PA,
            (SUM(l.Singles) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
            (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,

            SUM(l.TBF) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM pitcher_data_lefties AS l
            WHERE l.Date < '$Date' AND l.Player_ID = $newPitcher->Player_ID "
            );
          $newPitcher->H_PA_VS_L = $Pitcher_VS_Left[0]->H_PA;

          $newPitcher->Single_H_VS_L = $Pitcher_VS_Left[0]->Single_H;

          $newPitcher->Double_H_VS_L = $Pitcher_VS_Left[0]->Double_H;

          $newPitcher->Triple_H_VS_L = $Pitcher_VS_Left[0]->Triple_H;

          $newPitcher->HR_H_VS_L = $Pitcher_VS_Left[0]->HR_H;

          $newPitcher->SO_PA_VS_L = $Pitcher_VS_Left[0]->SO_PA;

          $newPitcher->HBP_PA_VS_L = $Pitcher_VS_Left[0]->HBP_PA;

          $newPitcher->BB_PA_VS_L = $Pitcher_VS_Left[0]->BB_PA;

          $newPitcher->Total_PA_VS_L = $Pitcher_VS_Left[0]->Total_PA;
          $newPitcher->Total_H_VS_L = $Pitcher_VS_Left[0]->Total_H;

          $Pitcher_VS_Left_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.TBF)) AS H_PA,
            (SUM(l.Singles) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
            (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,

            SUM(l.TBF) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM  pitcher_data_lefties AS l WHERE '$Current_Season_Date' < l.Date AND l.Date < '$Date' AND l.Player_ID = $newPitcher->Player_ID "
            );
          $newPitcher->H_PA_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->H_PA;

          $newPitcher->Single_H_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->Single_H;

          $newPitcher->Double_H_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->Double_H;

          $newPitcher->Triple_H_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->Triple_H;

          $newPitcher->HR_H_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->HR_H;

          $newPitcher->SO_PA_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->SO_PA;

          $newPitcher->HBP_PA_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->HBP_PA;

          $newPitcher->BB_PA_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->BB_PA;

          $newPitcher->Total_PA_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->Total_PA;
          $newPitcher->Total_H_VS_L_Recent = $Pitcher_VS_Left_Recent[0]->Total_H;


          $Pitcher_VS_Right = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.TBF)) AS H_PA,
            (SUM(l.Singles) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
            (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,

            SUM(l.TBF) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM pitcher_data_righties AS l
            WHERE l.Date < '$Date' AND l.Player_ID = $newPitcher->Player_ID "
            );
            $newPitcher->H_PA_VS_R = $Pitcher_VS_Right[0]->H_PA;
            $newPitcher->Single_H_VS_R = $Pitcher_VS_Right[0]->Single_H;

            $newPitcher->Double_H_VS_R = $Pitcher_VS_Right[0]->Double_H;

            $newPitcher->Triple_H_VS_R = $Pitcher_VS_Right[0]->Triple_H;

            $newPitcher->HR_H_VS_R = $Pitcher_VS_Right[0]->HR_H;

            $newPitcher->SO_PA_VS_R = $Pitcher_VS_Right[0]->SO_PA;

            $newPitcher->HBP_PA_VS_R = $Pitcher_VS_Right[0]->HBP_PA;

            $newPitcher->BB_PA_VS_R = $Pitcher_VS_Right[0]->BB_PA;

            $newPitcher->Total_PA_VS_R = $Pitcher_VS_Right[0]->Total_PA;
            $newPitcher->Total_H_VS_R = $Pitcher_VS_Right[0]->Total_H;

          $Pitcher_VS_Right_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            (SUM(l.H) / SUM(l.TBF)) AS H_PA,
            (SUM(l.Singles) / SUM(l.H)) AS Single_H,
            (SUM(l.2B) / SUM(l.H)) AS Double_H,
            (SUM(l.3B) / SUM(l.H)) AS Triple_H,
            (SUM(l.HR) / SUM(l.H)) AS HR_H,
            (SUM(l.SO) / SUM(l.TBF)) AS SO_PA,
            (SUM(l.HBP) / SUM(l.TBF)) AS HBP_PA,
            ((SUM(l.BB) + SUM(l.IBB)) / SUM(l.TBF)) AS BB_PA,

            SUM(l.TBF) AS Total_PA,
            SUM(l.H) AS Total_H
            FROM  pitcher_data_righties AS l WHERE '$Current_Season_Date' < l.Date AND l.Date < '$Date'  "
            );
            $newPitcher->H_PA_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->H_PA;
            $newPitcher->Single_H_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->Single_H;

            $newPitcher->Double_H_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->Double_H;

            $newPitcher->Triple_H_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->Triple_H;

            $newPitcher->HR_H_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->HR_H;

            $newPitcher->SO_PA_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->SO_PA;

            $newPitcher->HBP_PA_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->HBP_PA;

            $newPitcher->BB_PA_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->BB_PA;

            $newPitcher->Total_PA_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->Total_PA;
            $newPitcher->Total_H_VS_R_Recent = $Pitcher_VS_Right_Recent[0]->Total_H;

          $Pitcher_Inning_Data_VS_Opp = DB::connection('mysql_MLB')->select(
            "SELECT
            SUM(l.IP) / SUM(l.BF) AS IP_BF,
            AVG(l.BF) AS TBF_VS_Opp
            FROM bdb_data AS l
            WHERE l.Date < '$Date' AND l.Opp_ID = $newPitcher->Opp_ID AND l.Starting_Pitcher = 1 AND l.Home = $newPitcher->Home "
            );

          $newPitcher->IP_TBF_VS_Opp = $Pitcher_Inning_Data_VS_Opp[0]->IP_BF;
          $newPitcher->TBF_VS_Opp = $Pitcher_Inning_Data_VS_Opp[0]->TBF_VS_Opp;

          $Pitcher_Inning_Data_VS_Opp_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            SUM(l.IP) / SUM(l.BF) AS IP_BF,
            AVG(l.BF) AS TBF_VS_Opp
            FROM  bdb_data AS l WHERE '$Current_Season_Date' < l.Date AND l.Date < '$Date' AND l.Opp_ID = $newPitcher->Opp_ID AND l.Starting_Pitcher = 1  "
            );

          $newPitcher->IP_TBF_VS_Opp_Recent = $Pitcher_Inning_Data_VS_Opp_Recent[0]->IP_BF;
          $newPitcher->TBF_VS_Opp_Recent = $Pitcher_Inning_Data_VS_Opp_Recent[0]->TBF_VS_Opp;

          $Pitcher_Inning_Data = DB::connection('mysql_MLB')->select(
            "SELECT
            SUM(l.IP) / SUM(l.BF) AS IP_BF,
            AVG(l.BF) AS TBF
            FROM bdb_data AS l
            WHERE l.Date < '$Date' AND l.Player_ID = $newPitcher->Player_ID AND l.Starting_Pitcher = 1"
            );
          $newPitcher->IP_TBF = $Pitcher_Inning_Data[0]->IP_BF;
          $newPitcher->TBF = $Pitcher_Inning_Data[0]->TBF;

          $Pitcher_Inning_Data_Recent = DB::connection('mysql_MLB')->select(
            "SELECT
            SUM(l.IP) / SUM(l.BF) AS IP_BF,
            AVG(l.BF) AS TBF
            FROM  bdb_data AS l WHERE '$Current_Season_Date' < l.Date AND l.Date < '$Date' AND l.Player_ID = $newPitcher->Player_ID AND l.Starting_Pitcher = 1  "
            );
          $newPitcher->IP_TBF_Recent = $Pitcher_Inning_Data_Recent[0]->IP_BF;
          $newPitcher->TBF_Recent = $Pitcher_Inning_Data_Recent[0]->TBF;

          $Pitcher_Inning_Data_League = DB::connection('mysql_MLB')->select(
            "SELECT
            SUM(l.IP) / SUM(l.BF) AS IP_BF_AVG,
            STD(l.IP / l.BF) AS IP_BF_STD,
            AVG(l.BF) AS BF_AVG,
            STD(l.BF) AS BF_STD

            FROM bdb_data AS l
            WHERE l.Date < '$Date' AND l.Starting_Pitcher = 1"
            );
          $newPitcher->IP_TBF_League_AVG = $Pitcher_Inning_Data_League[0]->IP_BF_AVG;
          $newPitcher->IP_TBF_League_STD = $Pitcher_Inning_Data_League[0]->IP_BF_STD;
          $newPitcher->TBF_League_AVG = $Pitcher_Inning_Data_League[0]->BF_AVG;
          $newPitcher->TBF_League_STD = $Pitcher_Inning_Data_League[0]->BF_STD;


          $newPitcher->H_PA_League = $Pitchers_League->H_PA_League;
          $newPitcher->H_PA_League_VS_L = $Pitchers_League->H_PA_League_VS_L;
          $newPitcher->H_PA_League_VS_R = $Pitchers_League->H_PA_League_VS_R;

          $newPitcher->H_PA_League_STD = $Pitchers_League->H_PA_League_STD;
          $newPitcher->H_PA_League_VS_L_STD = $Pitchers_League->H_PA_League_VS_L_STD;
          $newPitcher->H_PA_League_VS_R_STD = $Pitchers_League->H_PA_League_VS_R_STD;

          $newPitcher->Single_H_League = $Pitchers_League->Single_H_League;
          $newPitcher->Single_H_League_VS_L = $Pitchers_League->Single_H_League_VS_L;
          $newPitcher->Single_H_League_VS_R = $Pitchers_League->Single_H_League_VS_R;

          $newPitcher->Single_H_League_STD = $Pitchers_League->Single_H_League_STD;
          $newPitcher->Single_H_League_VS_L_STD = $Pitchers_League->Single_H_League_VS_L_STD;
          $newPitcher->Single_H_League_VS_R_STD = $Pitchers_League->Single_H_League_VS_R_STD;

          $newPitcher->Double_H_League = $Pitchers_League->Double_H_League;
          $newPitcher->Double_H_League_VS_L = $Pitchers_League->Double_H_League_VS_L;
          $newPitcher->Double_H_League_VS_R = $Pitchers_League->Double_H_League_VS_R;

          $newPitcher->Double_H_League_STD = $Pitchers_League->Double_H_League_STD;
          $newPitcher->Double_H_League_VS_L_STD = $Pitchers_League->Double_H_League_VS_L_STD;
          $newPitcher->Double_H_League_VS_R_STD = $Pitchers_League->Double_H_League_VS_R_STD;

          $newPitcher->Triple_H_League = $Pitchers_League->Triple_H_League;
          $newPitcher->Triple_H_League_VS_L = $Pitchers_League->Triple_H_League_VS_L;
          $newPitcher->Triple_H_League_VS_R = $Pitchers_League->Triple_H_League_VS_R;

          $newPitcher->Triple_H_League_STD = $Pitchers_League->Triple_H_League_STD;
          $newPitcher->Triple_H_League_VS_L_STD = $Pitchers_League->Triple_H_League_VS_L_STD;
          $newPitcher->Triple_H_League_VS_R_STD = $Pitchers_League->Triple_H_League_VS_R_STD;

          $newPitcher->HR_H_League = $Pitchers_League->HR_H_League;
          $newPitcher->HR_H_League_VS_L = $Pitchers_League->HR_H_League_VS_L;
          $newPitcher->HR_H_League_VS_R = $Pitchers_League->HR_H_League_VS_R;

          $newPitcher->HR_H_League_STD = $Pitchers_League->HR_H_League_STD;
          $newPitcher->HR_H_League_VS_L_STD = $Pitchers_League->HR_H_League_VS_L_STD;
          $newPitcher->HR_H_League_VS_R_STD = $Pitchers_League->HR_H_League_VS_R_STD;

          $newPitcher->SB_PA_League = $Pitchers_League->SB_PA_League;
          $newPitcher->SB_PA_League_VS_L = $Pitchers_League->SB_PA_League_VS_L;
          $newPitcher->SB_PA_League_VS_R = $Pitchers_League->SB_PA_League_VS_R;

          $newPitcher->SB_PA_League_STD = $Pitchers_League->SB_PA_League_STD;
          $newPitcher->SB_PA_League_VS_L_STD = $Pitchers_League->SB_PA_League_VS_L_STD;
          $newPitcher->SB_PA_League_VS_R_STD = $Pitchers_League->SB_PA_League_VS_R_STD;

          $newPitcher->SO_PA_League = $Pitchers_League->SO_PA_League;
          $newPitcher->SO_PA_League_VS_L = $Pitchers_League->SO_PA_League_VS_L;
          $newPitcher->SO_PA_League_VS_R = $Pitchers_League->SO_PA_League_VS_R;

          $newPitcher->SO_PA_League_STD = $Pitchers_League->SO_PA_League_STD;
          $newPitcher->SO_PA_League_VS_L_STD = $Pitchers_League->SO_PA_League_VS_L_STD;
          $newPitcher->SO_PA_League_VS_R_STD = $Pitchers_League->SO_PA_League_VS_R_STD;

          $newPitcher->HBP_PA_League = $Pitchers_League->HBP_PA_League;
          $newPitcher->HBP_PA_League_VS_L = $Pitchers_League->HBP_PA_League_VS_L;
          $newPitcher->HBP_PA_League_VS_R = $Pitchers_League->HBP_PA_League_VS_R;

          $newPitcher->HBP_PA_League_STD = $Pitchers_League->HBP_PA_League_STD;
          $newPitcher->HBP_PA_League_VS_L_STD = $Pitchers_League->HBP_PA_League_VS_L_STD;
          $newPitcher->HBP_PA_League_VS_R_STD = $Pitchers_League->HBP_PA_League_VS_R_STD;

          $newPitcher->BB_PA_League = $Pitchers_League->BB_PA_League;
          $newPitcher->BB_PA_League_VS_L = $Pitchers_League->BB_PA_League_VS_L;
          $newPitcher->BB_PA_League_VS_R = $Pitchers_League->BB_PA_League_VS_R;

          $newPitcher->BB_PA_League_STD = $Pitchers_League->BB_PA_League_STD;
          $newPitcher->BB_PA_League_VS_L_STD = $Pitchers_League->BB_PA_League_VS_L_STD;
          $newPitcher->BB_PA_League_VS_R_STD = $Pitchers_League->BB_PA_League_VS_R_STD;

          $newPitcher->Pitches_PA_League = $Pitchers_League->Pitches_PA_League;
          $newPitcher->Pitches_PA_League_STD = $Pitchers_League->Pitches_PA_League_STD;

          $newPitcher->Total_PA_League = $Pitchers_League->Total_PA_League;
          $newPitcher->Total_H_League = $Pitchers_League->Total_H_League;

          foreach($Team_Bullpen_Data_VS_L as &$Team_BullPen_VS_L) {
            if($Team_BullPen_VS_L->Team_ID == $newPitcher->Team_ID) {
              $newPitcher->H_PA_VS_L_Bullpen = $Team_BullPen_VS_L->H_PA;
              $newPitcher->Single_H_VS_L_Bullpen = $Team_BullPen_VS_L->Single_H;
              $newPitcher->Double_H_VS_L_Bullpen = $Team_BullPen_VS_L->Double_H;
              $newPitcher->Triple_H_VS_L_Bullpen = $Team_BullPen_VS_L->Triple_H;
              $newPitcher->HR_H_VS_L_Bullpen = $Team_BullPen_VS_L->HR_H;
              $newPitcher->SO_PA_VS_L_Bullpen = $Team_BullPen_VS_L->SO_PA;
              $newPitcher->HBP_PA_VS_L_Bullpen = $Team_BullPen_VS_L->HBP_PA;
              $newPitcher->BB_PA_VS_L_Bullpen = $Team_BullPen_VS_L->BB_PA;
            }
          }
          foreach($Team_Bullpen_Data_VS_R as &$Team_BullPen_VS_R) {
            if($Team_BullPen_VS_R->Team_ID == $newPitcher->Team_ID) {
              $newPitcher->H_PA_VS_R_Bullpen = $Team_BullPen_VS_R->H_PA;
              $newPitcher->Single_H_VS_R_Bullpen = $Team_BullPen_VS_R->Single_H;
              $newPitcher->Double_H_VS_R_Bullpen = $Team_BullPen_VS_R->Double_H;
              $newPitcher->Triple_H_VS_R_Bullpen = $Team_BullPen_VS_R->Triple_H;
              $newPitcher->HR_H_VS_R_Bullpen = $Team_BullPen_VS_R->HR_H;
              $newPitcher->SO_PA_VS_R_Bullpen = $Team_BullPen_VS_R->SO_PA;
              $newPitcher->HBP_PA_VS_R_Bullpen = $Team_BullPen_VS_R->HBP_PA;
              $newPitcher->BB_PA_VS_R_Bullpen = $Team_BullPen_VS_R->BB_PA;
            }
          }

          $Stadium_Data = DB::connection('mysql_MLB')->select(
            "SELECT
              l.Left_HR,
              l.Left_Triple,
              l.Left_Double,
              l.Left_Single,
              l.Left_AVG,
              l.Right_HR,
              l.Right_Triple,
              l.Right_Double,
              l.Right_Single,
              l.Right_AVG
            FROM park_sw_data AS l
            WHERE l.Team_ID = $newPitcher->Stadium_ID "
            );

            $newPitcher->Stadium_Left_HR = $Stadium_Data[0]->Left_HR;
            $newPitcher->Stadium_Left_Triple = $Stadium_Data[0]->Left_Triple;
            $newPitcher->Stadium_Left_Double = $Stadium_Data[0]->Left_Double;
            $newPitcher->Stadium_Left_Single = $Stadium_Data[0]->Left_Single;
            $newPitcher->Stadium_Left_AVG = $Stadium_Data[0]->Left_AVG;
            $newPitcher->Stadium_Right_HR = $Stadium_Data[0]->Right_HR;
            $newPitcher->Stadium_Right_Triple = $Stadium_Data[0]->Right_Triple;
            $newPitcher->Stadium_Right_Double = $Stadium_Data[0]->Right_Double;
            $newPitcher->Stadium_Right_Single = $Stadium_Data[0]->Right_Single;
            $newPitcher->Stadium_Right_AVG = $Stadium_Data[0]->Right_AVG;

          array_push($Final_Pitchers, $newPitcher);


        }

        $All_Players = array_merge($Final_Hitters, $Final_Pitchers);

        Cache::put('All_Players_'.$Date, $All_Players, Carbon::now()->addMinutes(10));

        return json_encode($All_Players);
      }
    }

    public function loadFanDuelPlayers(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'csvFile' => 'required|file|mimes:csv,txt'
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
              $player->playerID = $data[0];
              $player->_Position = $data[1];
              $player->_Name = $data[2] . " " . $data[4];
              $player->_FPPG = $data[5];
              $player->_ActualFantasyPoints = -1;
              $player->_GamesPlayed = $data[6];
              $player->_Salary = $data[7];
              $player->_Game = $data[8];
              $player->_Team = $data[9];
              $player->_Opponent = $data[10];
              if (strlen($data[11]) > 0) {
                $player->_playerInjured = $data[11];
              } else {
                $player->_playerInjured = '';
              }

              $player->_playerInjuryDetails = $data[12];
              $player->_ProbablePitcher = $data[13];
              $player->_BattingOrder = $data[14];
              $player->_TimesInValidDrafts = 0;
              $player->_TimesInDrafts = 0;
              $player->_PercentInDrafts = -1;
              $player->_Rank = -1;

              if($player->playerID != null) {
                $players[] = $player;
              }
            } else {
              $firstLine = false;
              fgetcsv($fileRead);
            }
          }
          fclose($fileRead);
        } catch(\Exception $e) {
          $errorMessage = array('error' => 'Incorrect file structure.');
          return Response::json($errorMessage, 500);
        }
        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'MLB', 'action' => 'playerLoad', 'actionDetails' =>  'FanDuel', 'actionDetailsLarge' => json_encode($players)]
        );
        return Response::json($players, 200);
    }
    public function loadDraftKingsPlayers(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'csvFile' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('csvFile');

        $lineCount = 0;
        $players = [];
        try {
          $fileRead = fopen($file,"r");
          while(!feof($fileRead))
          {
            if($lineCount > 7) {
              $data = fgetcsv($fileRead);
              if(count($data) > 1) {
                $player = new stdClass();
                $player->playerID = $data[14];
                $player->_Position = $data[11];

                $playerName = $data[13];

                $playerNames = explode(" ", $playerName);
                $player->_Name = trim($playerNames[0]) . " " . trim($playerNames[1]);

                $player->_FPPG = -1;
                $player->_ActualFantasyPoints = -1;
                $player->_GamesPlayed = -1;
                $player->_Salary = $data[15];

                $gameData = explode(" ", $data[16]);
                $player->_Game = trim($gameData[0]);

                $player->_Team = $data[17];

                $playerOpp = explode("@", $gameData[0]);
                if(trim($playerOpp[0]) == $player->_Team) {
                  $player->_Opponent = $playerOpp[1];
                } else {
                  $player->_Opponent = $playerOpp[0];
                }

                $player->_playerInjured = '';
                $player->_playerInjuryDetails = '';
                $player->_TimesInValidDrafts = 0;
                $player->_TimesInDrafts = 0;
                $player->_PercentInDrafts = -1;
                $player->_Rank = -1;
                if($player->playerID != null) {
                  $players[] = $player;
                }
              }
            } else {
              fgetcsv($fileRead);
            }
            $lineCount++;
          }
          fclose($fileRead);
        } catch(\Exception $e) {
          $errorMessage = array('error' => 'Incorrect file structure.');
          return Response::json($errorMessage, 500);
        }
        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'MLB', 'action' => 'playerLoad', 'actionDetails' => 'DraftKings', 'actionDetailsLarge' => json_encode($players)]
        );
        return Response::json($players, 200);
    }
    public function loadDraftKingsFPPG(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'csvFile' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('csvFile');
        $lineCount = 0;
        $players = [];
      //  try {
          $fileRead = fopen($file,"r");
          while(!feof($fileRead))
          {
            if($lineCount > 0) {
              $data = fgetcsv($fileRead);
              if(count($data) > 1) {
                $player = new stdClass();
                $player->_Position = $data[0];

                $playerName = $data[1];

                $playerNames = explode(" ", $playerName);
                $player->_Name = trim($playerNames[0]) . " " . trim($playerNames[1]);

                $player->_FPPG = $data[4];
                $player->_ActualFantasyPoints = -1;
                $player->_GamesPlayed = -1;
                $player->_Salary = $data[2];

                $gameData = explode(" ", $data[3]);
                $player->_Game = trim($gameData[0]);

                $player->_Team = $data[5];

                $playerOpp = explode("@", $gameData[0]);
                if(trim($playerOpp[0]) == $player->_Team) {
                  $player->_Opponent = $playerOpp[1];
                } else {
                  $player->_Opponent = $playerOpp[0];
                }
                $players[] = $player;
              }
            } else {
              fgetcsv($fileRead);
            }
            $lineCount++;
          }
          fclose($fileRead);
        // } catch(\Exception $e) {
        //   $errorMessage = array('error' => 'Incorrect file structure.');
        //   return Response::json($errorMessage, 500);
        // }
        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'MLB', 'action' => 'playerFPPGLoad', 'actionDetails' => 'DraftKings', 'actionDetailsLarge' => json_encode($players)]
        );
        return Response::json($players, 200);
    }
    public function loadHistory(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
            'endIndex' => 'required|integer'
        ]);

        $savedJSON = DB::table('UserSaveData')->select('created_at', 'id', 'title', 'site')->where([['userID', '=', Auth::user()->id],['sport' ,'=', 'MLB']])->whereNull('deleted_at')->orderBy('created_at', 'desc')->skip($request->input('endIndex'))->take(10)->get();
        return Response::json($savedJSON, 200);
    }
    public function downloadDrafts(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'downloadDrafts' => 'required|integer'
        ]);

        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'MLB', 'action' => 'downloadDrafts', 'actionDetails' => $request->input('downloadDrafts')]
        );
    }
    public function buildDraft(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
          'builtDrafts' => 'required|integer'
        ]);

        DB::table('UserActions')->insert(
            ['userID' => Auth::user()->id, 'sport' => 'MLB', 'action' => 'build', 'actionDetails' =>  $request->input('builtDrafts')]
        );
    }

    public function create(Request $request)
    {
        if($request->input() != NULL) {

          $this->validate($request, [
              'postObject' => 'required|json',
              'title' => 'required|string|max:255',
              'site' => 'required|string|max:45|in:FanDuel,DraftKings'
          ]);
          $postObject = $request->input('postObject');
          $title = $request->input('title');
          $site = $request->input('site');

          $id = DB::table('UserSaveData')->insertGetId(
              ['userID' => Auth::user()->id, 'userSaveJSON' => $postObject, 'title' => $title, 'sport' => 'MLB', 'site' => $site]
          );
          $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=', $id],['sport' ,'=', 'MLB']])->whereNull('deleted_at')->first();
          return Response::json($savedJSON, 200);
        }
    }
    public function read(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
            'id' => 'required|integer'
        ]);
        $idToLoad = $request->input('id');
        $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=', $request->input('id')],['sport' ,'=', 'MLB']])->whereNull('deleted_at')->first();
        return response()->json($savedJSON);
    }

    public function update(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
            'id' => 'required|integer',
            'title' => 'required|string|max:255',
            'postObject' => 'json',
        ]);

        $currentTime = Carbon::now();

        DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'MLB'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
        DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'MLB'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['userSaveJSON' => $request->input('postObject') ]);
        $savedJSON = DB::table('UserSaveData')->select('userSaveJSON', 'title', 'id', 'site')->where([['userID', '=', Auth::user()->id],['id', '=',  $request->input('id')],['sport' ,'=', 'MLB']])->whereNull('deleted_at')->first();
        return Response::json($savedJSON, 200);
    }
    public function updateTitle(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
            'id' => 'required|integer',
            'title' => 'required|string|max:255'
        ]);

        $currentTime = Carbon::now();

        $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'MLB'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['title' => $request->input('title')]);
        return Response::json($savedJSON, 200);
    }
    public function delete(Request $request)
    {
        $userID = Auth::user()->id;

        $this->validate($request, [
            'id' => 'required|integer'
        ]);

        $currentTime = Carbon::now();

        $savedJSON = DB::table('UserSaveData')->where([ ['userID', '=', Auth::user()->id], ['sport' ,'=', 'MLB'], ['id', '=', $request->input('id')] ])->whereNull('deleted_at')->update(['deleted_at' => $currentTime->toDateTimeString()]);
        return Response::json($savedJSON, 200);
    }

    //#################################################################
    //MLB DK
    public function MLBDK()
    {
        return view('MLBDK');
    }

}
