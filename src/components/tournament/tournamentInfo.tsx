import { Player, PlayerIntf } from "components/dtos/player";
import React, { useState, useEffect } from "react";
import { Tournament } from "../dtos/tournament";
import PlayerList from "./playerList";
import "../styles/tournament.css";

export interface TournamentInfoProps {
  serverAddress: string;
  tournament: Tournament;
}

const TournamentInfo: React.FunctionComponent<TournamentInfoProps> = (
  props
) => {
  const [playerList, setPlayerList]: [Array<Player>, Function] = useState(
    new Array<Player>()
  );

  const getPlayerList = (): void => {
    fetch(
      `${props.serverAddress}/playerList/${props.tournament.getRoomCode()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((playerListInit: PlayerIntf[]) => {
        const playerList = new Array<Player>();
        for (let playerInit of playerListInit) {
          playerList.push(new Player(playerInit));
          setPlayerList(playerList);
        }
      });
  };

  useEffect(() => {
    getPlayerList();
  });

  return (
    <div className="m-2 tournamentInfo">
      <div>
        <h3>{props.tournament.getName()}</h3>
      </div>
      <div>
        <span>Code: {props.tournament.getRoomCode()}</span>
      </div>
      <div>
        <span>Format: {props.tournament.getFormat()}</span>
      </div>
      <div>
        <span>Current Round: {props.tournament.getCurrRound()}</span>
      </div>
      <div>
        Players:
        <PlayerList
          serverAddress={props.serverAddress}
          playerList={playerList}
        />
      </div>
    </div>
  );
};

export default TournamentInfo;
