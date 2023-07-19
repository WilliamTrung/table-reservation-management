import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import LoadingPage from "../loading";
import { DEV_URL, PUBLIC_URL } from "../../constants/constants";
import withAuthentication from "../../helper/Authentication";
import { CombineDateTime } from "../../helper/TimeExtension";

const ModifyReservationComponent = () => {
  const { reservationId } = useParams();
    const [reservation, setReservation] = useState(null);
  const [seat, setSeat] = useState(2);
  const [privateBooking, setPrivateBooking] = useState(false);
  const [desiredDate, setDesiredDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [noteValue, setNoteValue] = useState('');
  const [responseVacant, setResponseVacant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const navigate = useNavigate();
  useEffect(() => {    
    fetchReservation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Perform the GET request here
    // fetchReservation();
    fetchVacantData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seat, privateBooking, desiredDate]);
  
  const fetchReservation = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${PUBLIC_URL}anonymous-booking/current-reservations?$filter=Id eq ${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reservations = response.data;
      if (reservations.length === 1) {
        // Show the reservation
        setReservation(reservations[0]);
        console.log(reservation);
        setDesiredDate(splitDateTime(reservations[0].reservedTime).date);
        setSelectedTime(splitDateTime(reservations[0].reservedTime).time);  
        setSeat(reservations[0].guestAmount);
        setPrivateBooking(reservations[0].private);
        setNoteValue(reservations[0].note);
      } else {
        toast.error("Not found");
        navigate("/customer-service");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else if (error.response && error.response.status === 503) {
        toast.error("No vacant found!");
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
    }
  };
  const fetchVacantData = async () => {
    setLoading(true);
    try {
      let token = sessionStorage.getItem("token");
      let data = {
        seat,
        private: privateBooking,
        desiredDate,
      };
      const request = axios.post(
        `${PUBLIC_URL}anonymous-booking/vacant-amount`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await request;
      setResponseVacant(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = sessionStorage.getItem("token");
      let reservedTime = CombineDateTime({ desiredTime: selectedTime, desiredDate});
      let data = {
        id: reservation.id,
        guestAmount: seat,
        reservedTime: reservedTime,
        private: privateBooking,
        phone: reservation.phone,
        note: noteValue === ''?null:noteValue,
      };

      const response = await axios.put(
        `${PUBLIC_URL}anonymous-booking/modify`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Update successfully!");
      navigate('/customer-service');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
    }
  };
  const splitDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toISOString().split("T")[0];
    const time = dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return { date, time };
  };
  const handleCardHover = (index) => {
    setHoveredIndex(index);
  };
  const handleCardSelect = (index) => {
    setSelectedTime(index);
  };
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col lg={3} md={12} sm={12} className="float-lg-left mt-2">
            <Row>
              <Form id='form-desired'>
                <Form.Group controlId="seat">
                  <Form.Label>Seat</Form.Label>
                  <Form.Control
                    as="select"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    required
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="private">
                  <Form.Check
                    type="checkbox"
                    label="Private"
                    checked={privateBooking}
                    onChange={(e) => setPrivateBooking(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group controlId="desiredDate">
                  <Form.Label>Desired Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    max={
                      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    value={desiredDate}
                    onChange={(e) => setDesiredDate(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Row>
            <hr />
            <Row>
              {selectedTime !== '' ? (
                <Form id="form-add-info" onSubmit={handleFormSubmit}>
                  <Form.Group controlId="note">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Note.."
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-2">
                    Update reservation
                  </Button>
                </Form>
              ) : (
                <Alert variant="info">Select a desired time</Alert>
              )}
            </Row>
          </Col>
          <Col lg={9} md={12} sm={12} className="float-lg-right">
            {loading ? (
              <LoadingPage />
            ) : responseVacant.length > 0 ? (
              <>
                <Container>
                  <Row className="my-2">
                    {responseVacant.map((vacant, index) => (
                      <Col
                        key={index}
                        lg={2}
                        md={1}
                        sm={1}
                        className="text-center my-2"
                      >
                        <Card
                          onMouseEnter={() => handleCardHover(index)} // Set the hoveredIndex on mouse enter
                          onMouseLeave={() => handleCardHover(null)} // Clear the hoveredIndex on mouse leave
                          onClick={() => handleCardSelect(vacant.time)}
                          className={`card-effect ${
                            hoveredIndex === index ? "card-hover-effect" : ""
                          } ${
                            selectedTime === vacant.time
                              ? "card-select-effect"
                              : ""
                          }`}
                        >
                          <Card.Header>{vacant.time}</Card.Header>
                          <Card.Body>{vacant.amount} available</Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </>
            ) : (
              <Alert variant="info" className="mt-3">
                Select your desired table
              </Alert>
            )}
          </Col>
        </Row>
      </Container>    
      {/* <ToastContainer/>   */}
    </>
  );
};

export default withAuthentication(ModifyReservationComponent);
