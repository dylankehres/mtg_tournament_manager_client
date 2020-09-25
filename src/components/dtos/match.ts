class Match {
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

  constructor() {
    this.id = "";
    this.tournamentID = "";
    this.player1ID = "";
    this.player2ID = "";
    this.player1Wins = 0;
    this.player2Wins = 0;
    this.player1Ready = false;
    this.player2Ready = false;
    this.tableNum = 0;
    this.activeboolean = false;
    this.gameKeys = [];
    this.activeGameID = "";
    this.startTime = 0;
    this.endTime = 0;
    this.timeLimit = 0;
  }
}

export { Match };
