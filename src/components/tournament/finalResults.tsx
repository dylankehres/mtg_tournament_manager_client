import * as React from "react";
import { Table } from "react-bootstrap";
import { Tournament } from "../dtos/tournament";
import { Player } from "../dtos/player";
import { PlayerInfoModal } from "./player/playerInfo";

export interface FinalResultsProps {
  tournament: Tournament;
  playerList: Player[];
  serverAddress: string;
}

const FinalResults: React.SFC<FinalResultsProps> = (
  props: FinalResultsProps
) => {
  return (
    <div className="m-2" style={{ width: "300px" }}>
      <h4>Final Results</h4>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Player Name</th>
            <th>Deck Name</th>
          </tr>
        </thead>
        <tbody>
          {props.playerList.map((player: Player, index) => (
            <tr key={player.getID()}>
              <td>{index + 1}</td>
              <td>
                <PlayerInfoModal
                  player={player}
                  serverAddress={props.serverAddress}
                  key={`playerInfoModal_${player.getID()}`}
                />
              </td>
              <td>{player.getDeckName()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FinalResults;
