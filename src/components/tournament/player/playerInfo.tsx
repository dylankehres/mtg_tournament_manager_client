import React, { useState } from "react";
import { PlayerInfo, PlayerInfoIntf } from "../../dtos/playerInfo";
import { MatchData } from "../../dtos/matchData";
import { Match } from "../../dtos/match";
import { Button, Modal } from "react-bootstrap";
import "../../styles/player/playerInfo.css";
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
      <div className="playerNameDiv">
        <span className="playerName" onClick={handleShow}>
          {props.player.getName()}
        </span>
        <span>{" (" + props.player.getPoints() + " pts)"}</span>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{props.player.getName()}</Modal.Title>
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
  serverAddress: string;
}

const PlayerInfoComponent: React.FunctionComponent<PlayerInfoProps> = (
  props
) => {
  if (props.playerInfo.getPlayer().getID() !== "") {
    return (
      <div className="playerInfoComponentGrid">
        <div className="playerInfoLabel">Name:</div>
        <div>
          {props.playerInfo.getPlayer().getName()} (
          {props.playerInfo.getPlayer().getPoints()} points)
        </div>
        <div className="playerInfoLabel">Tournament: </div>
        <div>{props.playerInfo.getTournament().getName()}</div>
        <div className="playerInfoLabel">Format: </div>
        <div>{props.playerInfo.getTournament().getFormat()}</div>
        <div className="playerInfoLabel">Deck Name: </div>
        <div>{props.playerInfo.getPlayer().getDeckName()}</div>
        <div className="playerInfoLabel">Deck List: </div>
        <div className="deckList">
          {props.playerInfo.getPlayer().getDeckList()}
        </div>
        <div className="playerInfoLabel">Opponents: </div>
        <div>
          {props.playerInfo
            .getMatchDataList()
            .map((matchData: MatchData, index) => (
              <div className="opponentList" key={index}>
                <div>
                  <PlayerInfoModal
                    serverAddress={props.serverAddress}
                    player={matchData.getOpponentByPlayerID(
                      props.playerInfo.getPlayer().getID()
                    )}
                  />
                </div>
                <div>
                  <MatchRecord
                    playerID={props.playerInfo.getPlayer().getID()}
                    match={matchData.getMatch()}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
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

  let resultText: string = "";
  if (draws >= wins && draws >= losses) {
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

  return <React.Fragment>{`${resultText} ${wins}-${losses}`}</React.Fragment>;
};

export { PlayerInfoModal };
