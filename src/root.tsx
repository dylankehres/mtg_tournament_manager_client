import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/home";

import JoinTmt from "./components/tournament/player/joinTmt";
import PlayerHub from "./components/tournament/player/playerHub";
import HostTmt from "./components/tournament/host/hostTmt";
import HostHub from "./components/tournament/host/hostHub";

interface RootProps {
  serverAddress: string;
}

const Root: React.FunctionComponent<RootProps> = () => {
  // const serverAddress = "http://localhost:8080/api/v1/tournament";
  // const serverAddress = "http://192.168.1.108:8080/api/v1/tournament";
  const serverAddress =
    "https://tournament-manager-server-56ogjznjja-uc.a.run.app/api/v1/tournament";

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Home serverAddress={serverAddress} />}
        />
        <Route
          exact
          path="/join/"
          render={() => <JoinTmt serverAddress={serverAddress} />}
        />
        <Route
          exact
          path="/join/:roomCode"
          render={() => <JoinTmt serverAddress={serverAddress} />}
        />
        <Route
          exact
          path="/player/:playerID"
          render={() => <PlayerHub serverAddress={serverAddress} />}
        />
        <Route
          exact
          path="/host"
          render={() => <HostTmt serverAddress={serverAddress} />}
        />
        <Route
          exact
          path="/host/:tmtID"
          render={() => <HostHub serverAddress={serverAddress} />}
        />
      </Switch>
    </Router>
  );
};

export default Root;
export type { RootProps };
