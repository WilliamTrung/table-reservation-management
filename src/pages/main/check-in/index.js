import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../loading";
import { PUBLIC_URL } from "../../../constants/constants";
import withAuthentication from "../../../helper/Authentication";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Alert,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const CheckinReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchEmail]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${PUBLIC_URL}reception/assigned-reservation?$filter=contains(email, '${searchEmail}')`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else {
        console.log(error);
        toast.error("Error fetching reservations");
      }
    }
  };

  const handleCheckIn = async (reservationId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${PUBLIC_URL}reception/check-in?reservationId=${reservationId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Checked in");

      setLoading(true);
      await fetchData();
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data || "Error";
      toast.error(errorMessage);
    }
  };

  return (
      <Container>
      <Row>
        <Col>
          <Form.Control
                type="text"
                value={searchEmail}
                className="my-2"
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search by email.."
              />
        </Col>
      </Row>
      
      <Row>
        {loading ? (
          <Col>
            <LoadingPage />
          </Col>
        ) : (
          <>
            {reservations.length > 0 ? (
              <Col>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Table</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Note</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>{reservation.email}</td>
                        <td>{reservation.assignedTableId}</td>
                        <td>{reservation.date}</td>
                        <td>{reservation.time}</td>
                        <OverlayTrigger key={reservation.id}
                        placement="top"
                        overlay={
                          <Tooltip>
                             {reservation.note ? reservation.note : 'No note'}
                            </Tooltip>
                        }
                        >
                          <td>View Note</td>
                        </OverlayTrigger>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleCheckIn(reservation.id)}
                          >
                            Checkin
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            ) : (
              <Col>
                <Alert variant="info">No assigned reservations found</Alert>
              </Col>
            )}
          </>
      
      )}
      </Row>
      </Container>    
  );
};

export default withAuthentication(CheckinReservation);
