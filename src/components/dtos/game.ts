interface GameIntf {
  id: string;
  matchID: string;
  tournamentID: string;
  gameNum: number;
  player1Wins: number;
  player2Wins: number;
  draw: number;
  player1Ready: boolean;
  player2Ready: boolean;
  player1Voted: boolean;
  player2Voted: boolean;
  resultStatus: number;
  winningPlayerID: string;
  isActive: boolean;
}

class Game {
  private data: GameIntf;

  constructor(initData?: GameIntf) {
    if (initData) {
      this.data = initData;
    } else {
      this.data = {
        id: "",
        matchID: "",
        tournamentID: "",
        gameNum: 0,
        player1Wins: 0,
        player2Wins: 0,
        draw: 0,
        player1Ready: false,
        player2Ready: false,
        player1Voted: false,
        player2Voted: false,
        resultStatus: 0,
        winningPlayerID: "-1",
        isActive: false,
      };
    }
  }

  getID(): string {
    return this.data.id;
  }

  getMatchID(): string {
    return this.data.matchID;
  }

  getTournamentID(): string {
    return this.data.tournamentID;
  }

  getGameNum(): number {
    return this.data.gameNum;
  }

  getPlayer1Wins(): number {
    return this.data.player1Wins;
  }

  getPlayer2Wins(): number {
    return this.data.player2Wins;
  }

  getDraw(): number {
    return this.data.draw;
  }

  getPlayer1Ready(): boolean {
    return this.data.player1Ready;
  }

  getPlayer2Ready(): boolean {
    return this.data.player2Ready;
  }

  getPlayer1Voted(): boolean {
    return this.data.player1Voted;
  }

  getPlayer2Voted(): boolean {
    return this.data.player2Voted;
  }

  getResultStatus(): number {
    return this.data.resultStatus;
  }

  getWinningPlayerID(): string {
    return this.data.winningPlayerID;
  }

  getIsActive(): boolean {
    return this.data.isActive;
  }
}

enum ResultStatus {
  NoResults,
  ResultsPending,
  ResultsFinal,
  ResultsDisputed,
}

enum ResultStatusMsg {
  NoResults = "",
  ResultsPending = "Waiting for your opponent to report results...",
  ResultsFinal = "Your results have been reported. Waiting for the next round to begin...",
  ResutsDisputed = "Your opponent reported a different result. Please settle this dispute, calling a judge if necessary, and resubmit your resutls.",
}

export { Game, ResultStatus, ResultStatusMsg };
export type { GameIntf };
