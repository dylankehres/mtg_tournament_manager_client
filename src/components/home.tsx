import React from "react";
import { Form, Button } from "react-bootstrap";

const Home = () => {
  return (
    <div className="m-2">
      <h2>Welcome to MTG Tournament Manager!</h2>
      <Form>
        <Button className="btn btn-primary m-2" href="/tournament">
          Tournaments
        </Button>
      </Form>
    </div>
  );
};

export default Home;
