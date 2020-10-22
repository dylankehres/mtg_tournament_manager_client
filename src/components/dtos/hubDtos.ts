import { TournamentIntf } from "./tournament";
import { PlayerIntf } from "./player";
import { MatchDataIntf } from "./matchData";

interface PlayerHubDtoIntf {
    tournament: TournamentIntf;
    playerList: PlayerIntf[];
    pairings: MatchDataIntf[];
    matchData: MatchDataIntf;
    currPlayer: PlayerIntf;
  }

  interface HostHubDtoIntf {
    tournament: TournamentIntf;
    playerList: PlayerIntf[];
    pairings: MatchDataIntf[];
  }

  export type {PlayerHubDtoIntf, HostHubDtoIntf};