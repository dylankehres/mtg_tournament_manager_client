import React from "react";
import { Tournament } from "../dtos/tournament";

interface TournamentLabelProps {
  tournament: Tournament;
  serverAddress: string;
}

const TournamentLabel: React.FunctionComponent<TournamentLabelProps> = (
  props
) => {
  return (
    <div>
      <h3 className="tournamentHeader">{props.tournament.getName()}</h3>
    </div>
  );
};

export default TournamentLabel;
