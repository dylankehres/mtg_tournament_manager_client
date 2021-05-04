import React from "react";
import { Player } from "../../dtos/player";
import { Tournament } from "../../dtos/tournament";
import { MatchData } from "../../dtos/matchData";
import { Match } from "../../dtos/match";
import "../styles/player.css";

export interface PlayerInfoProps {
  player: Player;
  matches: MatchData[];
  tournament: Tournament;
}

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = (props) => {
  return (
    <React.Fragment>
      <span>
        {props.player.getName()} ({props.player.getPoints()} points)
      </span>
      <span>Tournament: {props.tournament.getName()}</span>
      <span>Format: {props.tournament.getFormat()}</span>
      <span>Deck: {props.player.getDeckName()}</span>
      <span>Opponents:</span>
      {
        props.matches.map((matchData: MatchData) => {
          <div>
            <span>{matchData.getOpponentByPlayerID(props.player.getID())}</span>
            <span>{matchData.getMatch().}</span>
          </div>
        })
      }
    </React.Fragment>
  );
};

export interface PlayerInfoProps {
  playerID: string;
  match: Match;
}

const MatchRecord: React.FunctionComponent<PlayerInfoProps> = (props) => {
  let wins: number = 0; 
  let losses: number = 0;
  let draws: number = props.match.getDraws();

  if(props.match.getPlayer1ID() === props.playerID) {
    wins = props.match.getPlayer1Wins();
    losses = props.match.getPlayer2Wins();
  } else if(props.match.getPlayer2ID() === props.playerID) {
    wins = props.match.getPlayer2Wins();
    losses = props.match.getPlayer1Wins();
  }

  let resultText: String = "";
  if(draws >= wins) {
    resultText = "Draw";
  }
  else if(wins > losses) {
    resultText = "Won";
  } else {
    resultText = "Lost";
  }

  if(draws > 0) {
    return (
      <span>
        {resultText} {wins}-{losses}-{draws}
      </span>
      )
  }

  return (
    <span>
      {resultText} {wins}-{losses}
    </span>
    );
  };

export default PlayerInfo;
