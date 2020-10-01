import React from "react";
import { Table } from "react-bootstrap";
import { MatchData } from "../dtos/matchData";

type PairingsProps = {
  pairings: MatchData[];
  onGetPairings: Function;
};

const Pairings = (props: PairingsProps) => {
  if (props.pairings.length > 0) {
    return (
      <div className="m-2" style={{ width: "450px" }}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Table #</th>
              <th>Player Name</th>
              <th>Player Name</th>
            </tr>
          </thead>
          <tbody>
            {props.pairings.map((matchData, index) => (
              <tr key={matchData.getMatch().getID()}>
                <td>{index + 1}</td>
                <td>{matchData.getPlayer1().getName()}</td>
                <td>{matchData.getPlayer2().getName()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  } else {
    return (
      <div className="m-2" style={{ width: "300px" }}>
        <div className="m-2">
          <h4>Waiting for pairings to post</h4>
        </div>
      </div>
    );
  }
};

export default Pairings;
