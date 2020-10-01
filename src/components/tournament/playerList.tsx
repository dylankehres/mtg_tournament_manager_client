import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Player, PlayerIntf } from "../dtos/player";

type PlayerListProps = {
  serverAddress: string;
  roomCode: string;
};

type PlayerListState = {
  playerList: Player[];
};

class PlayerList extends Component<PlayerListProps, PlayerListState> {
  state = {
    playerList: [],
  };

  componentDidMount() {
    this.getPlayerList();
  }

  getPlayerList() {
    fetch(`${this.props.serverAddress}/playerList/${this.props.roomCode}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((initPlayerfList: PlayerIntf[]) => {
        if (initPlayerfList.length > 0) {
          const playerList: Player[] = [];
          initPlayerfList.forEach((initPlayer) =>
            playerList.push(new Player(initPlayer))
          );
          this.setState({ playerList });
        }
      });
  }

  render() {
    if (this.state.playerList.length > 0) {
      return (
        <div className="m-2" style={{ width: "300px" }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Player Name</th>
                <th>Deck Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.playerList.map((player: Player, index) => (
                <tr key={player.getID()}>
                  <td>{index + 1}</td>
                  <td>{player.getName()}</td>
                  <td>{player.getDeckName()}</td>
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
            <h4>This event is empty</h4>
          </div>
        </div>
      );
    }
  }
}

export default PlayerList;
