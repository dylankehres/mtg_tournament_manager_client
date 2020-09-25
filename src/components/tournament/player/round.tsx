import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import Timer from "react-compound-timer";
import LoadingDiv from "../../loadingDiv";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Game, ResultStatus, ResultStatusMsg } from "../../dtos/game";

type RoundProps = {
  serverAddress: string;
  match: {
    params: {
      playerID: string;
    };
  };
};

type RoundState = {
  roundNum: number;
  playerID: string;
  opponentID: string;
  resultStatus: number;
  resultStatusMsg: string;
  matchData: MatchData;
  winnersList: string[];
  timeRemaining: number;
};

class Round extends Component<RoundProps, RoundState> {
  state = {
    roundNum: 1,
    playerID: "",
    opponentID: "",
    resultStatus: -1,
    resultStatusMsg: "",
    matchData: new MatchData(),
    winnersList: [],
    timeRemaining: -1,
  };

  playerGameWin() {
    this.reportResults(this.state.playerID);
  }

  opponentGameWin() {
    this.reportResults(this.state.opponentID);
  }

  reportResults(winnerID: string) {
    console.log("Report results");
    console.log("Game List: ", this.state.matchData.getGameList());

    const currentGame = this.state.matchData.getActiveGame();
    const currentGameID = currentGame.getID();

    fetch(
      `${this.props.serverAddress}/match/gameResults/${this.props.match.params.playerID}/${winnerID}`,
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
        const activeGame = this.state.matchData.getGameByID(currentGameID);

        if (currentGameID === this.state.matchData.getMatch().activeGameID) {
          this.setResultStatusMsg();
        } else {
          if (activeGame.getResultStatus() === ResultStatus.ResultsFinal) {
            // These are final results
            console.log("Results are final");
          }
        }
      })
      .catch((err) =>
        console.log("Ajax Error in round.tsx reportResults", err)
      );
  }

  gameDraw() {
    console.log("Game Draw");
  }

  hasVoted(): boolean {
    if (this.state.resultStatus === ResultStatus.ResultsFinal) {
      return false;
    } else if (this.state.resultStatus === ResultStatus.ResultsPending) {
      return !this.state.matchData.getPlayerHasVoted(this.state.playerID);
    }
    return false;
  }

  setResultStatusMsg() {
    const activeGame: Game = this.state.matchData.getActiveGame();
    if (activeGame.getResultStatus() === ResultStatus.NoResults) {
      // Waiting on other votes
      console.log("No results have been reported");
      this.setState({
        resultStatus: ResultStatus.NoResults,
        resultStatusMsg: ResultStatusMsg.NoResults,
      });
    } else if (activeGame.getResultStatus() === ResultStatus.ResultsPending) {
      // Someone voted, was it this player?
      if (this.state.matchData.getPlayer1().id === this.state.playerID) {
        if (activeGame.getPlayer1Voted()) {
          // Waiting on other votes
          console.log("Awaiting final results");
          this.setState({
            resultStatus: ResultStatus.ResultsPending,
            resultStatusMsg: ResultStatusMsg.ResultsPending,
          });
        }
      } else {
        if (activeGame.getPlayer2Voted()) {
          // Waiting on other votes
          console.log("Awaiting final results");
          this.setState({
            resultStatus: ResultStatus.ResultsPending,
            resultStatusMsg: ResultStatusMsg.ResultsPending,
          });
        }
      }
    } else if (activeGame.getResultStatus() === ResultStatus.ResultsDisputed) {
      // Disputed results
      console.log("Results are being disputed");
      this.setState({
        resultStatus: ResultStatus.ResultsDisputed,
        resultStatusMsg: ResultStatusMsg.ResutsDisputed,
      });
    } else if (activeGame.getResultStatus() === ResultStatus.ResultsFinal) {
      // Final results
      console.log("Results are final");
      this.setState({
        resultStatus: ResultStatus.ResultsFinal,
        resultStatusMsg: ResultStatusMsg.ResultsFinal,
      });
    }
  }

  getMatchData(): void {
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
        this.setState({
          timeRemaining: this.state.matchData.getMatch().endTime - Date.now(),
        });

        if (
          this.props.match.params.playerID ===
          this.state.matchData.getPlayer1().id
        ) {
          this.setState({
            playerID: this.state.matchData.getPlayer1().id,
            opponentID: this.state.matchData.getPlayer2().id,
          });
        } else {
          this.setState({
            playerID: this.state.matchData.getPlayer2().id,
            opponentID: this.state.matchData.getPlayer1().id,
          });
        }
        this.setResultStatusMsg();
        this.buildWinnersList();
      })
      .catch((err) => console.log("Ajax Error in round.tsx getMatchData", err));
  }

  buildWinnersList() {
    let winners = [];
    // this.state.matchData.getGameList().reverse();
    this.state.matchData.getGameList().forEach((game) => {
      if (game !== null) {
        if (game.getWinningPlayerID() === "-1") {
          winners.push("");
        } else if (
          game.getWinningPlayerID() === this.state.matchData.getPlayer1().id
        ) {
          winners.push(this.state.matchData.getPlayer1().name);
        } else if (
          game.getWinningPlayerID() === this.state.matchData.getPlayer2().id
        ) {
          winners.push(this.state.matchData.getPlayer2().name);
        } else {
          winners.push("Error!");
        }
      }
    });

    if (winners.length === 0) {
      winners.push("");
    }

    this.setState({ winnersList: winners });
  }

  componentDidMount() {
    this.getMatchData();
  }

  render() {
    if (this.state.timeRemaining === -1) {
      return <LoadingDiv />;
    }
    return (
      <div className="m-2">
        <table>
          <thead>
            <tr>
              <th>
                <h3>{"Round " + this.state.roundNum}</h3>
              </th>
              <th></th>
              <th>
                <Timer
                  initialTime={this.state.timeRemaining}
                  direction="backward"
                >
                  {() => (
                    <React.Fragment>
                      <Timer.Minutes /> {"minutes "}
                      <Timer.Seconds /> {"seconds"}
                    </React.Fragment>
                  )}
                </Timer>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Game #</th>
                      <th>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.winnersList.map((winner, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{winner}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>
                <div className="m-2"></div>
              </td>
              <td style={{ verticalAlign: "top" }}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <Button
                          className="btn btn-success"
                          style={{ width: "136px" }}
                          disabled={this.hasVoted()}
                          onClick={() => this.playerGameWin()}
                        >
                          I Won
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Button
                          className="btn btn-danger"
                          style={{ width: "136px" }}
                          disabled={this.hasVoted()}
                          onClick={() => this.opponentGameWin()}
                        >
                          Opponent Won
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Button
                          className="btn btn-primary"
                          style={{ width: "136px" }}
                          disabled={this.hasVoted()}
                          onClick={() => this.gameDraw()}
                        >
                          Draw
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <h4>{this.state.resultStatusMsg}</h4>
        </div>
      </div>
    );
  }
}

export default Round;
