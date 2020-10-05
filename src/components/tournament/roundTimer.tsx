import * as React from "react";
import Timer from "react-compound-timer";

export interface RoundTimerProps {
  initialTime: number;
  matchComplete: boolean;
}

const RoundTimer: React.SFC<RoundTimerProps> = (props: RoundTimerProps) => {
  if (props.matchComplete) {
    return (
      <div>
        <h4></h4>
      </div>
    );
  } else if (props.initialTime <= 0) {
    return (
      <div>
        <h4>
          Time has expired! Starting with the active player, there are 5 turns
          remaining.
        </h4>
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
