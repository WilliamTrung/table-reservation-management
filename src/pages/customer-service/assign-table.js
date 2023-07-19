import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DEV_URL, PUBLIC_URL } from "../../constants/constants";
import withAuthentication from "../../helper/Authentication";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../loading";
import { Row, Table, Button, Col } from "react-bootstrap"; // Import Bootstrap components

const AssignTableComponent = ({ reservation, onReservationAssigned }) => {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVacantTables();
  }, [reservation]);

  const fetchVacantTables = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${PUBLIC_URL}reception/get-vacants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          reservationId: reservation.id,
        },
      });
      setTables(response.data);
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

  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
  };
  const handleUpdateReservation = () => {
    navigate(`/customer-service/modify/${reservation.id}`);
  };
  const handleCancelReservation = async () => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        const token = sessionStorage.getItem("token");
        await axios.put(
          `${PUBLIC_URL}anonymous-booking/cancel`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              reservationId: reservation.id,
            },
          }
        );
        toast.success("Canceled");
        this.props.first.callback(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired! Please log in again!");
          navigate("/login");
        } else {
          console.log(error);
          const errorMessage = error.response?.data || "Error";
          toast.error(errorMessage);
        }
      }
    }
  };
  const handleAssignTable = async () => {
    try {
      const token = sessionStorage.getItem("token");
      let data = {
        id: reservation.id,
        phone: reservation.phone,
        private: reservation.private,
        modifiedDate: reservation.modified,
      };
      await axios.put(`${PUBLIC_URL}reception/assign-table`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tableId: selectedTable,
        },
      });
      toast.success("Assign successfully!");
      this.props.first.callback(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else if (error.response && error.response.status === 409) {
        toast.error("This reservation has been modified!");
        toast.info("List reloaded");
        this.props.first.callback(false);
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Row>
            <h2>Vacant Tables</h2>
            <Table bordered hover responsive>
              {/* Add Bootstrap table class */}
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Seat</th>
                  <th>Private</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr
                    key={table.id}
                    className={selectedTable === table.id ? "selected-row" : ""}
                    onClick={() => handleSelectTable(table.id)}
                  >
                    <td>{table.id}</td>
                    <td>{table.tableDescription}</td>
                    <td>{table.seat}</td>
                    <td>{table.private ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      )}
      <Row>
        <Col lg={2}>
          <Button variant="success" onClick={handleUpdateReservation}>
            Update
          </Button>
        </Col>
        <Col lg={2}>
          <Button variant="danger" onClick={handleCancelReservation}>
            Cancel
          </Button>
        </Col>
        {selectedTable && (
          <Col lg={3}>
            <Button variant="primary" onClick={handleAssignTable}>
              Assign Table
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default withAuthentication(AssignTableComponent);
