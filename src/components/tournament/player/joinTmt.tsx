import { Tournament, TournamentIntf } from "components/dtos/tournament";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import TmtList from "../tmtList";
import TournamentInfo from "../tournamentInfo";
import "../../styles/player.css";
import { RootProps } from "root";

interface JoinTmtRouterParams {
  roomCode: string;
}

const JoinTmt: React.FunctionComponent<RootProps> = (props) => {
  const routerParams = useParams<JoinTmtRouterParams>();
  const [id, setID]: [string, Function] = useState("");
  const [name, setName]: [string, Function] = useState("");
  const [roomCode, setRoomCode]: [string, Function] = useState("");
  const [deckName, setDeckName]: [string, Function] = useState("");
  const [deckList, setDeckList]: [string, Function] = useState("");
  const [tournament, setTournament]: [Tournament, Function] = useState(
    new Tournament()
  );

  const handleNameChange = (event: any): void => {
    setName(event.target.value);
  };

  const handleRoomChange = (event: any): void => {
    setRoomCode(event.target.value);
  };

  const handleDeckNameChange = (event: any): void => {
    setDeckName(event.target.value);
  };

  const handleDeckListChange = (event: any): void => {
    setDeckList(event.target.value);
  };

  const handleJoinTmt = (): void => {
    if (formIsValid()) {
      fetch(`${props.serverAddress}/join`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, roomCode, deckList, deckName }),
      })
        .then((res) => {
          return res.text();
        })
        .then((id: string) => {
          if (id === "") {
            alert("Invalid room code");
          } else {
            setID(id);
          }
        })
        .catch((err) => console.log("Fetch Error in handleJoinTmt", err));
    }
  };

  const handleFindTmt = (roomCode: string): void => {
    if (roomCode !== "") {
      fetch(`${props.serverAddress}/tournament/${roomCode}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((tournamentInit: TournamentIntf) => {
          if (tournamentInit == null) {
            alert("Tournament not found");
            setRoomCode("");
          } else {
            setTournament(new Tournament(tournamentInit));
          }
        })
        .catch((err) => console.log("Fetch Error in handleJoinTmt", err));
    }
  };

  const handleTmtListBtnClick = (tmt: Tournament): void => {
    setRoomCode(tmt.getRoomCode());
    handleFindTmt(tmt.getRoomCode());
  };

  const getJoinDisabled = (): boolean => {
    if (formIsValid()) {
      return false;
    } else {
      return true;
    }
  };

  const formIsValid = (): boolean => {
    if (name !== "" && roomCode !== "" && deckList !== "" && deckName !== "") {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (
      routerParams.roomCode &&
      routerParams.roomCode !== "" &&
      roomCode !== routerParams.roomCode
    ) {
      setRoomCode(routerParams.roomCode);
      handleFindTmt(routerParams.roomCode);
    }
  }, []);

  if (id === "") {
    if (tournament.getID() === "") {
      return (
        <div className="joinTmtGrid">
          <div>
            <Form>
              <Form.Group className="m-2" style={{ width: "300px" }}>
                <Form.Label className="joinForm">Room Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Room code"
                  className="joinForm"
                  value={roomCode}
                  onChange={handleRoomChange}
                ></Form.Control>
              </Form.Group>
              <Button
                className="btn btn-primary m-2"
                disabled={roomCode === ""}
                // onClick={() => handleFindTmt()}
                href={"/join/" + roomCode}
              >
                Find Tournament
              </Button>
            </Form>
          </div>
          <div>
            <TmtList
              serverAddress={props.serverAddress}
              tmtBtnClick={handleTmtListBtnClick}
              tmtBtnName="Join"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="joinTmtGrid">
          <div>
            <Form>
              <Form.Group className="m-2" style={{ width: "300px" }}>
                <Form.Label className="joinForm">Player Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Player name"
                  className="joinForm"
                  value={name}
                  onChange={handleNameChange}
                ></Form.Control>
                {/* <Form.Label>Room Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Room code"
                        value={roomCode}
                        onChange={handleRoomChange}
                      ></Form.Control> */}
                <Form.Label className="joinForm">Deck Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Deck name"
                  className="joinForm"
                  value={deckName}
                  onChange={handleDeckNameChange}
                ></Form.Control>
                <Form.Label className="joinForm">Deck List</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={15}
                  className="joinForm"
                  placeholder={
                    "4 Devoted Druid \n4 Vizier of Remedies \n1 Walking Ballista"
                  }
                  value={deckList}
                  onChange={handleDeckListChange}
                ></Form.Control>
              </Form.Group>
              <Button
                className="btn btn-primary m-2"
                disabled={getJoinDisabled()}
                onClick={() => handleJoinTmt()}
              >
                Join Tournament
              </Button>
            </Form>

            {/* <td>
                  <TmtList serverAddress={props.serverAddress} />
                </td> */}
          </div>
          <div>
            <TournamentInfo
              tournament={tournament}
              serverAddress={props.serverAddress}
            />
          </div>
        </div>
      );
    }
  }

  return <Redirect to={`/player/${id}`} />;
};

export default JoinTmt;
