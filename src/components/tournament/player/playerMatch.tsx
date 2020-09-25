import React from "react";
import { Player } from "../../dtos/player";
import { MatchData } from "../../dtos/matchData";

type PlayerMatchProps = {
  currPlayer: Player;
  player1: Player;
  player2: Player;
  matchData: MatchData;
  serverAddress: string;
};

const playerMatch = (props: PlayerMatchProps) => {
  let oppName =
    props.matchData.getPlayer1().id === props.currPlayer.id
      ? props.matchData.getPlayer2().name
      : props.matchData.getPlayer1().name;

  return (
    <div className="m-2">
      <h4>{"Opponent: " + oppName}</h4>
      <h4>{"Table #" + props.matchData.getMatch().tableNum}</h4>
    </div>
  );
};

export default playerMatch;
