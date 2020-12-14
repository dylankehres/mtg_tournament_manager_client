import React from "react";
import { Table } from "react-bootstrap";
import { Player } from "../../dtos/player";
import { Tournament } from "../../dtos/tournament";

export interface PlayerInfoProps {
  player: Player;
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
    </React.Fragment>
  );
};

export default PlayerInfo;
