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
import "../../styles/player.css";
import LoadingDiv from "components/loadingDiv";

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
  loading: boolean;
};

class HostHub extends Component<HostHubProps, HostHubState> {
  state = {
    tournament: new Tournament(),
    pairings: new Array<MatchData>(),
    playerList: new Array<Player>(),
    loading: false,
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
    this.setState({ loading: true });
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
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("Fetch Error in generatePairings", err);
        this.setState({ loading: false });
      });
  }

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
    this.setState({ loading: true });
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
        console.log("hostHubInit: ", hostHubInit);
        this.buildStateFromHostHubDTO(hostHubInit);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("Fetch error occured in getHostHubData", err);
        this.setState({ loading: false });
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
    this.getHostHubData();
  }

  render() {
    if (this.state.tournament.getRoomCode() === "") {
      return <LoadingDiv loading={this.state.loading} />;
    } else if (
      this.state.tournament.getTournamentStatus() === TournamentStatus.Complete
    ) {
      return (
        <React.Fragment>
          <FinalResults
            tournament={this.state.tournament}
            playerList={this.state.playerList}
            serverAddress={this.props.serverAddress}
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
            serverAddress={this.props.serverAddress}
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
