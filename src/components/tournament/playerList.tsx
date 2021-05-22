import React from "react";
import { Table } from "react-bootstrap";
import { Player } from "../dtos/player";
import { PlayerInfoModal } from "../tournament/player/playerInfo";
import "../styles/player/playerList.css";

export interface PlayerListProps {
  serverAddress: string;
  playerList: Player[];
}

const PlayerList: React.SFC<PlayerListProps> = (props) => {
  if (props.playerList.length > 0) {
    return (
      <React.Fragment>
        <div className="m-2" style={{ width: "300px" }}>
          <Table hover size="sm">
            <thead className="playerList">
              <tr>
                <th>#</th>
                <th>Player Name</th>
                <th>Deck Name</th>
              </tr>
            </thead>
            <tbody className="playerList">
              {props.playerList.map((player: Player, index) => (
                <tr key={player.getID()}>
                  <td>{index + 1}</td>
                  <td>
                    <PlayerInfoModal
                      player={player}
                      serverAddress={props.serverAddress}
                      key={`playerInfoModal_${player.getID()}`}
                    />
                  </td>
                  <td>{player.getDeckName()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div className="m-2" style={{ width: "300px" }}>
        <div className="m-2 playerList">
          <h4>This event is empty</h4>
        </div>
      </div>
    );
  }
};

export default PlayerList;

// type PlayerListProps = {
//   serverAddress: string;
//   roomCode: string;
// };

// type PlayerListState = {
//   playerList: Player[];
// };

// class PlayerList extends Component<PlayerListProps, PlayerListState> {
//   state = {
//     playerList: [],
//   };

//   componentDidMount() {
//     this.getPlayerList();
//   }

//   getPlayerList() {
//     fetch(`${this.props.serverAddress}/playerList/${this.props.roomCode}`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => res.json())
//       .then((initPlayerfList: PlayerIntf[]) => {
//         if (initPlayerfList.length > 0) {
//           const playerList: Player[] = [];
//           initPlayerfList.forEach((initPlayer) =>
//             playerList.push(new Player(initPlayer))
//           );
//           this.setState({ playerList });
//         }
//       });
//   }

//   render() {
//     if (this.state.playerList.length > 0) {
//       return (
//         <div className="m-2" style={{ width: "300px" }}>
//           <Table striped bordered hover size="sm">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Player Name</th>
//                 <th>Deck Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {this.state.playerList.map((player: Player, index) => (
//                 <tr key={player.getID()}>
//                   <td>{index + 1}</td>
//                   <td>
//                     {player.getName() + " (" + player.getPoints() + " pts)"}
//                   </td>
//                   <td>{player.getDeckName()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       );
//     } else {
//       return (
//         <div className="m-2" style={{ width: "300px" }}>
//           <div className="m-2">
//             <h4>This event is empty</h4>
//           </div>
//         </div>
//       );
//     }
//   }
// }

// export default PlayerList;
