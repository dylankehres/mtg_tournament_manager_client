import React, { Component } from "react";
import { Form, Dropdown, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

type HostTmtProps = {
  serverAddress: string;
};

type HostTmtState = {
  id: string;
  name: string;
  roomCode: string;
  format: string;
};

class HostTmt extends Component<HostTmtProps, HostTmtState> {
  state = {
    id: "",
    name: "",
    roomCode: "",
    format: "Select Format",
  };

  formats = [
    { name: "Standard", id: 1 },
    { name: "Pioneer", id: 2 },
    { name: "Modern", id: 3 },
    { name: "Legacy", id: 4 },
    { name: "Commander", id: 5 },
  ];

  constructor(props: HostTmtProps) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleFormatSelect = this.handleFormatSelect.bind(this);
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
          console.log("id: ", id);
          if (id === "") {
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
            <Form.Label>Tournament Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={this.state.name}
              onChange={this.handleNameChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="m-2" style={{ width: "300px" }}>
            <Form.Label>Room Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Room Code"
              value={this.state.roomCode}
              onChange={this.handleRoomChange}
            ></Form.Control>
          </Form.Group>
          <Dropdown className="m-2" onSelect={this.handleFormatSelect}>
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
            className="btn btn-primary m-2 "
            onClick={() => this.handleOpenTmt()}
            disabled={this.getOpenDisabled()}
            // href={`/host/${this.state.id}`}
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
