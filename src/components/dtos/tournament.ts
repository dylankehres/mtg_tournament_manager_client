interface TournamentIntf {
  id: string;
  name: string;
  roomCode: string;
  format: string;
  rounds: number;
  games: number;
}

class Tournament {
  private id: string;
  private name: string;
  private roomCode: string;
  private format: string;
  private rounds: number;
  private games: number;

  constructor(initData?: TournamentIntf) {
    if (initData) {
      this.id = initData.id;
      this.name = initData.name;
      this.roomCode = initData.roomCode;
      this.format = initData.format;
      this.rounds = initData.rounds;
      this.games = initData.games;
    } else {
      this.id = "";
      this.name = "";
      this.roomCode = "";
      this.format = "";
      this.rounds = 0;
      this.games = 0;
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

  getRounds(): number {
    return this.rounds;
  }

  getGames(): number {
    return this.games;
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
