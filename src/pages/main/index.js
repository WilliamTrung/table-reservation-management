import React from "react";
import CheckinReservation from "./check-in";
import CheckoutReservation from "./check-out";
import AssignTableToReservation from "./pending-reservation";
import { Col, Container, Row } from "react-bootstrap";
import withAuthentication from "../../helper/Authentication";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Container>
        <Row>
          <Col>
            <AssignTableToReservation />
          </Col>
          <Col>
              <Row>
                <CheckinReservation />
              </Row>
              <hr/>
              <Row>
                <CheckoutReservation />
              </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withAuthentication(Dashboard);
