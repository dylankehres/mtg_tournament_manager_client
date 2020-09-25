import { Player } from "./player";
import { Match } from "./match";
import { Game, GameIntf } from "./game";

interface MatchDataIntf {
  player1: Player;
  player2: Player;
  match: Match;
  gameList: GameIntf[];
}

class MatchData {
  private player1: Player;
  private player2: Player;
  private match: Match;
  private gameList: Game[];

  constructor(initData?: MatchDataIntf) {
    if (initData) {
      this.player1 = initData.player1;
      this.player2 = initData.player2;
      this.match = initData.match;
      this.gameList = [];
      initData.gameList.forEach((gameData) =>
        this.gameList.push(new Game(gameData))
      );
    } else {
      this.player1 = new Player();
      this.player2 = new Player();
      this.match = new Match();
      this.gameList = [];
    }
  }

  getPlayer1(): Player {
    return this.player1;
  }

  getPlayer2(): Player {
    return this.player2;
  }

  getMatch(): Match {
    return this.match;
  }

  getGameList(): Game[] {
    return this.gameList;
  }

  getActiveGame() {
    const activeGame = this.getGameList().find(
      (game) => game.getIsActive(),
      new Game()
    );

    if (activeGame === undefined) {
      return new Game();
    }

    return activeGame;
  }

  getGameByID(id: string): Game {
    const game = this.getGameList().find(
      (game: Game) => game.getID() === id,
      new Game()
    );

    if (game === undefined) {
      return new Game();
    }

    return game;
  }

  getPlayerByID(id: string): Player {
    if (this.getPlayer1().id === id) {
      return this.getPlayer1();
    } else if (this.getPlayer2().id === id) {
      return this.getPlayer2();
    }

    return new Player();
  }

  getPlayerHasVoted(playerID: string): boolean {
    if (this.getMatch().player1ID === playerID) {
      return this.getActiveGame().getPlayer1Voted();
    } else if (this.getMatch().player2ID === playerID) {
      return this.getActiveGame().getPlayer2Voted();
    }

    return false;
  }
}

export { MatchData };
export type { MatchDataIntf };
