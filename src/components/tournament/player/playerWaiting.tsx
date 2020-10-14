import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Pairings from "../pairings";
import PlayerList from "../playerList";
import PlayerMatch from "./playerMatch";
import FinalResults from "../finalResults";
import { Player, PlayerIntf } from "../../dtos/player";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Tournament, TournamentIntf, TournamentStatus } from 'components/dtos/tournament';
import { MatchStatus } from 'components/dtos/match';

type PlayerWaitingProps = {
  serverAddress: string;
  match: {
    params: {
      playerID: string;
    };
  };
};

type PlayerWaitingState = {
  tournament: Tournament;
  playerList: Player[];
  pairings: MatchData[];
  matchData: MatchData;
  currPlayer: Player;
  player1: Player;
  player2: Player;
};

class PlayerWaiting extends Component<PlayerWaitingProps, PlayerWaitingState> {
  state = {
    tournament: new Tournament(),
    playerList: new Array<Player>(),
    pairings: new Array<MatchData>(),
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
    this.getPlayerData().then((initCurrPlayer: PlayerIntf) => {
      const currPlayer = new Player(initCurrPlayer);
      if (currPlayer.getRoomCode() === "") {
        alert("Something went wrong. Please try that again.");
      } else {
        this.setState({ currPlayer });
        this.getPlayerList();

        fetch(
          `${
            this.props.serverAddress
          }/pairings/${this.state.currPlayer.getRoomCode()}`,
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
        this.getTournament();
      })
      .catch((err) => console.log("Fetch Error in getPlayerMatch", err));
  }

  getTournament() {
    if(this.state.matchData.getMatch().getTournamentID() !== "") {
      fetch(
        `${this.props.serverAddress}/tournament/${this.state.matchData.getMatch().getTournamentID()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((tournamentInit: TournamentIntf) => {
          this.setState({ tournament: new Tournament(tournamentInit) });
          console.log("tournament: ", this.state.tournament);
        })
        .catch((err) => console.log("Fetch Error in getTournament", err));
    }
  }

  getPlayerList(): void {
    const playerList: Player[] = [];

    fetch(`${this.props.serverAddress}/playerList/${this.state.currPlayer.getRoomCode()}`, {
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
        console.log("Player ready: ", matchDataInit);
        this.setState({ matchData: new MatchData(matchDataInit) });
      })
      .catch((err) =>
        console.log("Fetch Error in readyUp for playerWaiting.jsx", err)
      );
  }

  componentDidMount() {
    this.getPairings();
    this.getPlayerMatch();
  }

  render() {
    if (
      // Waiting for player to ready up
      this.state.tournament.getTournamentStatus() === TournamentStatus.InProgress &&
      this.state.matchData.getMatch().getMatchStatus() === MatchStatus.AwaitingPlayers &&
      !this.state.matchData
        .getMatch()
        .getPlayerReadyByID(this.state.currPlayer.getID())
    ) {
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
            onClick={() => this.readyUp()}
          >
            Ready
          </Button>
        </React.Fragment>
      );

    } else if (
      // Player is ready
      this.state.matchData.getMatch().getMatchStatus() !== MatchStatus.Complete &&
      this.state.matchData
        .getMatch()
        .getPlayerReadyByID(this.state.currPlayer.getID())
    ) {
      return <Redirect to={`/round/${this.state.currPlayer.getID()}`} />;

    } else if (this.state.matchData.getMatch().getMatchStatus() === MatchStatus.Complete) {
      if (this.state.tournament.getTournamentStatus() === TournamentStatus.Complete) {
        return <FinalResults tournament={this.state.tournament} playerList={this.state.playerList}/>;
      }
      else {
        return (
          <React.Fragment>
            <Pairings pairings={this.state.pairings} onGetPairings={this.getPairings} />
            <h4>Waiting for next round to start...</h4>
          </React.Fragment>
        
        );

      }
    } else if (this.state.currPlayer.getRoomCode() !== "") {
      return (
        <div className="m-2">
          <PlayerList
            serverAddress={this.props.serverAddress}
            roomCode={this.state.currPlayer.getRoomCode()}
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
