import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import PlayerList from "../playerList";
import Pairings from "../pairings";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Tournament, TournamentIntf } from "../../dtos/tournament";

type StartTmtProps = {
  serverAddress: string;
  match: {
    params: {
      tmtID: string;
    };
  };
};

type StartTmtState = {
  roomCode: string;
  pairings: MatchData[];
};

class StartTmt extends Component<StartTmtProps, StartTmtState> {
  state = {
    roomCode: "",
    pairings: new Array<MatchData>(),
  };

  handleCancelTmt() {
    fetch(`${this.props.serverAddress}/host`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: this.props.match.params.tmtID,
    })
      .then((res) => res.json())
      .then(() => {})
      .catch((err) => console.log("Fetch Error in handleCancelTmt", err));
  }

  generatePairings() {
    fetch(
      `${this.props.serverAddress}/host/pairings/${this.props.match.params.tmtID}`,
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
      .catch((err) => console.log("Fetch Error in generatePairings", err));
  }

  getPairings() {
    this.getTournamentData()
      .then((initTournament: TournamentIntf) => {
        const tournament: Tournament = new Tournament(initTournament);

        if (tournament.getRoomCode() === "") {
          alert("Something went wrong. Please try that again.");
        } else {
          this.setState({ roomCode: tournament.getRoomCode() });
          fetch(`${this.props.serverAddress}/pairings/${this.state.roomCode}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((matchDataInitArr: MatchDataIntf[]) => {
              const pairings: MatchData[] = [];
              matchDataInitArr.forEach((matchDataInit) =>
                pairings.push(new MatchData(matchDataInit))
              );
              this.setState({ pairings });
            })
            .catch((err) =>
              console.log("Fetch Error in getPairings for startTmt.jsx", err)
            );
        }
      })
      .catch((err) => console.log("Fetch Error in getTournamentData", err));
  }

  getTournamentData() {
    return fetch(
      `${this.props.serverAddress}/host/${this.props.match.params.tmtID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  canStartRound(): boolean {
    for (let matchData of this.state.pairings) {
      if (matchData.getMatch().getActive()) {
        return false;
      }
    }

    return true;
  }

  componentDidMount() {
    this.getPairings();
  }

  render() {
    if (this.state.roomCode === "") {
      return <h2>Loading...</h2>;
    } else if (this.state.pairings.length > 0) {
      return (
        <div className="m-2">
          <Pairings
            pairings={this.state.pairings}
            onGetPairings={this.getPairings}
            key={"pairings_" + this.state.roomCode}
          />
          <Form>
            <Button
              className="btn btn-primary m-2"
              onClick={() => this.generatePairings()}
            >
              Start Next Round
            </Button>
            <Button
              className="btn btn-danger m-2"
              onClick={() => this.handleCancelTmt()}
              href="/host"
            >
              Cancel Tournament
            </Button>
          </Form>
        </div>
      );
    } else {
      return (
        <div className="m-2">
          <PlayerList
            serverAddress={this.props.serverAddress}
            roomCode={this.state.roomCode}
            key={"playerList_" + this.state.roomCode}
          />
          <Form>
            <Button
              className="btn btn-primary m-2"
              onClick={() => this.generatePairings()}
            >
              Start Tournament
            </Button>
            <Button
              className="btn btn-danger m-2"
              onClick={() => this.handleCancelTmt()}
              href="/host"
            >
              Cancel Tournament
            </Button>
          </Form>
        </div>
      );
    }
  }
}

export default StartTmt;
