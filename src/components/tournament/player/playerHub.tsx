import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Pairings from "../pairings";
import PlayerList from "../playerList";
import PlayerMatch from "./playerMatch";
import Round from "./round";
import FinalResults from "../finalResults";
import { Player } from "../../dtos/player";
import { MatchData, MatchDataIntf } from "../../dtos/matchData";
import { Tournament, TournamentStatus } from "components/dtos/tournament";
import { MatchStatus } from "components/dtos/match";
import { PlayerHubDtoIntf } from "components/dtos/hubDtos";
import LoadingDiv from "components/loadingDiv";
import { useParams } from "react-router-dom";
import { RootProps } from "root";

// type PlayerHubProps = {
//   serverAddress: string;
//   match: {
//     params: {
//       playerID: string;
//     };
//   };
// };

// type PlayerHubState = {
//   tournament: Tournament;
//   playerList: Player[];
//   pairings: MatchData[];
//   matchData: MatchData;
//   currPlayer: Player;
//   loading: boolean;
// };

interface PlayerHubRouterParams {
  playerID: string;
}

const PlayerHub: React.FunctionComponent<RootProps> = (props) => {
  const routerParams = useParams<PlayerHubRouterParams>();
  const [tournament, setTournament]: [Tournament, Function] = useState(
    new Tournament()
  );
  const [playerList, setPlayerList]: [Array<Player>, Function] = useState(
    new Array<Player>()
  );
  const [pairings, setPairings]: [Array<MatchData>, Function] = useState(
    new Array<MatchData>()
  );
  const [matchData, setMatchData]: [MatchData, Function] = useState(
    new MatchData()
  );
  const [currPlayer, setCurrPlayer]: [Player, Function] = useState(
    new Player()
  );
  const [loading, setLoading]: [boolean, Function] = useState(false);

  // constructor(props: PlayerHubProps) {
  //   super(props);

  //   this.buildStateFromPlayerHubDto = this.buildStateFromPlayerHubDto.bind(
  //     this
  //   );
  // }

  const handleLeaveTmt = () => {
    fetch(`${props.serverAddress}/join`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: routerParams.playerID,
    })
      .then((res) => res.json())
      .then(() => {})
      .catch((err) => console.log("Fetch Error in handleLeaveTmt", err));
  };

  const readyUp = () => {
    fetch(
      `${props.serverAddress}/match/ready/${currPlayer.getID()}/${matchData
        .getMatch()
        .getRoundNum()}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((matchDataInit: MatchDataIntf) => {
        setMatchData(new MatchData(matchDataInit));
      })
      .catch((err) =>
        console.log("Fetch Error in readyUp for playerWaiting.jsx", err)
      );
  };

  const buildStateFromPlayerHubDto = (
    playerHubInit: PlayerHubDtoIntf
  ): void => {
    const newPlayerList = new Array<Player>();
    if (playerHubInit?.playerList?.length > 0) {
      for (let playerInit of playerHubInit.playerList) {
        newPlayerList.push(new Player(playerInit));
      }
    }

    const newPairings = new Array<MatchData>();
    if (playerHubInit?.pairings?.length) {
      for (let matchInit of playerHubInit.pairings) {
        newPairings.push(new MatchData(matchInit));
      }
    }

    setTournament(new Tournament(playerHubInit.tournament));
    setPlayerList(newPlayerList);
    setPairings(newPairings);
    setMatchData(new MatchData(playerHubInit.matchData));
    setCurrPlayer(new Player(playerHubInit.currPlayer));
  };

  buildStateFromPlayerHubDto.bind(this);

  const getPlayerHubData = (): void => {
    setLoading(true);
    fetch(`${props.serverAddress}/playerHub/${routerParams.playerID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((playerHubInit: PlayerHubDtoIntf) => {
        buildStateFromPlayerHubDto(playerHubInit);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error occurred in getPlayerHubData()", err);
        setLoading(false);
      });
  };

  useEffect(() => getPlayerHubData(), []);

  // render() {
  if (
    // Waiting for player to ready up
    tournament.getTournamentStatus() === TournamentStatus.InProgress &&
    matchData.getMatch().getMatchStatus() === MatchStatus.AwaitingPlayers &&
    !matchData.getMatch().getPlayerReadyByID(currPlayer.getID())
  ) {
    return (
      <React.Fragment>
        <PlayerMatch
          currPlayer={currPlayer}
          matchData={matchData}
          serverAddress={props.serverAddress}
        />
        <Pairings pairings={pairings} serverAddress={props.serverAddress} />
        <Button className="btn btn-success m-2" onClick={() => readyUp()}>
          Ready
        </Button>
      </React.Fragment>
    );
  } else if (
    // Player is ready
    matchData.getMatch().getMatchStatus() !== MatchStatus.Complete &&
    matchData.getMatch().getPlayerReadyByID(currPlayer.getID())
  ) {
    const roundProps = {
      serverAddress: props.serverAddress,
      playerID: routerParams.playerID,
      matchData: matchData,
      updatePlayerHub: buildStateFromPlayerHubDto,
      key: `round_${matchData.getMatch().getRoundNum()}`,
    };
    return <Round {...roundProps} />;
  } else if (matchData.getMatch().getMatchStatus() === MatchStatus.Complete) {
    if (tournament.getTournamentStatus() === TournamentStatus.Complete) {
      return (
        <FinalResults
          tournament={tournament}
          playerList={playerList}
          serverAddress={props.serverAddress}
        />
      );
    } else {
      return (
        <React.Fragment>
          <Pairings pairings={pairings} serverAddress={props.serverAddress} />
          <h4>Waiting for next round to start...</h4>
        </React.Fragment>
      );
    }
  } else if (currPlayer.getRoomCode() !== "") {
    return (
      <div className="m-2">
        <PlayerList
          serverAddress={props.serverAddress}
          playerList={playerList}
          key={"playerList_" + tournament.getRoomCode()}
        />
        <Form>
          <Button
            className="btn btn-danger m-2"
            href="/join"
            onClick={() => handleLeaveTmt()}
          >
            Leave Tournament
          </Button>
        </Form>
      </div>
    );
  } else {
    return <LoadingDiv loading={loading} />;
  }
  // }
};

export default PlayerHub;
