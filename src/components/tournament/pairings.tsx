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
        <h3>{"Round " + props.pairings[0].getMatch().getRoundNum()}</h3>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Table #</th>
              <th>Player Name</th>
              <th>Player Name</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            {props.pairings.map((matchData) => (
              <tr key={matchData.getMatch().getID()}>
                <td>{matchData.getMatch().getTableNum()}</td>
                <td>
                  {matchData.getPlayer1().getName() +
                    " (" +
                    matchData.getPlayer1().getPoints() +
                    " pts)"}
                </td>
                <td>
                  {matchData.getPlayer2().getName() +
                    " (" +
                    matchData.getPlayer2().getPoints() +
                    " pts)"}
                </td>
                <td>
                  {matchData.getMatch().getPlayer1Wins() +
                    "-" +
                    matchData.getMatch().getPlayer2Wins() +
                    (matchData.getMatch().getDraws() > 0
                      ? "-" + matchData.getMatch().getDraws()
                      : "")}
                </td>
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
