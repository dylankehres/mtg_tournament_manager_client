import React, { useState, useEffect } from "react";
import { PlayerInfo, PlayerInfoIntf } from "../../dtos/playerInfo";
import { MatchData } from "../../dtos/matchData";
import { Match } from "../../dtos/match";
import { Button, Modal } from "react-bootstrap";
// import "../styles/player.css";
import { Player } from "components/dtos/player";
import LoadingDiv from "components/loadingDiv";

export interface PlayerInfoModalProps {
  player: Player;
  serverAddress: string;
}

const PlayerInfoModal: React.FunctionComponent<PlayerInfoModalProps> = (
  props
) => {
  const [show, setShow]: [boolean, Function] = useState(false);

  const handleClose = () => setShow(false);

  function handleShow() {
    setShow(true);
  }

  return (
    <React.Fragment>
      <div>
        <a href="#" onClick={handleShow}>
          {props.player.getName()}
        </a>
        <span>{" (" + props.player.getPoints() + " pts)"}</span>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Player Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PlayerInfoComponent
            playerID={props.player.getID()}
            serverAddress={props.serverAddress}
            key={`playerInfo_${props.player.getID()}`}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export interface PlayerInfoProps {
  playerID: String;
  serverAddress: String;
}

const PlayerInfoComponent: React.FunctionComponent<PlayerInfoProps> = (
  props
) => {
  const [playerInfo, setPlayerInfo]: [PlayerInfo, Function] = useState(
    new PlayerInfo()
  );

  const getPlayerInfo = (): void => {
    fetch(`${props.serverAddress}/playerInfo/${props.playerID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((playerInfoInit: PlayerInfoIntf) => {
        console.log("setPlayerInfo(new PlayerInfo(playerInfoInit))");
        setPlayerInfo(new PlayerInfo(playerInfoInit));
      })
      .catch((err) =>
        console.log("Fetch Error in getPlayerInfo for playerInfo.jsx", err)
      );
  };

  useEffect(() => {
    console.log("getPlayerInfo()");
    getPlayerInfo();
  }, []);

  if (playerInfo.getPlayer().getID() !== "") {
    return (
      <React.Fragment>
        <div>
          {playerInfo.getPlayer().getName()} (
          {playerInfo.getPlayer().getPoints()} points)
        </div>
        <div>Tournament: {playerInfo.getTournament().getName()}</div>
        <div>Format: {playerInfo.getTournament().getFormat()}</div>
        <div>Deck Name: {playerInfo.getPlayer().getDeckName()}</div>
        <div>Deck List: {playerInfo.getPlayer().getDeckList()}</div>
        <div>Opponents: </div>
        {playerInfo.getMatchDataList().map((matchData: MatchData) => (
          <div>
            {matchData.getOpponentByPlayerID(playerInfo.getPlayer().getID())}
            <MatchRecord
              playerID={playerInfo.getPlayer().getID()}
              match={matchData.getMatch()}
            />
          </div>
        ))}
      </React.Fragment>
    );
  } else {
    return <LoadingDiv />;
  }
};

export interface MatchRecordProps {
  playerID: string;
  match: Match;
}

const MatchRecord: React.FunctionComponent<MatchRecordProps> = (props) => {
  let wins: number = 0;
  let losses: number = 0;
  let draws: number = props.match.getDraws();

  if (props.match.getPlayer1ID() === props.playerID) {
    wins = props.match.getPlayer1Wins();
    losses = props.match.getPlayer2Wins();
  } else if (props.match.getPlayer2ID() === props.playerID) {
    wins = props.match.getPlayer2Wins();
    losses = props.match.getPlayer1Wins();
  }

  let resultText: String = "";
  if (draws >= wins) {
    resultText = "Draw";
  } else if (wins > losses) {
    resultText = "Won";
  } else {
    resultText = "Lost";
  }

  if (draws > 0) {
    return (
      <span>
        {resultText} {wins}-{losses}-{draws}
      </span>
    );
  }

  return (
    <span>
      {resultText} {wins}-{losses}
    </span>
  );
};

export { PlayerInfoModal };
