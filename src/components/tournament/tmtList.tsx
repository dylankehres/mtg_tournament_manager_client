import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Tournament } from "../dtos/tournament";

type TmtListProps = {
  serverAddress: string;
};

type TmtListState = {
  tmtList: Tournament[];
};

class TmtList extends Component<TmtListProps, TmtListState> {
  state = {
    tmtList: [],
  };

  componentDidMount() {
    fetch(`${this.props.serverAddress}/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((tmtList: Tournament[]) => {
        this.setState({ tmtList });
      })
      .catch((err) =>
        console.log("Ajax Error in componentDidMount for tmtList.jsx", err)
      );
  }

  render() {
    if (this.state.tmtList.length > 0) {
      return (
        <div style={{ width: "450px" }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Tournament Name</th>
                <th>Format</th>
                <th>Room Code</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tmtList.map((tmt: Tournament) => (
                <tr key={tmt.id}>
                  <td>{tmt.name}</td>
                  <td>{tmt.format}</td>
                  <td>{tmt.roomCode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    } else {
      return (
        <div style={{ width: "450px" }}>
          <h2>No tournaments available</h2>
        </div>
      );
    }
  }
}

export default TmtList;
