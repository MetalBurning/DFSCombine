<?php

namespace App\library;

use Exception;

class Player
{
  public $Player_ID;
  public $Hand;
  public $Batting_Order;
  public $Position;
  public $Team_ID;
  public $Opp_ID;
  public $Home;
  public $Vegas;
  public $Stadium_ID;

  public $Name;
  public $Team;
  public $Opp;
  public $Vegas_Runs;

  public $H_PA_VS_L;
  public $Single_H_VS_L;
  public $Double_H_VS_L;
  public $Triple_H_VS_L;
  public $HR_H_VS_L;
  public $SB_PA_VS_L;
  public $SO_PA_VS_L;
  public $SF_PA_VS_L;
  public $HBP_PA_VS_L;
  public $BB_PA_VS_L;
  public $Total_PA_VS_L;
  public $Total_H_VS_L;

  public $H_PA_VS_L_Recent;
  public $Single_H_VS_L_Recent;
  public $Double_H_VS_L_Recent;
  public $Triple_H_VS_L_Recent;
  public $HR_H_VS_L_Recent;
  public $SB_PA_VS_L_Recent;
  public $SO_PA_VS_L_Recent;
  public $SF_PA_VS_L_Recent;
  public $HBP_PA_VS_L_Recent;
  public $BB_PA_VS_L_Recent;
  public $Total_PA_VS_L_Recent;
  public $Total_H_VS_L_Recent;

  public $H_PA_VS_L_Regression;
  public $Single_H_VS_L_Regression;
  public $Double_H_VS_L_Regression;
  public $Triple_H_VS_L_Regression;
  public $HR_H_VS_L_Regression;
  public $SB_PA_VS_L_Regression;
  public $SO_PA_VS_L_Regression;
  public $SF_PA_VS_L_Regression;
  public $HBP_PA_VS_L_Regression;
  public $BB_PA_VS_L_Regression;


  public $H_PA_VS_R;
  public $Single_H_VS_R;
  public $Double_H_VS_R;
  public $Triple_H_VS_R;
  public $HR_H_VS_R;
  public $SB_PA_VS_R;
  public $SO_PA_VS_R;
  public $SF_PA_VS_R;
  public $HBP_PA_VS_R;
  public $BB_PA_VS_R;
  public $Total_PA_VS_R;
  public $Total_H_VS_R;

  public $H_PA_VS_R_Recent;
  public $Single_H_VS_R_Recent;
  public $Double_H_VS_R_Recent;
  public $Triple_H_VS_R_Recent;
  public $HR_H_VS_R_Recent;
  public $SB_PA_VS_R_Recent;
  public $SO_PA_VS_R_Recent;
  public $SF_PA_VS_R_Recent;
  public $HBP_PA_VS_R_Recent;
  public $BB_PA_VS_R_Recent;
  public $Total_PA_VS_R_Recent;
  public $Total_H_VS_R_Recent;

  public $H_PA_VS_R_Regression;
  public $Single_H_VS_R_Regression;
  public $Double_H_VS_R_Regression;
  public $Triple_H_VS_R_Regression;
  public $HR_H_VS_R_Regression;
  public $SB_PA_VS_R_Regression;
  public $SO_PA_VS_R_Regression;
  public $SF_PA_VS_R_Regression;
  public $HBP_PA_VS_R_Regression;
  public $BB_PA_VS_R_Regression;


  public $H_PA;
  public $Single_H;
  public $Double_H;
  public $Triple_H;
  public $HR_H;
  public $SB_PA;
  public $SO_PA;
  public $HBP_PA;
  public $BB_PA;
  public $Total_PA;
  public $Total_H;
  public $Pitches_PA;

  public $H_PA_League;
  public $Single_H_League;
  public $Double_H_League;
  public $Triple_H_League;
  public $HR_H_League;
  public $SB_PA_League;
  public $SO_PA_League;
  public $HBP_PA_League;
  public $BB_PA_League;
  public $Pitches_PA_League;
  public $Total_PA_League;
  public $Total_H_League;

  public $H_PA_League_STD;
  public $Single_H_League_STD;
  public $Double_H_League_STD;
  public $Triple_H_League_STD;
  public $HR_H_League_STD;
  public $SB_PA_League_STD;
  public $SO_PA_League_STD;
  public $HBP_PA_League_STD;
  public $BB_PA_League_STD;
  public $Pitches_PA_League_STD;
  public $Total_PA_League_STD;
  public $Total_H_League_STD;


