import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../../constants/constants';
import withAuthentication from '../../../helper/Authentication';
import LoadingPage from '../../loading/index';

const VacantTables = ({ AssignReservation }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        toast.error('Fetch data failed');
      }
    };

    fetchData();
  }, [AssignReservation]);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {tables.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Table Description</th>
                  <th>Status</th>
                  <th>Seat</th>
                  <th>Private</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id}>
                    <td>{table.id}</td>
                    <td>{table.tableDescription}</td>
                    <td>{table.status}</td>
                    <td>{table.seat}</td>
                    <td>{table.private ? 'True' : 'False'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No vacant tables found</p>
          )}
        </>
      )}
    </div>
  );
};

export default withAuthentication(VacantTables);
