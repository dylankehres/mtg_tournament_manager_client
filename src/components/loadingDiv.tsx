import React from "react";
import { Spinner } from "react-bootstrap";
import "./styles/util/loadingDiv.css";

interface LoadingDivProps {
  loading: boolean;
  errorText?: string;
}

const LoadingDiv: React.FunctionComponent<LoadingDivProps> = (props) => {
  if (props.loading) {
    return (
      <div className="loadingDiv">
        <Spinner animation="border" />
      </div>
    );
  }

  console.log("errorText: ", props.errorText);
  let errorText =
    props.errorText && props.errorText !== ""
      ? props.errorText
      : "Uh oh! Something went wrong. Please try that again.";

  return (
    <div className="errorText">
      <h3>{errorText}</h3>
    </div>
  );
};

export default LoadingDiv;
