import { ToastContainer } from "react-toastify";
import BookingComponent from "./booking";
import AnonymousReservationComponent from "./anonymous-list";
import CheckinReservation from "./checkin";
import CheckoutReservation from "./checkout";
import { Col, Container, Row } from "react-bootstrap";
const CustomerComponent = () => {
  return (
    <>
      <Container className="h-100">
        <Row>
          <Col  className="mt-2">
            <AnonymousReservationComponent/>
          </Col>
          <Col>
            <Row className="mt-2"><CheckinReservation/></Row>
            <hr/>
            <Row className="mt-2"><CheckoutReservation/></Row>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};
export default CustomerComponent;
