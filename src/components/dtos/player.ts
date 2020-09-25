class Player {
  id: string;
  tournamentID: string;
  name: string;
  roomCode: string;
  format: string;
  deckName: string;

  constructor() {
    this.id = "";
    this.tournamentID = "";
    this.name = "";
    this.roomCode = "";
    this.format = "";
    this.deckName = "";
  }
}

export { Player };
