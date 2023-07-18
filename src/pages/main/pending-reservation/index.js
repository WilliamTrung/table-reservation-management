import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DEV_URL, PUBLIC_URL } from "../../../constants/constants";
import LoadingPage from "../../loading";
import VacantTables from "../assign-table";
import { useNavigate } from "react-router-dom";
import withAuthentication from "../../../helper/Authentication";
import { AssignReservation } from "../../../models/assignTable";
import {
  OverlayTrigger,
  Tooltip,
  Button,
  Alert,
  Row,
  Col,
  Container,
} from "react-bootstrap";
// import '../css/AssignTableToReservation.css'
const AssignTableToReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [assignReservation, setAssignReservation] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setAssignReservation(null);
    setSelectedReservation(null);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        PUBLIC_URL +
          `reception/pending-reservation?$top=10&$skip=${(page - 1) * 10}`,
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

  useEffect(() => {
    if (!(selectedReservation == null)) {
      setAssignReservation(
        new AssignReservation(
          selectedReservation.id,
          selectedReservation.email,
          null,
          selectedReservation.private,
          selectedReservation.modifiedDate
        )
      );
    } else {
      setAssignReservation(null);
    }
  }, [selectedReservation]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, navigate]);

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const goToCurrentPage = () => {
    setPage(page);
  };

  const handleTableAssigned = () => {
    // Perform any necessary actions or state updates
    // to trigger a re-render of the ReservationList component
    fetchData();
  };

  return (
    <Container>
      <Row>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {reservations.length > 0 ? (
              <>
                <div className="h-75">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Seat</th>
                        <th>Private</th>
                        <th>Date</th>
                        <th>Time</th>
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
                            onClick={() => setSelectedReservation(reservation)}
                            className={
                              selectedReservation &&
                              selectedReservation.id === reservation.id
                                ? "selected-row"
                                : ""
                            }
                          >
                            <td>{reservation.email}</td>
                            <td>{reservation.seat}</td>
                            <td>{reservation.private ? "True" : "False"}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.time}</td>
                            <OverlayTrigger
                              key={reservation.id}
                              placement="top"
                              overlay={
                                <Tooltip>
                                  {reservation.note
                                    ? reservation.note
                                    : "No note"}
                                </Tooltip>
                              }
                            >
                              <td>View Note</td>
                            </OverlayTrigger>
                          </tr>
                        </OverlayTrigger>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="h-75">
                <Alert variant="info">No pending reservation</Alert>
              </div>
            )}
          </>
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
      <Row className="mt-2">
        <Col>
          {!loading && assignReservation ? (
            <VacantTables
              AssignReservation={assignReservation}
              key={assignReservation}
              onTableAssigned={handleTableAssigned}
            />
          ) : loading ? (
            <></>
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

export default withAuthentication(AssignTableToReservation);
