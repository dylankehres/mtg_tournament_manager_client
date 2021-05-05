import React, { useState } from "react";
import { PlayerInfo, PlayerInfoIntf } from "../../dtos/playerInfo";
import { MatchData } from "../../dtos/matchData";
import { Match } from "../../dtos/match";
import { Button, Modal } from "react-bootstrap";
import "../styles/player.css";

export interface PlayerInfoModalProps {
  serverAddress: string;
}

const PlayerInfoModal: React.FunctionComponent<PlayerInfoModalProps> = (
  props
) => {
  const [playerID, setPlayerID] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  function handleShow(playerID: string) {
    setPlayerID(playerID);
    setShow(true);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Player Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {PlayerInfoComponent({
          playerID: playerID,
          serverAddress: props.serverAddress,
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export interface PlayerInfoProps {
  // player: Player;
  // matches: MatchData[];
  // tournament: Tournament;
  playerID: String;
  serverAddress: String;
}

const PlayerInfoComponent: React.FunctionComponent<PlayerInfoProps> = (
  props
) => {
  let playerInfo: PlayerInfo = new PlayerInfo();
  fetch(`${props.serverAddress}/playerInfo/${props.playerID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((playerInfoInit: PlayerInfoIntf) => {
      playerInfo = new PlayerInfo(playerInfoInit);
    })
    .catch((err) =>
      console.log("Fetch Error in getPlayerInfo for playerInfo.jsx", err)
    );

  return (
    <React.Fragment>
      <span>
        {playerInfo.getPlayer().getName()} ({playerInfo.getPlayer().getPoints()}{" "}
        points)
      </span>
      <span>Tournament: {playerInfo.getTournament().getName()}</span>
      <span>Format: {playerInfo.getTournament().getFormat()}</span>
      <span>Deck: {playerInfo.getPlayer().getDeckName()}</span>
      <span>Opponents:</span>
      {playerInfo.getMatchDataList().map((matchData: MatchData) => {
        <div>
          <span>
            {matchData.getOpponentByPlayerID(playerInfo.getPlayer().getID())}
          </span>
          <span>
            {MatchRecord({
              playerID: playerInfo.getPlayer().getID(),
              match: matchData.getMatch(),
            })}
          </span>
        </div>;
      })}
    </React.Fragment>
  );
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

export { PlayerInfo, PlayerInfoModal };
