import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';
import LoadingPage from '../loading';
import VacantTables from './assign-table';
import { useNavigate } from 'react-router-dom';
import withAuthentication from '../../helper/Authentication';
import { AssignReservation } from '../../models/assignTable';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [assignReservation, setAssignReservation] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    if(!(selectedReservation == null)){
      setAssignReservation(new AssignReservation(selectedReservation.id, selectedReservation.email, null, selectedReservation.private, selectedReservation.modifiedDate));
    }    
  },[selectedReservation]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(PUBLIC_URL + `reception/pending-reservation?$top=10&$skip=${(page - 1) * 10}`, {
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

    fetchData();
  }, [page, navigate]);

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {reservations.length > 0 ? (
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Seat</th>
                      <th>Private</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Note</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>{reservation.email}</td>
                        <td>{reservation.seat}</td>
                        <td>{reservation.private ? 'True' : 'False'}</td>
                        <td>{reservation.date}</td>
                        <td>{reservation.time}</td>
                        <td>{reservation.note}</td>
                        <td>{reservation.status}</td>
                        <td>
                          <button onClick={() => setSelectedReservation(reservation)}>Select</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <button onClick={goToPreviousPage} disabled={page === 1}>Previous</button>
                  <button onClick={goToNextPage}>Next</button>
                </div>
              </div>
            ) : (
              <p>No reservations found</p>
            )}
          </>
        )}
      </div>

      <div>
        {!loading && assignReservation ? (
          <VacantTables AssignReservation={assignReservation} key={assignReservation} />
        ) : (
          <p>No table selected</p>
        )}
      </div>
    </>
  );
};

export default withAuthentication(ReservationList);
