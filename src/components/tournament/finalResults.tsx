import * as React from 'react';
import { Table } from "react-bootstrap";
import { Tournament } from '../dtos/tournament';
import { Player } from '../dtos/player';

export interface FinalResultsProps {
    tournament: Tournament;
    playerList: Player[];
}
 
const FinalResults: React.SFC<FinalResultsProps> = (props: FinalResultsProps) => {
    return ( 
    <div className="m-2" style={{ width: "300px" }}>
    <h3>{props.tournament.getName()}</h3>
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
              {player.getName() + " (" + player.getPoints() + " pts)"}
            </td>
            <td>{player.getDeckName()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div> 
  );
}
 
export default FinalResults;