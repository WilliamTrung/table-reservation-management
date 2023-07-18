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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "../loading";
import { DEV_URL, PUBLIC_URL } from "../../constants/constants";
import withAuthentication from "../../helper/Authentication";
import { GetCurrentDateFormatted } from "../../helper/TimeExtension";

const BookingComponent = () => {
  const [seat, setSeat] = useState(2);
  const [privateBooking, setPrivateBooking] = useState(false);
  const [desiredDate, setDesiredDate] = useState(GetCurrentDateFormatted());
  const [phoneValue, setPhoneValue] = useState('');
  const [noteValue, setNoteValue] = useState('');

  const [responseVacant, setResponseVacant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log(desiredDate);
    // Perform the GET request here
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seat, privateBooking, desiredDate]);
  const fetchData = async () => {
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
      setSelectedTime('');
      setPhoneValue('');
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
      let data = {
        guestAmount: seat,
        desiredDate: desiredDate,
        desiredTime: selectedTime,
        private: privateBooking,
        phone: phoneValue,
        note: noteValue === ''?null:noteValue,
      };

      const response = await axios.post(
        `${PUBLIC_URL}anonymous-booking/new-reservation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Add successfully!");
      setPhoneValue('');
      setSelectedTime('');
      await fetchData();
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else if (
        Array.isArray(error.response?.data?.errors?.Phone) &&
        error.response.data.errors.Phone.includes(
            "Provided phone number is not valid!"
        )
      ) {
        toast.error("Provided phone number is not valid!");
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
    }
  };
  const handleCardHover = (index) => {
    setHoveredIndex(index);
  };
  const handleCardSelect = (index) => {
    setSelectedTime(index);
  };
  return (
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
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer phone number"
                    value={phoneValue}
                    pattern="^(?:\+?84|0)(?:\d{9}|(?:\d{2}-\d{3}-\d{4})|(?:\d{3}-\d{2}-\d{2}-\d{2}))$"
                    onChange={(e) => setPhoneValue(e.target.value)}
                    required
                    title="Please enter a valid phone number!"
                  />
                </Form.Group>
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
                  Add reservation
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
              No vacant tables found!
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthentication(BookingComponent);
