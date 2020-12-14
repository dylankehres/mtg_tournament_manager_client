import React, { useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import TmtList from "../tmtList";

type JoinTmtProps = {
  serverAddress: string;
  match: {
    params: {
      code: string;
    };
  };
};

// type JoinTmtState = {
//   id: string;
//   name: string;
//   roomCode: string;
//   deckName: string;
//   deckList: string;
// };

const JoinTmt: React.FunctionComponent<JoinTmtProps> = (props) => {
  const [id, setID]: [string, Function] = useState("");
  const [name, setName]: [string, Function] = useState("");
  const [roomCode, setRoomCode]: [string, Function] = useState("");
  const [deckName, setDeckName]: [string, Function] = useState("");
  const [deckList, setDeckList]: [string, Function] = useState("");
  // const [state, setState]: [JoinTmtState, Function] = useState({
  //   id: "",
  //   name: "",
  //   roomCode: "",
  //   deckList: "",
  //   deckName: "",
  // });

  // constructor(props: JoinTmtProps) {
  //   super(props);

  //   this.handleNameChange = this.handleNameChange.bind(this);
  //   this.handleRoomChange = this.handleRoomChange.bind(this);
  //   this.handleFormatSelect = this.handleFormatSelect.bind(this);
  //   this.handleDeckNameChange = this.handleDeckNameChange.bind(this);
  // }

  const handleNameChange = (event: any): void => {
    setName(event.target.value);
  };

  const handleRoomChange = (event: any): void => {
    setRoomCode(event.target.value);
  };

  // const handleFormatSelect = (eventKey: any): void => {
  //   state.deckList = eventKey;
  //   setState(state);
  // }

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

  if (id === "") {
    return (
      <React.Fragment>
        <Table>
          <tbody>
            <tr>
              <td>
                <Form>
                  <Form.Group className="m-2" style={{ width: "300px" }}>
                    <Form.Label>Player Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Player name"
                      value={name}
                      onChange={handleNameChange}
                    ></Form.Control>
                    <Form.Label>Room Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Room code"
                      value={roomCode}
                      onChange={handleRoomChange}
                    ></Form.Control>
                    <Form.Label>Deck Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Deck name"
                      value={deckName}
                      onChange={handleDeckNameChange}
                    ></Form.Control>
                    <Form.Label>Deck List</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={30}
                      placeholder={
                        "4 Devoted Druid \n4 Vizier of Remedies \n1 Walking Ballista"
                      }
                      value={deckList}
                      onChange={handleDeckListChange}
                    ></Form.Control>
                  </Form.Group>
                  {/* <Dropdown
                    className="m-2"
                    onSelect={this.handleFormatSelect}
                  >
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {this.state.deckList}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {Object.keys(Formats).map((format) => (
                        <Dropdown.Item
                          key={Formats[format]}
                          // value={format.name}
                          eventKey={Formats[format]}
                        >
                          {Formats[format]}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown> */}
                  <Button
                    className="btn btn-primary m-2"
                    disabled={getJoinDisabled()}
                    onClick={() => handleJoinTmt()}
                  >
                    Join Tournament
                  </Button>
                </Form>
              </td>
              <td>
                <TmtList serverAddress={props.serverAddress} />
              </td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }

  console.log("Join tmt redirect");
  return <Redirect to={`/player/${id}`} />;
};

export default JoinTmt;
