interface PlayerIntf {
  id: string;
  tournamentID: string;
  name: string;
  roomCode: string;
  deckName: string;
  deckList: string;
  points: number;
  bye: boolean;
}

class Player {
  private id: string;
  private tournamentID: string;
  private name: string;
  private roomCode: string;
  private deckName: string;
  private deckList: string;
  private points: number;
  private bye: boolean;

  constructor(initData?: PlayerIntf) {
    if (initData) {
      this.id = initData.id;
      this.tournamentID = initData.tournamentID;
      this.name = initData.name;
      this.roomCode = initData.roomCode;
      this.deckName = initData.deckName;
      this.deckList = initData.deckList;
      this.points = initData.points;
      this.bye = initData.bye;
    } else {
      this.id = "";
      this.tournamentID = "";
      this.name = "";
      this.roomCode = "";
      this.deckName = "";
      this.deckList = "";
      this.points = 0;
      this.bye = false;
    }
  }

  getPlayerIntf(): PlayerIntf {
    const playerInit: PlayerIntf = {
      id: this.getID(),
      tournamentID: this.getTournamentID(),
      name: this.getName(),
      roomCode: this.getRoomCode(),
      deckName: this.getDeckName(),
      deckList: this.getDeckList(),
      points: this.getPoints(),
      bye: this.getBye(),
    }

    return playerInit;
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

  getDeckName(): string {
    return this.deckName;
  }

  getDeckList(): string {
    return this.deckList;
  }

  getPoints(): number {
    return this.points;
  }

  getBye(): boolean {
    return this.bye;
  }
}

export { Player };
export type { PlayerIntf };
