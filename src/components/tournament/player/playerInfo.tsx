import React, { useState } from "react";
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
  const [playerInfo, setPlayerInfo]: [PlayerInfo, Function] = useState(
    new PlayerInfo()
  );

  const handleClose = () => setShow(false);

  const handleShow = () => {
    getPlayerInfo();
    setShow(true);
  };

  const getPlayerInfo = (): void => {
    fetch(`${props.serverAddress}/playerInfo/${props.player.getID()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((playerInfoInit: PlayerInfoIntf) => {
        setPlayerInfo(new PlayerInfo(playerInfoInit));
      })
      .catch((err) =>
        console.log("Fetch Error in getPlayerInfo for playerInfo.jsx", err)
      );
  };
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
            playerInfo={playerInfo}
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
  playerInfo: PlayerInfo;
  serverAddress: String;
}

const PlayerInfoComponent: React.FunctionComponent<PlayerInfoProps> = (
  props
) => {
  if (props.playerInfo.getPlayer().getID() !== "") {
    return (
      <React.Fragment>
        <div>
          {props.playerInfo.getPlayer().getName()} (
          {props.playerInfo.getPlayer().getPoints()} points)
        </div>
        <div>Tournament: {props.playerInfo.getTournament().getName()}</div>
        <div>Format: {props.playerInfo.getTournament().getFormat()}</div>
        <div>Deck Name: {props.playerInfo.getPlayer().getDeckName()}</div>
        <div>Deck List: {props.playerInfo.getPlayer().getDeckList()}</div>
        <div>Opponents: </div>
        {props.playerInfo
          .getMatchDataList()
          .map((matchData: MatchData, index) => (
            <div key={index}>
              {matchData
                .getOpponentByPlayerID(props.playerInfo.getPlayer().getID())
                .getName()}
              <MatchRecord
                playerID={props.playerInfo.getPlayer().getID()}
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
      <React.Fragment>
        <span>
          {resultText} {wins}-{losses}-{draws}
        </span>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {`${resultText} ${wins}-${losses}`}
      {"Potat"}
    </React.Fragment>
  );
};

export { PlayerInfoModal };
