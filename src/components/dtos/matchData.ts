import { Player, PlayerIntf } from "./player";
import { Match, MatchIntf } from "./match";
import { Game, GameIntf } from "./game";

interface MatchDataIntf {
  player1: PlayerIntf;
  player2: PlayerIntf;
  match: MatchIntf;
  gameList: GameIntf[];
}

class MatchData {
  private player1: Player;
  private player2: Player;
  private match: Match;
  private gameList: Game[];

  constructor(initData?: MatchDataIntf) {
    if (initData) {
      this.player1 = new Player(initData.player1);
      this.player2 = new Player(initData.player2);
      this.match = new Match(initData.match);
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

  getMatchDataIntf(): MatchDataIntf{
    const gameListInit: GameIntf[] = new Array<GameIntf>();
    this.getGameList().forEach(game => gameListInit.push(game.getGameIntf()));

    const matchDataInit: MatchDataIntf = {
      player1: this.getPlayer1().getPlayerIntf(),
      player2: this.getPlayer2().getPlayerIntf(),
      match: this.getMatch().getMatchIntf(),
      gameList: gameListInit,
    };

    return matchDataInit;
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
      (game) => game.getActive(),
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

  /**
   * Returns the player with the given ID
   * @param id Player ID
   */
  getPlayerByID(id: string): Player {
    if (this.getPlayer1().getID() === id) {
      return this.getPlayer1();
    } else if (this.getPlayer2().getID() === id) {
      return this.getPlayer2();
    }

    return new Player();
  }

  /**
   * Returns the oppoenent of the player with the given ID
   * @param id 
   */
  getOpponentByPlayerID(id: string): Player {
    if (this.getPlayer1().getID() === id) {
      return this.getPlayer2();
    } else if (this.getPlayer2().getID() === id) {
      return this.getPlayer1();
    }

    return new Player();
  }

  /**
   * Returns true if the player with the given ID has voted in the active game
   * @param playerID 
   */
  getPlayerHasVoted(playerID: string): boolean {
    if (this.getMatch().getPlayer1ID() === playerID) {
      return this.getActiveGame().getPlayer1Voted();
    } else if (this.getMatch().getPlayer2ID() === playerID) {
      return this.getActiveGame().getPlayer2Voted();
    }

    return false;
  }
}

export { MatchData };
export type { MatchDataIntf };
