import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import PlayerList from "../playerList";
import Pairings from "../pairings";
import FinalResults from "../finalResults";
import { MatchData } from "../../dtos/matchData";
import { Tournament, TournamentStatus } from "../../dtos/tournament";
import { MatchStatus } from "components/dtos/match";
import { Player } from "../../dtos/player";
import { HostHubDtoIntf } from "components/dtos/hubDtos";
import LoadingDiv from "components/loadingDiv";
import { useParams } from "react-router";
import { RootProps } from "root";

interface HostHubRouterParams {
  tmtID: string;
}

// class HostHub extends Component<HostHubProps, HostHubState> {
const HostHub: React.FunctionComponent<RootProps> = (props) => {
  const routerParams = useParams<HostHubRouterParams>();
  const [tournament, setTournament]: [Tournament, Function] = useState(
    new Tournament()
  );
  const [pairings, setPairings]: [Array<MatchData>, Function] = useState(
    new Array<MatchData>()
  );
  const [playerList, setPlayerList]: [Array<Player>, Function] = useState(
    new Array<Player>()
  );
  const [loading, setLoading]: [boolean, Function] = useState(false);

  const handleCancelTmt = () => {
    fetch(`${props.serverAddress}/host`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: routerParams.tmtID,
    })
      .then((res) => res.json())
      .then(() => {})
      .catch((err) => console.log("Fetch Error in handleCancelTmt", err));
  };

  const generatePairings = () => {
    setLoading(true);
    fetch(`${props.serverAddress}/host/pairings/${routerParams.tmtID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((hostHubInit: HostHubDtoIntf) => {
        buildStateFromHostHubDTO(hostHubInit);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch Error in generatePairings", err);
        setLoading(false);
      });
  };

  const buildStateFromHostHubDTO = (hostHubInit: HostHubDtoIntf): void => {
    const playerList = new Array<Player>();
    for (let playerInit of hostHubInit.playerList) {
      playerList.push(new Player(playerInit));
    }

    const pairings = new Array<MatchData>();
    for (let matchInit of hostHubInit.pairings) {
      pairings.push(new MatchData(matchInit));
    }

    setTournament(new Tournament(hostHubInit.tournament));
    setPlayerList(playerList);
    setPairings(pairings);
  };

  const getHostHubData = (): void => {
    setLoading(true);
    fetch(`${props.serverAddress}/hostHub/${routerParams.tmtID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((hostHubInit: HostHubDtoIntf) => {
        console.log("hostHubInit: ", hostHubInit);
        buildStateFromHostHubDTO(hostHubInit);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error occured in getHostHubData", err);
        setLoading(false);
      });
  };

  const roundInProgress = (): boolean => {
    for (let matchData of pairings) {
      if (matchData.getMatch().getMatchStatus() !== MatchStatus.Complete) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => getHostHubData(), []);

  // render() {
  if (tournament.getRoomCode() === "") {
    return <LoadingDiv loading={loading} />;
  } else if (tournament.getTournamentStatus() === TournamentStatus.Complete) {
    return (
      <React.Fragment>
        <FinalResults
          tournament={tournament}
          playerList={playerList}
          serverAddress={props.serverAddress}
        />
        <Button
          className="btn btn-danger m-2"
          onClick={() => handleCancelTmt()}
          href="/host"
        >
          End Tournament
        </Button>
      </React.Fragment>
    );
  } else if (tournament.getTournamentStatus() === TournamentStatus.InProgress) {
    return (
      <div className="m-2">
        <Pairings
          pairings={pairings}
          serverAddress={props.serverAddress}
          key={"pairings_" + tournament.getRoomCode()}
        />
        <Form>
          <Button
            className="btn btn-primary m-2"
            disabled={roundInProgress()}
            onClick={() => generatePairings()}
          >
            Start Next Round
          </Button>
          <Button
            className="btn btn-danger m-2"
            onClick={() => handleCancelTmt()}
            href="/host"
          >
            Cancel Tournament
          </Button>
        </Form>
      </div>
    );
  } else {
    return (
      <div className="m-2">
        <PlayerList
          serverAddress={props.serverAddress}
          playerList={playerList}
          key={"playerList_" + tournament.getRoomCode()}
        />
        <Form>
          <Button
            className="btn btn-primary m-2"
            onClick={() => generatePairings()}
          >
            Start Tournament
          </Button>
          <Button
            className="btn btn-danger m-2"
            onClick={() => handleCancelTmt()}
            href="/host"
          >
            Cancel Tournament
          </Button>
        </Form>
      </div>
    );
  }
  // }
};

export default HostHub;
