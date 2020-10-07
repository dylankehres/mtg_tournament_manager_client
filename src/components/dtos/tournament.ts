interface TournamentIntf {
  id: string;
  name: string;
  roomCode: string;
  format: string;
  numRounds: number;
  numGames: number;
  currRound: number;
}

class Tournament {
  private id: string;
  private name: string;
  private roomCode: string;
  private format: string;
  private numRounds: number;
  private numGames: number;
  private currRound: number;

  constructor(initData?: TournamentIntf) {
    if (initData) {
      this.id = initData.id;
      this.name = initData.name;
      this.roomCode = initData.roomCode;
      this.format = initData.format;
      this.numRounds = initData.numRounds;
      this.numGames = initData.numGames;
      this.currRound = initData.currRound;
    } else {
      this.id = "";
      this.name = "";
      this.roomCode = "";
      this.format = "";
      this.numRounds = 0;
      this.numGames = 0;
      this.currRound = 0;
    }
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
}

enum Formats {
  Standard = "Standard",
  Pioneer = "Pioneer",
  Modern = "Modern",
  Legacy = "Legacy",
  EDH = "Commander",
}

export { Tournament, Formats };
export type { TournamentIntf };
