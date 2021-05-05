interface TournamentIntf {
  id: string;
  name: string;
  roomCode: string;
  format: string;
  numRounds: number;
  numGames: number;
  currRound: number;
  tournamentStatus: number;
  active: boolean
}

enum Formats {
  Standard = "Standard",
  Pioneer = "Pioneer",
  Modern = "Modern",
  Legacy = "Legacy",
  EDH = "Commander",
}

enum TournamentStatus {
  AwaitingStart, InProgress, Complete
}

class Tournament {
  private id: string;
  private name: string;
  private roomCode: string;
  private format: string;
  private numRounds: number;
  private numGames: number;
  private currRound: number;
  private tournamentStatus: number;
  private active: boolean;

  constructor(initData?: TournamentIntf) {
    if (initData) {
      this.id = initData.id;
      this.name = initData.name;
      this.roomCode = initData.roomCode;
      this.format = initData.format;
      this.numRounds = initData.numRounds;
      this.numGames = initData.numGames;
      this.currRound = initData.currRound;
      this.tournamentStatus = initData.tournamentStatus;
      this.active = initData.active;
    } else {
      this.id = "";
      this.name = "";
      this.roomCode = "";
      this.format = "";
      this.numRounds = 0;
      this.numGames = 0;
      this.currRound = 0;
      this.tournamentStatus = 0;
      this.active = false;
    }
  }

  getTournamentIntf(): TournamentIntf{
    const tournamentInit: TournamentIntf = {
      id: this.getID(),
      name: this.getName(),
      roomCode: this.getRoomCode(),
      format: this.getFormat(),
      numRounds: this.getNumRounds(),
      numGames: this.getNumGames(),
      currRound: this.getCurrRound(),
      tournamentStatus: this.getTournamentStatus(),
      active: this.getActive()
    };

    return tournamentInit;
  }

  getID(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getRoomCode(): string {
    return this.roomCode;
  }

  getFormat(): string {
    return this.format;
  }

  getNumRounds(): number {
    return this.numRounds;
  }

  getNumGames(): number {
    return this.numGames;
  }

  getCurrRound(): number {
    return this.currRound;
  }

  getTournamentStatus(): number {
    return this.tournamentStatus;
  }

  getActive(): boolean {
    return this.active;
  }
}

export { Tournament, TournamentStatus, Formats };
export type { TournamentIntf };