  public $H_PA_League_VS_L;
  public $Single_H_League_VS_L;
  public $Double_H_League_VS_L;
  public $Triple_H_League_VS_L;
  public $HR_H_League_VS_L;
  public $SB_PA_League_VS_L;
  public $SO_PA_League_VS_L;
  public $HBP_PA_League_VS_L;
  public $BB_PA_League_VS_L;
  public $Pitches_PA_League_VS_L;
  public $Total_PA_League_VS_L;
  public $Total_H_League_VS_L;

  public $H_PA_League_VS_L_STD;
  public $Single_H_League_VS_L_STD;
  public $Double_H_League_VS_L_STD;
  public $Triple_H_League_VS_L_STD;
  public $HR_H_League_VS_L_STD;
  public $SB_PA_League_VS_L_STD;
  public $SO_PA_League_VS_L_STD;
  public $HBP_PA_League_VS_L_STD;
  public $BB_PA_League_VS_L_STD;
  public $Pitches_PA_League_VS_L_STD;
  public $Total_PA_League_VS_L_STD;
  public $Total_H_League_VS_L_STD;

  public $H_PA_League_VS_R;
  public $Single_H_League_VS_R;
  public $Double_H_League_VS_R;
  public $Triple_H_League_VS_R;
  public $HR_H_League_VS_R;
  public $SB_PA_League_VS_R;
  public $SO_PA_League_VS_R;
  public $HBP_PA_League_VS_R;
  public $BB_PA_League_VS_R;
  public $Pitches_PA_League_VS_R;
  public $Total_PA_League_VS_R;
  public $Total_H_League_VS_R;

  public $H_PA_League_VS_R_STD;
  public $Single_H_League_VS_R_STD;
  public $Double_H_League_VS_R_STD;
  public $Triple_H_League_VS_R_STD;
  public $HR_H_League_VS_R_STD;
  public $SB_PA_League_VS_R_STD;
  public $SO_PA_League_VS_R_STD;
  public $HBP_PA_League_VS_R_STD;
  public $BB_PA_League_VS_R_STD;
  public $Pitches_PA_League_VS_R_STD;
  public $Total_PA_League_VS_R_STD;
  public $Total_H_League_VS_R_STD;


  //Pitcher only Stats
  public $IP_TBF_VS_Opp;
  public $IP_TBF;
  public $IP_TBF_VS_Opp_Recent;
  public $IP_TBF_Recent;
  public $IP_TBF_Regression;
  public $IP_TBF_VS_Opp_Regression;
  public $IP_TBF_League_AVG;
  public $IP_TBF_League_STD;

  public $TBF_VS_Opp;
  public $TBF;
  public $TBF_VS_Opp_Recent;
  public $TBF_Recent;
  public $TBF_VS_Opp_Regression;
  public $TBF_Recent_Regression;
  public $TBF_League_AVG;
  public $TBF_League_STD;

  public $Starting_Pitcher;

//bullpen stats
public $H_PA_VS_L_Bullpen;
public $Single_H_VS_L_Bullpen;
public $Double_H_VS_L_Bullpen;
public $Triple_H_VS_L_Bullpen;
public $HR_H_VS_L_Bullpen;
public $SO_PA_VS_L_Bullpen;
public $HBP_PA_VS_L_Bullpen;
public $BB_PA_VS_L_Bullpen;

public $H_PA_VS_R_Bullpen;
public $Single_H_VS_R_Bullpen;
public $Double_H_VS_R_Bullpen;
public $Triple_H_VS_R_Bullpen;
public $HR_H_VS_R_Bullpen;
public $SO_PA_VS_R_Bullpen;
public $HBP_PA_VS_R_Bullpen;
public $BB_PA_VS_R_Bullpen;

public $Stadium_Left_HR;
public $Stadium_Left_Triple;
public $Stadium_Left_Double;
public $Stadium_Left_Single;
public $Stadium_Left_AVG;
public $Stadium_Right_HR;
public $Stadium_Right_Triple;
public $Stadium_Right_Double;
public $Stadium_Right_Single;
public $Stadium_Right_AVG;




}
class Simulation {
  //Simulation Stats
  public $Sim_Single;
  public $Sim_Double;
  public $Sim_Triple;
  public $Sim_HR;
  public $Sim_SB;
  public $Sim_SO;
  public $Sim_HBP;
  public $Sim_BB;
  public $Sim_R;
  public $Sim_RBI;
  public $Sim_PA;

  public $Sim_P_H;
  public $Sim_P_SO;
  public $Sim_P_HBP;
  public $Sim_P_BB;
  public $Sim_P_IP;
  public $Sim_P_CG;
  public $Sim_P_CGSO;
  public $Sim_P_NH;
  public $Sim_P_ER;
  public $Sim_P_QS;
  public $Sim_P_W;
  public $Sim_P_BF;

  public $Sim_FD_Points;
  public $Sim_DK_Points;
  public $Sim_Y_Points;
}
