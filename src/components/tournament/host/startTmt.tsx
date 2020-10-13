import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import PlayerList from "../playerList";
import Pairings from "../pairings";
import FinalResults from "../finalResults";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Tournament, TournamentIntf, TournamentStatus } from "../../dtos/tournament";
import { MatchStatus } from "components/dtos/match";
import { Player, PlayerIntf } from "../../dtos/player";

type StartTmtProps = {
  serverAddress: string;
  match: {
    params: {
      tmtID: string;
    };
  };
};

type StartTmtState = {
  tournament: Tournament;
  pairings: MatchData[];
  playerList: Player[]
};

class StartTmt extends Component<StartTmtProps, StartTmtState> {
  state = {
    tournament: new Tournament(),
    pairings: new Array<MatchData>(),
    playerList: new Array<Player>()
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
          this.setState({ tournament });
          this.getPlayerList();

          fetch(`${this.props.serverAddress}/pairings/${this.state.tournament.getRoomCode()}`, {
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

  getPlayerList(): void {
    const playerList: Player[] = [];

    fetch(`${this.props.serverAddress}/playerList/${this.state.tournament.getRoomCode()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((initPlayerfList: PlayerIntf[]) => {
        if (initPlayerfList.length > 0) {  
          initPlayerfList.forEach((initPlayer) =>
            playerList.push(new Player(initPlayer))
          );
          console.log("player list", playerList);
          this.setState({ playerList });
        }
      });
  }

  roundInProgress(): boolean {
    for (let matchData of this.state.pairings) {
      if (
        matchData.getMatch().getMatchStatus() !==
        MatchStatus.Complete
      ) {
        return true;
      }
    }

    return false;
  }

  componentDidMount() {
    this.getPairings();
  }

  render() {
    if (this.state.tournament.getRoomCode() === "") {
      return <h2>Loading...</h2>;
    } else if(this.state.tournament.getTournamentStatus() === TournamentStatus.Complete) {
      return <FinalResults tournament={this.state.tournament} playerList={this.state.playerList}/>;
    } else if (this.state.pairings.length > 0) {
      return (
        <div className="m-2">
          <Pairings
            pairings={this.state.pairings}
            onGetPairings={this.getPairings}
            key={"pairings_" + this.state.tournament.getRoomCode()}
          />
          <Form>
            <Button
              className="btn btn-primary m-2"
              disabled={this.roundInProgress()}
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
            roomCode={this.state.tournament.getRoomCode()}
            key={"playerList_" + this.state.tournament.getRoomCode()}
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
