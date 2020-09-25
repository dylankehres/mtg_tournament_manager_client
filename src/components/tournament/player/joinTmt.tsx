import React, { Component } from "react";
import { Form, Dropdown, Button, Table } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import TmtList from "../tmtList";

type JoinTmtProps = {
  serverAddress: string;
};

type JoinTmtState = {
  id: string;
  name: string;
  roomCode: string;
  format: string;
  deckName: string;
};

class JoinTmt extends Component<JoinTmtProps, JoinTmtState> {
  state = {
    id: "",
    name: "",
    roomCode: "",
    format: "Select Format",
    deckName: "",
  };

  formats = [
    { name: "Standard", id: 1 },
    { name: "Pioneer", id: 2 },
    { name: "Modern", id: 3 },
    { name: "Legacy", id: 4 },
    { name: "Commander", id: 5 },
  ];

  constructor(props: JoinTmtProps) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleFormatSelect = this.handleFormatSelect.bind(this);
    this.handleDeckChange = this.handleDeckChange.bind(this);
  }

  handleNameChange(event: any): void {
    this.setState({ name: event.target.value });
  }

  handleRoomChange(event: any): void {
    this.setState({ roomCode: event.target.value });
  }

  handleFormatSelect(eventKey: any): void {
    this.setState({ format: eventKey });
  }

  handleDeckChange(event: any): void {
    this.setState({ deckName: event.target.value });
  }

  handleJoinTmt(): void {
    if (this.formIsValid()) {
      fetch(`${this.props.serverAddress}/join`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state),
      })
        .then((res) => {
          return res.text();
        })
        .then((id: string) => {
          if (id === "") {
            alert("Invalid room code");
          } else {
            this.setState({ id });
          }
        })
        .catch((err) => console.log("Fetch Error in handleJoinTmt", err));
    }
  }

  getJoinDisabled(): boolean {
    if (this.formIsValid()) {
      return false;
    } else {
      return true;
    }
  }

  formIsValid(): boolean {
    if (
      this.state.name !== "" &&
      this.state.roomCode !== "" &&
      this.state.format !== "Select Format" &&
      this.state.deckName !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (this.state.id === "") {
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
                        value={this.state.name}
                        onChange={this.handleNameChange}
                      ></Form.Control>
                      <Form.Label>Room Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Room code"
                        value={this.state.roomCode}
                        onChange={this.handleRoomChange}
                      ></Form.Control>
                      <Form.Label>Deck Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Deck name"
                        value={this.state.deckName}
                        onChange={this.handleDeckChange}
                      ></Form.Control>
                    </Form.Group>
                    <Dropdown
                      className="m-2"
                      onSelect={this.handleFormatSelect}
                    >
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {this.state.format}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {this.formats.map((format) => (
                          <Dropdown.Item
                            key={format.id}
                            // value={format.name}
                            eventKey={format.name}
                          >
                            {format.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button
                      className="btn btn-primary m-2"
                      disabled={this.getJoinDisabled()}
                      onClick={() => this.handleJoinTmt()}
                    >
                      Join Tournament
                    </Button>
                  </Form>
                </td>
                <td>
                  <TmtList serverAddress={this.props.serverAddress} />
                </td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      );
    } else {
      console.log("Join tmt redirect");
      return <Redirect to={`/join/${this.state.id}`} />;
    }
  }
}

export default JoinTmt;
