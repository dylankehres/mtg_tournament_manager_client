import React from "react";
import { Spinner } from "react-bootstrap";
import "./styles/util/loadingDiv.css";

const LoadingDiv = () => {
  // return <h2>Loading...</h2>;
  return (
    <div className="loadingDiv">
      <Spinner animation="border" />
    </div>
  );
};

export default LoadingDiv;
