import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import Pairings from "../pairings";
import PlayerList from "../playerList";
import PlayerMatch from "./playerMatch";
import Round from "./round";
import FinalResults from "../finalResults";
import { Player } from "../../dtos/player";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Tournament, TournamentStatus } from "components/dtos/tournament";
import { MatchStatus } from "components/dtos/match";
import { PlayerHubDtoIntf } from "components/dtos/hubDtos";
import LoadingDiv from "components/loadingDiv";

type PlayerHubProps = {
  serverAddress: string;
  match: {
    params: {
      playerID: string;
    };
  };
};

type PlayerHubState = {
  tournament: Tournament;
  playerList: Player[];
  pairings: MatchData[];
  matchData: MatchData;
  currPlayer: Player;
  loading: boolean;
};

class PlayerHub extends Component<PlayerHubProps, PlayerHubState> {
  state = {
    tournament: new Tournament(),
    playerList: new Array<Player>(),
    pairings: new Array<MatchData>(),
    matchData: new MatchData(),
    currPlayer: new Player(),
    loading: false,
  };

  constructor(props: PlayerHubProps) {
    super(props);

    this.buildStateFromPlayerHubDto = this.buildStateFromPlayerHubDto.bind(
      this
    );
  }

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

  readyUp() {
    fetch(
      `${
        this.props.serverAddress
      }/match/ready/${this.state.currPlayer.getID()}/${this.state.matchData
        .getMatch()
        .getRoundNum()}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((matchDataInit: MatchDataIntf) => {
        this.setState({ matchData: new MatchData(matchDataInit) });
      })
      .catch((err) =>
        console.log("Fetch Error in readyUp for playerWaiting.jsx", err)
      );
  }

  buildStateFromPlayerHubDto(playerHubInit: PlayerHubDtoIntf): void {
    const playerList = new Array<Player>();
    if (playerHubInit?.playerList?.length > 0) {
      for (let playerInit of playerHubInit.playerList) {
        playerList.push(new Player(playerInit));
      }
    }

    const pairings = new Array<MatchData>();
    if (playerHubInit?.pairings?.length) {
      for (let matchInit of playerHubInit.pairings) {
        pairings.push(new MatchData(matchInit));
      }
    }

    this.setState({
      tournament: new Tournament(playerHubInit.tournament),
      playerList,
      pairings,
      matchData: new MatchData(playerHubInit.matchData),
      currPlayer: new Player(playerHubInit.currPlayer),
    });
  }

  getPlayerHubData(): void {
    this.setState({ loading: true });
    fetch(
      `${this.props.serverAddress}/playerHub/${this.props.match.params.playerID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((playerHubInit: PlayerHubDtoIntf) => {
        this.buildStateFromPlayerHubDto(playerHubInit);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("Fetch error occurred in getPlayerHubData()", err);
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    this.getPlayerHubData();
  }

  render() {
    if (
      // Waiting for player to ready up
      this.state.tournament.getTournamentStatus() ===
        TournamentStatus.InProgress &&
      this.state.matchData.getMatch().getMatchStatus() ===
        MatchStatus.AwaitingPlayers &&
      !this.state.matchData
        .getMatch()
        .getPlayerReadyByID(this.state.currPlayer.getID())
    ) {
      return (
        <React.Fragment>
          <PlayerMatch
            currPlayer={this.state.currPlayer}
            matchData={this.state.matchData}
            serverAddress={this.props.serverAddress}
          />
          <Pairings
            pairings={this.state.pairings}
            serverAddress={this.props.serverAddress}
          />
          <Button
            className="btn btn-success m-2"
            onClick={() => this.readyUp()}
          >
            Ready
          </Button>
        </React.Fragment>
      );
    } else if (
      // Player is ready
      this.state.matchData.getMatch().getMatchStatus() !==
        MatchStatus.Complete &&
      this.state.matchData
        .getMatch()
        .getPlayerReadyByID(this.state.currPlayer.getID())
    ) {
      const roundProps = {
        serverAddress: this.props.serverAddress,
        playerID: this.props.match.params.playerID,
        matchData: this.state.matchData,
        updatePlayerHub: this.buildStateFromPlayerHubDto,
        key: `round_${this.state.matchData.getMatch().getRoundNum()}`,
        match: this.props.match,
      };
      return <Round {...roundProps} />;
    } else if (
      this.state.matchData.getMatch().getMatchStatus() === MatchStatus.Complete
    ) {
      if (
        this.state.tournament.getTournamentStatus() ===
        TournamentStatus.Complete
      ) {
        return (
          <FinalResults
            tournament={this.state.tournament}
            playerList={this.state.playerList}
          />
        );
      } else {
        return (
          <React.Fragment>
            <Pairings
              pairings={this.state.pairings}
              serverAddress={this.props.serverAddress}
            />
            <h4>Waiting for next round to start...</h4>
          </React.Fragment>
        );
      }
    } else if (this.state.currPlayer.getRoomCode() !== "") {
      return (
        <div className="m-2">
          <PlayerList
            serverAddress={this.props.serverAddress}
            playerList={this.state.playerList}
            key={"playerList_" + this.state.tournament.getRoomCode()}
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
      return <LoadingDiv loading={this.state.loading} />;
    }
  }
}

export default PlayerHub;
