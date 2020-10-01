interface MatchIntf {
  id: string;
  tournamentID: string;
  player1ID: string;
  player2ID: string;
  player1Wins: number;
  player2Wins: number;
  player1Ready: boolean;
  player2Ready: boolean;
  tableNum: number;
  activeboolean: boolean;
  gameKeys: string[];
  activeGameID: string;
  startTime: number;
  endTime: number;
  timeLimit: number;
}

class Match {
  private id: string;
  private tournamentID: string;
  private player1ID: string;
  private player2ID: string;
  private player1Wins: number;
  private player2Wins: number;
  private player1Ready: boolean;
  private player2Ready: boolean;
  private tableNum: number;
  private active: boolean;
  private gameKeys: string[];
  private activeGameID: string;
  private startTime: number;
  private endTime: number;
  private timeLimit: number;

  constructor(initData?: MatchIntf) {
    if (initData) {
      this.id = initData.id;
      this.tournamentID = initData.tournamentID;
      this.player1ID = initData.player1ID;
      this.player2ID = initData.player2ID;
      this.player1Wins = initData.player1Wins;
      this.player2Wins = initData.player2Wins;
      this.player1Ready = initData.player1Ready;
      this.player2Ready = initData.player2Ready;
      this.tableNum = initData.tableNum;
      this.active = initData.activeboolean;
      this.gameKeys = initData.gameKeys;
      this.activeGameID = initData.activeGameID;
      this.startTime = initData.startTime;
      this.endTime = initData.endTime;
      this.timeLimit = initData.timeLimit;
    } else {
      this.id = "";
      this.tournamentID = "";
      this.player1ID = "";
      this.player2ID = "";
      this.player1Wins = 0;
      this.player2Wins = 0;
      this.player1Ready = false;
      this.player2Ready = false;
      this.tableNum = 0;
      this.active = false;
      this.gameKeys = [];
      this.activeGameID = "";
      this.startTime = 0;
      this.endTime = 0;
      this.timeLimit = 0;
    }
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

  getPlayer1Ready(): boolean {
    return this.player1Ready;
  }

  getPlayer2Ready(): boolean {
    return this.player2Ready;
  }

  getTableNum(): number {
    return this.tableNum;
  }

  getActive(): boolean {
    return this.active;
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
}

export { Match };
export type { MatchIntf };
