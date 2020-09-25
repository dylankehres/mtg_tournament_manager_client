import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import Pairings from "../pairings";
import PlayerList from "../playerList";
import PlayerMatch from "./playerMatch";
import { Player } from "../../dtos/player";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";

type PlayerWaitingProps = {
  serverAddress: string;
  match: {
    params: {
      playerID: string;
    };
  };
};

type PlayerWaitingState = {
  pairings: MatchData[];
  matchData: MatchData;
  currPlayer: Player;
  player1: Player;
  player2: Player;
};

class PlayerWaiting extends Component<PlayerWaitingProps, PlayerWaitingState> {
  state = {
    pairings: [],
    matchData: new MatchData(),
    currPlayer: new Player(),
    player1: new Player(),
    player2: new Player(),
  };

  handleLeaveTmt() {
    fetch(`${this.props.serverAddress}/join`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: this.props.match.params.playerID,
    })
      .then((res) => res.json())
      .then(() => {})
      .catch((err) => console.log("Fetch Error in handleLeaveTmt", err));
  }

  getPlayerData() {
    console.log("Get player data");
    return fetch(
      `${this.props.serverAddress}/join/${this.props.match.params.playerID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      return res.json();
    });
  }

  getPairings() {
    this.getPlayerData().then((currPlayer: Player) => {
      if (currPlayer.roomCode === "") {
        alert("Something went wrong. Please try that again.");
      } else {
        this.setState({ currPlayer });
        fetch(
          `${this.props.serverAddress}/pairings/${this.state.currPlayer.roomCode}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((matchDataInitArr: MatchDataIntf[]) => {
            const pairings: MatchData[] = [];
            matchDataInitArr.forEach((matchDataInit) =>
              pairings.push(new MatchData(matchDataInit))
            );
            this.setState({ pairings });
          })
          .catch((err) =>
            console.log("Fetch Error in getPairings for playerWaiting.jsx", err)
          );
      }
    });
  }

  getPlayerMatch() {
    fetch(
      `${this.props.serverAddress}/match/${this.props.match.params.playerID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((matchDataInit: MatchDataIntf) => {
        this.setState({ matchData: new MatchData(matchDataInit) });
        console.log("matchData: ", this.state.matchData);
      })
      .catch((err) => console.log("Fetch Error in getPlayerMatch", err));
  }

  readyUp() {
    fetch(
      `${this.props.serverAddress}/match/ready/${this.state.currPlayer.id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then(() => {})
      .catch((err) =>
        console.log("Fetch Error in readyUp for playerWaiting.jsx", err)
      );
  }

  componentDidMount() {
    this.getPairings();
    this.getPlayerMatch();
  }

  render() {
    if (this.state.pairings.length > 0) {
      return (
        <React.Fragment>
          <PlayerMatch
            currPlayer={this.state.currPlayer}
            matchData={this.state.matchData}
            player1={this.state.player1}
            player2={this.state.player2}
            serverAddress={this.props.serverAddress}
          />
          <Pairings
            pairings={this.state.pairings}
            onGetPairings={this.getPairings}
          />
          <Button
            className="btn btn-success m-2"
            href={`/round/${this.state.currPlayer.id}`}
            onClick={() => this.readyUp()}
          >
            Ready
          </Button>
        </React.Fragment>
      );
    } else if (this.state.currPlayer.roomCode !== "") {
      console.log("Room code: ", this.state.currPlayer.roomCode);
      return (
        <div className="m-2">
          <PlayerList
            serverAddress={this.props.serverAddress}
            roomCode={this.state.currPlayer.roomCode}
          />
          <Form>
            <Button
              className="btn btn-danger m-2"
              href="/join"
              onClick={() => this.handleLeaveTmt()}
            >
              Leave Tournament
            </Button>
          </Form>
        </div>
      );
    } else {
      return <h2>Loading...</h2>;
    }
  }
}

export default PlayerWaiting;
