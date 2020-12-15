import React from "react";
import { Tournament } from "../dtos/tournament";

export interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentInfo: React.FunctionComponent<TournamentInfoProps> = (
  props
) => {
  return (
    <React.Fragment>
      <span>{props.tournament.getName()}</span>
      <span>Code: {props.tournament.getRoomCode()}</span>
      <span>Format: {props.tournament.getFormat()}</span>
      <span>Current Round: {props.tournament.getCurrRound}</span>
    </React.Fragment>
  );
};

export default TournamentInfo;
