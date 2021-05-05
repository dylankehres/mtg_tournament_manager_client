import { TournamentIntf } from "./tournament";
import { Player, PlayerIntf } from "./player";
import { MatchData, MatchDataIntf } from "./matchData";
import { Tournament } from "./tournament";

interface PlayerInfoIntf {
    tournament: TournamentIntf;
    player: PlayerIntf;
    matchDataList: MatchDataIntf[];
  }

  class PlayerInfo {
    private player: Player;
    private tournament: Tournament;
    private matchDataList: MatchData[];
  
    constructor(initData?: PlayerInfoIntf) {
      if (initData) {
        this.player = new Player(initData.player);
        this.tournament = new Tournament(initData.tournament);
        this.matchDataList = [];
        initData.matchDataList.forEach((matchData) =>
          this.matchDataList.push(new MatchData(matchData))
        );
      } else {
        this.player = new Player();
        this.tournament = new Tournament();
        this.matchDataList = [];
      }
    }
  
    getPlayerInfoIntf(): PlayerInfoIntf{
      const matchDataListInit: MatchDataIntf[] = new Array<MatchDataIntf>();
      this.getMatchDataList().forEach(matchData => matchDataListInit.push(matchData.getMatchDataIntf()));
  
      const playerInfoInit: PlayerInfoIntf = {
        player: this.getPlayer().getPlayerIntf(),
        tournament: this.getTournament().getTournamentIntf(),
        matchDataList: matchDataListInit,
      };
  
      return playerInfoInit;
    }
  
    getPlayer(): Player {
      return this.player;
    }

    getTournament(): Tournament {
        return this.tournament;
    }

    getMatchDataList(): MatchData[] {
        return this.matchDataList;
    }
}

export  {PlayerInfo};
export type {PlayerInfoIntf};