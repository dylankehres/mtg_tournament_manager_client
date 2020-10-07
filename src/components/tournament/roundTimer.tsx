import * as React from "react";
import Timer from "react-compound-timer";

export interface RoundTimerProps {
  initialTime: number;
  playersReady: boolean;
  matchComplete: boolean;
}

const RoundTimer: React.SFC<RoundTimerProps> = (props: RoundTimerProps) => {
  if (props.matchComplete) {
    return <div></div>;
  } else if (!props.playersReady) {
    return (
      <div>
        <h4>Waiting for both players to be ready...</h4>
      </div>
    );
  } else if (props.initialTime <= 0) {
    return (
      <div>
        <h4>Time has expired!</h4>
        <div>Starting with the active player, there are 5 turns remaining.</div>
      </div>
    );
  } else {
    return (
      <Timer initialTime={props.initialTime} direction="backward">
        {() => (
          <React.Fragment>
            <Timer.Minutes /> {"minutes "}
            <Timer.Seconds /> {"seconds"}
          </React.Fragment>
        )}
      </Timer>
    );
  }
};

export default RoundTimer;
