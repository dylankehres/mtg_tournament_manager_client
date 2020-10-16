import React from "react";
import { Player } from "../../dtos/player";
import { MatchData } from "../../dtos/matchData";

type PlayerMatchProps = {
  currPlayer: Player;
  matchData: MatchData;
  serverAddress: string;
};

const playerMatch = (props: PlayerMatchProps) => {
  let oppName =
    props.matchData.getPlayer1().getID() === props.currPlayer.getID()
      ? props.matchData.getPlayer2().getName()
      : props.matchData.getPlayer1().getName();

  return (
    <div className="m-2">
      <h4>{"Opponent: " + oppName}</h4>
      <h4>{"Table #" + props.matchData.getMatch().getTableNum()}</h4>
    </div>
  );
};

export default playerMatch;
