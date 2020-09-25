import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/home";
import Tournament from "./components/tournament/tournament";
import JoinTmt from "./components/tournament/player/joinTmt";
import PlayerWaiting from "./components/tournament/player/playerWaiting";
import PlayerList from "./components/tournament/playerList";
import HostTmt from "./components/tournament/host/hostTmt";
import StartTmt from "./components/tournament/host/startTmt";
import Round from "./components/tournament/player/round";

type RootProps = {
  serverAddress: string;
};

type RootState = {
  serverAddress: string;
};

class Root extends Component<RootProps, RootState> {
  state = { serverAddress: "http://localhost:8080/api/v1/tournament" };

  render() {
    const renderMergedProps = (component: any, ...rest: any[]) => {
      const finalProps = Object.assign({}, ...rest);
      finalProps.serverAddress = "http://localhost:8080/api/v1/tournament";
      return React.createElement(component, finalProps);
    };

    const PropsRoute = ({ component, ...rest }: any) => {
      return (
        <Route
          {...rest}
          render={(routeProps: any) => {
            return renderMergedProps(component, routeProps, rest);
          }}
        />
      );
    };

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <PropsRoute exact path="/join" component={JoinTmt} />
          <PropsRoute exact path="/tournament" component={Tournament} />
          <PropsRoute path="/join/:playerID" component={PlayerWaiting} />
          <PropsRoute exact path="/host" component={HostTmt} />
          <PropsRoute exact path="/host/:tmtID" component={StartTmt} />
          <PropsRoute path="/playerlist" component={PlayerList} />
          <PropsRoute exact path="/round/:playerID" component={Round} />
        </Switch>
      </Router>
    );
  }
}

export default Root;
