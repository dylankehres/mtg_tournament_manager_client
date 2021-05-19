import React from "react";
import { RootProps } from "root";
import JoinTmt from "./tournament/player/joinTmt";

const Home: React.FunctionComponent<RootProps> = (props) => {
  return (
    <div className="m-2">
      <h2>Welcome to MTG Tournament Manager!</h2>
      <JoinTmt {...props} />
      {/* <Form>
        <Button className="btn btn-primary m-2" href="/tournament">
          Tournaments
        </Button>
      </Form> */}
    </div>
  );
};

export default Home;
