import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '../../loading';
import { PUBLIC_URL } from '../../../constants/constants';
import withAuthentication from '../../../helper/Authentication';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Alert, Form, Container, Row, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';

const CheckoutReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchEmail]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${PUBLIC_URL}reception/ACTIVE-reservation?$filter=contains(email, '${searchEmail}')`, {
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
      await axios.post(`${PUBLIC_URL}reception/check-out?reservationId=${reservationId}`, null, {
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

  return (
      <Container fluid>
      <Row>
        <Col>
          <Form.Control
                type="text"
                value={searchEmail}
                className='mb-2'
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
            <Col>
              {reservations.length > 0 ? (
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Table</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Note</th>
                      <th>Action</th>
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
                          <Button variant="primary" onClick={() => handleCheckOut(reservation.id)}>Checkout</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            
            ) : (
              <Alert variant="info">No active reservations found</Alert>
            )}
            </Col>
          </>
        )}
      </Row>
      </Container>
  );
};

export default withAuthentication(CheckoutReservation);
