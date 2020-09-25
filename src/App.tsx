import React from "react";
import "./App.css";
import Root from "./root";
import NavBar from "./components/navbar";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <main className="container">
        <Root serverAddress="http://localhost:8080/api/v1/tournament" />
      </main>
    </React.Fragment>
  );
}

export default App;
