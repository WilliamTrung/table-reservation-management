import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Table,
  Alert,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import LoadingPage from "../loading";
import { DEV_URL, PUBLIC_URL } from "../../constants/constants";
import withAuthentication from "../../helper/Authentication";
import { useNavigate } from "react-router-dom";
import AssignTableComponent from "./assign-table"; // Import the AssignTableComponent
import VacantTables from "../main/assign-table"
const AnonymousReservationComponent = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null); // State for selected reservation
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedReservation) {
      handleTableSelectionCallback(); // This function triggers a callback to reload the AssignTableComponent
    }
  }, [selectedReservation]);
  useEffect(() => {
    fetchReservations(); // Fetch initially
    const interval = setInterval(() => {
      fetchReservations(); // Fetch every 1 minute
    }, 60000); // 60000 ms = 1 minute

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReservations = async (pageSize = 5) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      console.log(page);
      const response = await axios.get(
        `${PUBLIC_URL}anonymous-booking/current-reservations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            $top: pageSize,
            $skip: (page - 1) * pageSize,
            $orderby: "Status, ReservedTime",
          },
        }
      );
      setReservations(response.data);
      setLoading(false);
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

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, navigate]);

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const goToCurrentPage = () => {
    fetchReservations();
  };

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleTableSelectionCallback = () => {
    let temp = page;
    setPage(temp);
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
          <h2>Pending Reservations</h2>
        </Col>
      </Row>
      <Row className="h-75">
        {loading ? (
          <LoadingPage />
        ) : reservations.length > 0 ? (
          <Col lg={12}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Seat</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Private</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <OverlayTrigger
                    key={reservation.id}
                    placement="top"
                    overlay={<Tooltip>Click to select</Tooltip>}
                  >
                    <tr
                      key={reservation.id}
                      className={
                        selectedReservation?.id === reservation.id
                          ? "selected-row"
                          : ""
                      } // Add "selected" class to the selected reservation row
                      onClick={() => handleSelectReservation(reservation)} // Call the handler on row click
                    >
                      <td>{reservation.phone}</td>
                      <td>{reservation.status}</td>
                      <td>{reservation.guestAmount}</td>
                      <td>{splitDateTime(reservation.reservedTime).date}</td>
                      <td>{splitDateTime(reservation.reservedTime).time}</td>
                      <td>{reservation.private ? "Yes" : "No"}</td>
                      <OverlayTrigger
                        key={reservation.id}
                        placement="top"
                        overlay={
                          <Tooltip>
                            {reservation.note ? reservation.note : "No note"}
                          </Tooltip>
                        }
                      >
                        <td>View Note</td>
                      </OverlayTrigger>
                    </tr>
                  </OverlayTrigger>
                ))}
              </tbody>
            </Table>
          </Col>
        ) : (
          <Col lg={12}>
            <Alert variant="info">No pending or assigned reservation</Alert>
          </Col>
        )}
      </Row>
      <Row className="h-25 justify-content-center">
          <Col lg={2}>
            <Button
              variant="primary"
              onClick={goToPreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
          </Col>
          <Col lg={1}>
            <Button variant="primary" onClick={goToCurrentPage}>
              {page}
            </Button>
          </Col>
          <Col lg={2}>
            {reservations.length > 0 ? (
              <Button variant="primary" onClick={goToNextPage}>
                Next
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Next
              </Button>
            )}
          </Col>
      </Row>

      <Row id="table-select" className="h-50 mt-3">
        <Col>
          {selectedReservation ? (
            <VacantTables
              callback={handleTableSelectionCallback}
              AssignReservation={selectedReservation}
              key={selectedReservation}
              onTableAssigned={handleTableSelectionCallback}
            />
          ) : (
            <Alert variant="info">
              Select a reservation to load suitable tables
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthentication(AnonymousReservationComponent);
