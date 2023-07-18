import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../../constants/constants';
import withAuthentication from '../../../helper/Authentication';
import LoadingPage from '../../loading/index';
import { Alert, Button, Table } from 'react-bootstrap';

const VacantTables = ({ AssignReservation, onTableAssigned }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        console.log("Reservation Id: " + AssignReservation.id);
        const response = await axios.get(PUBLIC_URL + `reception/get-vacants?reservationId=${AssignReservation.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTables(response.data);
        
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, [AssignReservation]);

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleAssignTable = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `${PUBLIC_URL}/reception/assign-table?tableId=${selectedTable}`,
        AssignReservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response after successful table assignment
      console.log(response);
      toast.success('Assign successful!');
      onTableAssigned(); // Notify the parent component
    } catch (error) {
      console.log(error);
      toast.error('Error!');
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {tables.length > 0 ? (
            <Table bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Table Description</th>
                  <th>Seat</th>
                  <th>Private</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr
                    key={table.id}
                    onClick={() => handleTableSelect(table.id)}
                    className={selectedTable === table.id ? 'selected-row' : ''}
                  >
                    <td>{table.id}</td>
                    <td>{table.tableDescription}</td>
                    <td>{table.seat}</td>
                    <td>{table.private ? 'True' : 'False'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No vacant tables found</Alert>
          )}

          {selectedTable && (
            <Button variant="primary" onClick={handleAssignTable}>
              Assign Table
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default withAuthentication(VacantTables);
