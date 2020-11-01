import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import PlayerList from "../playerList";
import Pairings from "../pairings";
import FinalResults from "../finalResults";
import { MatchData } from "../../dtos/matchData";
import { Tournament, TournamentStatus } from "../../dtos/tournament";
import { MatchStatus } from "components/dtos/match";
import { Player } from "../../dtos/player";
import { HostHubDtoIntf } from "components/dtos/hubDtos";

type HostHubProps = {
  serverAddress: string;
  match: {
    params: {
      tmtID: string;
    };
  };
};

type HostHubState = {
  tournament: Tournament;
  pairings: MatchData[];
  playerList: Player[];
};

class HostHub extends Component<HostHubProps, HostHubState> {
  state = {
    tournament: new Tournament(),
    pairings: new Array<MatchData>(),
    playerList: new Array<Player>(),
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
      .then((hostHubInit: HostHubDtoIntf) => {
        this.buildStateFromHostHubDTO(hostHubInit);
      })
      // .then((matchDataInitArr: MatchDataIntf[]) => {
      //   const pairings: MatchData[] = [];
      //   matchDataInitArr.forEach((matchDataInit) =>
      //     pairings.push(new MatchData(matchDataInit))
      //   );
      //   this.setState({ pairings });
      // })
      .catch((err) => console.log("Fetch Error in generatePairings", err));
  }

  // getPairings() {
  //   this.getTournamentData()
  //     .then((initTournament: TournamentIntf) => {
  //       const tournament: Tournament = new Tournament(initTournament);

  //       if (tournament.getRoomCode() === "") {
  //         alert("Something went wrong. Please try that again.");
  //       } else {
  //         this.setState({ tournament });
  //         this.getPlayerList();

  //         fetch(
  //           `${
  //             this.props.serverAddress
  //           }/pairings/${this.state.tournament.getRoomCode()}`,
  //           {
  //             method: "GET",
  //             headers: {
  //               Accept: "application/json",
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         )
  //           .then((res) => res.json())
  //           .then((matchDataInitArr: MatchDataIntf[]) => {
  //             const pairings: MatchData[] = [];
  //             matchDataInitArr.forEach((matchDataInit) =>
  //               pairings.push(new MatchData(matchDataInit))
  //             );
  //             this.setState({ pairings });
  //           })
  //           .catch((err) =>
  //             console.log("Fetch Error in getPairings for startTmt.jsx", err)
  //           );
  //       }
  //     })
  //     .catch((err) => console.log("Fetch Error in getTournamentData", err));
  // }

  // getTournamentData() {
  //   return fetch(
  //     `${this.props.serverAddress}/host/${this.props.match.params.tmtID}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   ).then((res) => res.json());
  // }

  // getPlayerList(): void {
  //   const playerList: Player[] = [];

  //   fetch(
  //     `${
  //       this.props.serverAddress
  //     }/playerList/${this.state.tournament.getRoomCode()}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((initPlayerfList: PlayerIntf[]) => {
  //       if (initPlayerfList.length > 0) {
  //         initPlayerfList.forEach((initPlayer) =>
  //           playerList.push(new Player(initPlayer))
  //         );
  //         console.log("player list", playerList);
  //         this.setState({ playerList });
  //       }
  //     });
  // }

  buildStateFromHostHubDTO(hostHubInit: HostHubDtoIntf): void {
    const playerList = new Array<Player>();
    for (let playerInit of hostHubInit.playerList) {
      playerList.push(new Player(playerInit));
    }

    const pairings = new Array<MatchData>();
    for (let matchInit of hostHubInit.pairings) {
      pairings.push(new MatchData(matchInit));
    }

    this.setState({
      tournament: new Tournament(hostHubInit.tournament),
      playerList,
      pairings,
    });
  }

  getHostHubData(): void {
    fetch(
      `${this.props.serverAddress}/hostHub/${this.props.match.params.tmtID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((hostHubInit: HostHubDtoIntf) => {
        this.buildStateFromHostHubDTO(hostHubInit);
      });
  }

  roundInProgress(): boolean {
    for (let matchData of this.state.pairings) {
      if (matchData.getMatch().getMatchStatus() !== MatchStatus.Complete) {
        return true;
      }
    }

    return false;
  }

  componentDidMount() {
    // this.getPairings();
    this.getHostHubData();
  }

  render() {
    if (this.state.tournament.getRoomCode() === "") {
      return <h2>Loading...</h2>;
    } else if (
      this.state.tournament.getTournamentStatus() === TournamentStatus.Complete
    ) {
      return (
        <React.Fragment>
          <FinalResults
            tournament={this.state.tournament}
            playerList={this.state.playerList}
          />
          <Button
            className="btn btn-danger m-2"
            onClick={() => this.handleCancelTmt()}
            href="/host"
          >
            End Tournament
          </Button>
        </React.Fragment>
      );
    } else if (
      this.state.tournament.getTournamentStatus() ===
      TournamentStatus.InProgress
    ) {
      return (
        <div className="m-2">
          <Pairings
            pairings={this.state.pairings}
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
            playerList={this.state.playerList}
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

export default HostHub;
