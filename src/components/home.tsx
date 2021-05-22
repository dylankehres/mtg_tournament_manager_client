import React from "react";
import { RootProps } from "root";
import JoinTmt from "./tournament/player/joinTmt";
import "./styles/home.css";

const Home: React.FunctionComponent<RootProps> = (props) => {
  return (
    <div className="m-2">
      <h2>Welcome to MTG Tournament Manager!</h2>
      <h4>A place where friends can organize Magic tourmanets with ease</h4>
      <div className="joinTmt">
        <JoinTmt {...props} />
      </div>
    </div>
  );
};

export default Home;
