import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '../loading';
import { DEV_URL, PUBLIC_URL } from '../../constants/constants';
import withAuthentication from '../../helper/Authentication';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Alert, Form, Container, Row, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';

const CheckoutReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPhone]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${PUBLIC_URL}anonymous-booking/active-reservations?$filter=contains(phone, '${searchPhone}')`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired! Please log in again!');
        navigate('/login');
      } else {
        console.log(error);
        toast.error('Error fetching reservations');
      }
    }
  };
  const handleCheckOut = async (reservationId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${PUBLIC_URL}anonymous-booking/check-out?reservationId=${reservationId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Checked out');

      setLoading(true);
      fetchData();
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data || 'Error';
      toast.error(errorMessage);
    }
  };
  const splitDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString();
    dateObj.setHours(dateObj.getHours() - 7);
    const time = dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return { date, time };
  };
  return (
      <Container>
      <Row>
      <Col>
        <h2>Check out</h2>
          <Form.Control
                type="text"
                value={searchPhone}
                className="my-2"
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Search by phone.."
              />
      </Col>
      </Row>      
      <Row>
        <Col>
          {loading ? (
            <LoadingPage />
          ) : (
            <>
              {reservations.length > 0 ? (
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Phone</th>
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
                        <td>{reservation.phone}</td>
                        <td>{reservation.tableId}</td>
                        <td>{splitDateTime(reservation.reservedTime).date}</td>
                        <td>{splitDateTime(reservation.reservedTime).time}</td>
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
                          <Button variant="primary" onClick={() => handleCheckOut(reservation.id)}>Checkout</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No active reservations found</Alert>
              )}
            </>
          )}
        </Col>
      </Row>
      </Container>
  );
};

export default withAuthentication(CheckoutReservation);
