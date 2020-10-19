interface MatchIntf {
  id: string;
  tournamentID: string;
  player1ID: string;
  player2ID: string;
  player1Wins: number;
  player2Wins: number;
  draws: number;
  player1Ready: boolean;
  player2Ready: boolean;
  tableNum: number;
  matchStatus: number;
  gameKeys: string[];
  activeGameID: string;
  startTime: number;
  endTime: number;
  timeLimit: number;
  roundNum: number;
  numGames: number;
}

enum MatchStatus {
  AwaitingPlayers,
  InProgress,
  Complete,
}

class Match {
  private id: string;
  private tournamentID: string;
  private player1ID: string;
  private player2ID: string;
  private player1Wins: number;
  private player2Wins: number;
  private draws: number;
  private player1Ready: boolean;
  private player2Ready: boolean;
  private tableNum: number;
  private matchStatus: number;
  private gameKeys: string[];
  private activeGameID: string;
  private startTime: number;
  private endTime: number;
  private timeLimit: number;
  private roundNum: number;
  private numGames: number;

  constructor(initData?: MatchIntf) {
    if (initData) {
      this.id = initData.id;
      this.tournamentID = initData.tournamentID;
      this.player1ID = initData.player1ID;
      this.player2ID = initData.player2ID;
      this.player1Wins = initData.player1Wins;
      this.player2Wins = initData.player2Wins;
      this.draws = initData.draws;
      this.player1Ready = initData.player1Ready;
      this.player2Ready = initData.player2Ready;
      this.tableNum = initData.tableNum;
      this.matchStatus = initData.matchStatus;
      this.gameKeys = initData.gameKeys;
      this.activeGameID = initData.activeGameID;
      this.startTime = initData.startTime;
      this.endTime = initData.endTime;
      this.timeLimit = initData.timeLimit;
      this.roundNum = initData.roundNum;
      this.numGames = initData.numGames;
    } else {
      this.id = "";
      this.tournamentID = "";
      this.player1ID = "";
      this.player2ID = "";
      this.player1Wins = 0;
      this.player2Wins = 0;
      this.draws = 0;
      this.player1Ready = false;
      this.player2Ready = false;
      this.tableNum = 0;
      this.matchStatus = 0;
      this.gameKeys = [];
      this.activeGameID = "";
      this.startTime = 0;
      this.endTime = 0;
      this.timeLimit = 0;
      this.roundNum = 0;
      this.numGames = 0;
    }
  }

  getMatchIntf(): MatchIntf {
    const matchInit: MatchIntf = {
      id: this.getID(),
      tournamentID: this.getTournamentID(),
      player1ID: this.getPlayer1ID(), 
      player2ID: this.getPlayer2ID(),
      player1Wins: this.getPlayer1Wins(),
      player2Wins: this.getPlayer2Wins(),
      draws: this.getDraws(),
      player1Ready: this.getPlayer1Ready(),
      player2Ready: this.getPlayer2Ready(),
      tableNum: this.getTableNum(),
      matchStatus: this.getMatchStatus(),
      gameKeys: this.getGameKeys(),
      activeGameID: this.getActiveGameID(),
      startTime: this.getStartTime(),
      endTime: this.getEndTime(),
      timeLimit: this.getTimeLimit(),
      roundNum: this.getRoundNum(),
      numGames: this.getNumGames(),
    };

    return matchInit;
  }

  getID(): string {
    return this.id;
  }

  getTournamentID(): string {
    return this.tournamentID;
  }

  getPlayer1ID(): string {
    return this.player1ID;
  }

  getPlayer2ID(): string {
    return this.player2ID;
  }

  getPlayer1Wins(): number {
    return this.player1Wins;
  }

  getPlayer2Wins(): number {
    return this.player2Wins;
  }

  getDraws(): number {
    return this.draws;
  }

  getPlayer1Ready(): boolean {
    return this.player1Ready;
  }

  getPlayer2Ready(): boolean {
    return this.player2Ready;
  }

  getTableNum(): number {
    return this.tableNum;
  }

  getMatchStatus(): number {
    return this.matchStatus;
  }

  getGameKeys(): string[] {
    return this.gameKeys;
  }

  getActiveGameID(): string {
    return this.activeGameID;
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number {
    return this.endTime;
  }

  getTimeLimit(): number {
    return this.timeLimit;
  }

  getRoundNum(): number {
    return this.roundNum;
  }

  getNumGames(): number {
    return this.numGames;
  }

  getPlayerReadyByID(playerID: string): boolean {
    if (this.player1ID === playerID) {
      return this.player1Ready;
    } else if (this.player2ID === playerID) {
      return this.player2Ready;
    }

    return false;
  }
}

export { Match, MatchStatus };
export type { MatchIntf };
