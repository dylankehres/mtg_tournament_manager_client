import React, { Component } from "react";
import { Form, Dropdown, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { RootProps } from "root";
import { Formats } from "../../dtos/tournament";
import "../../styles/tournament/hostTmt.css";

type HostTmtState = {
  id: string;
  name: string;
  roomCode: string;
  numRounds: string;
  numGames: string;
  format: string;
};

class HostTmt extends Component<RootProps, HostTmtState> {
  state = {
    id: "",
    name: "",
    roomCode: "",
    numRounds: "3",
    numGames: "3",
    format: "Select Format",
  };

  constructor(props: RootProps) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleNumRoundsChange = this.handleNumRoundsChange.bind(this);
    this.handleNumGamesChange = this.handleNumGamesChange.bind(this);
    this.handleFormatSelect = this.handleFormatSelect.bind(this);
  }

  handleNameChange(event: any): void {
    this.setState({ name: event.target.value });
  }

  handleRoomChange(event: any): void {
    this.setState({ roomCode: event.target.value });
  }

  handleNumRoundsChange(event: any): void {
    this.setState({ numRounds: event.target.value });
  }

  handleNumGamesChange(event: any): void {
    this.setState({ numGames: event.target.value });
  }

  handleFormatSelect(eventKey: any): void {
    this.setState({ format: eventKey });
  }

  getOpenDisabled(): boolean {
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
      this.state.format !== "Select Format"
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleOpenTmt(): void {
    console.log("serverAddress", this.props.serverAddress);
    if (this.formIsValid()) {
      const tournament = this.state;
      fetch(`${this.props.serverAddress}/host`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournament),
      })
        .then((res) => {
          return res.text();
        })
        .then((id: string) => {
          if (id === "-1") {
            alert("Room code is not unique. Please try a differnt code.");
          } else {
            this.setState({ id });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  render() {
    if (this.state.id === "") {
      return (
        <Form>
          <Form.Group className="m-2" style={{ width: "300px" }}>
            <Form.Label className="hostForm">Tournament Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={this.state.name}
              onChange={this.handleNameChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="m-2" style={{ width: "300px" }}>
            <Form.Label className="hostForm">Room Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Room Code"
              value={this.state.roomCode}
              onChange={this.handleRoomChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="m-2" style={{ width: "300px" }}>
            <Form.Label className="hostForm">Number of rounds</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter number of rounds"
              value={this.state.numRounds}
              onChange={this.handleNumRoundsChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="m-2" style={{ width: "300px" }}>
            <Form.Label className="hostForm">Games per round</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter number of games"
              value={this.state.numGames}
              onChange={this.handleNumGamesChange}
            ></Form.Control>
          </Form.Group>

          <Dropdown className="m-2" onSelect={this.handleFormatSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {this.state.format}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(Formats).map((format) => (
                <Dropdown.Item key={Formats[format]} eventKey={Formats[format]}>
                  {Formats[format]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className="btn btn-primary m-2 "
            onClick={() => this.handleOpenTmt()}
            disabled={this.getOpenDisabled()}
          >
            Open Tournament
          </Button>
        </Form>
      );
    } else {
      return <Redirect to={`/host/${this.state.id}`} />;
    }
  }
}

export default HostTmt;
