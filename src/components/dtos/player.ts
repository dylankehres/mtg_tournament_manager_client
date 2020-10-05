interface PlayerIntf {
  id: string;
  tournamentID: string;
  name: string;
  roomCode: string;
  format: string;
  deckName: string;
  points: number;
}

class Player {
  private id: string;
  private tournamentID: string;
  private name: string;
  private roomCode: string;
  private format: string;
  private deckName: string;
  private points: number;

  constructor(initData?: PlayerIntf) {
    if (initData) {
      this.id = initData.id;
      this.tournamentID = initData.tournamentID;
      this.name = initData.name;
      this.roomCode = initData.roomCode;
      this.format = initData.format;
      this.deckName = initData.deckName;
      this.points = initData.points;
    } else {
      this.id = "";
      this.tournamentID = "";
      this.name = "";
      this.roomCode = "";
      this.format = "";
      this.deckName = "";
      this.points = 0;
    }
  }

  getID(): string {
    return this.id;
  }

  getTournamentID(): string {
    return this.tournamentID;
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

  getDeckName(): string {
    return this.deckName;
  }

  getPoints(): number {
    return this.points;
  }
}

export { Player };
export type { PlayerIntf };
