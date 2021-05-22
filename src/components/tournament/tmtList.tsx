import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import {
  Tournament,
  TournamentIntf,
  TournamentStatus,
} from "../dtos/tournament";

type TmtListProps = {
  serverAddress: string;
  tmtStatus: TournamentStatus;
  tmtBtnClick: Function;
  tmtBtnName: string;
};

type TmtListState = {
  tmtList: Tournament[];
};

class TmtList extends Component<TmtListProps, TmtListState> {
  state = {
    tmtList: [],
  };

  getTournamentList(status: number): void {
    fetch(`${this.props.serverAddress}/tournaments/status/${status}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((initTmtList: TournamentIntf[]) => {
        const tmtList: Tournament[] = [];
        initTmtList.forEach((initTmt) => tmtList.push(new Tournament(initTmt)));
        this.setState({ tmtList });
      })
      .catch((err) =>
        console.log("Ajax Error in getTournamentList for tmtList.jsx", err)
      );
  }

  componentDidMount() {
    this.getTournamentList(this.props.tmtStatus);
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.tmtList.map((tmt: Tournament) => (
                <tr key={tmt.getID()}>
                  <td>{tmt.getName()}</td>
                  <td>{tmt.getFormat()}</td>
                  <td>{tmt.getRoomCode()}</td>
                  <td>
                    <Button
                      className="btn btn-primary"
                      size="sm"
                      onClick={() => this.props.tmtBtnClick(tmt)}
                    >
                      {this.props.tmtBtnName}
                    </Button>
                  </td>
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
