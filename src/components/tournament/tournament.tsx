import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Player } from "../dtos/player";

type TournamentProps = {
  serverAddress: string;
};

type TournamentState = {
  path: string;
  playerList: Player[];
};

class Tournament extends Component<TournamentProps, TournamentState> {
  state = {
    path: "",
    playerList: [],
  };

  // constructor() {
  //   super(this.props);
  //   this.state.path = "/join";
  // }

  render() {
    return (
      <React.Fragment>
        <Form>
          <Button className="btn btn-primary m-2" href="/join">
            Join Tournament
          </Button>
          <Button className="btn btn-primary m-2" href="/host">
            Host Tournament
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default Tournament;
