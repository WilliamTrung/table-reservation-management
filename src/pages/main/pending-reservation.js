import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';
import withAuthentication from '../../helper/Authentication';
import LoadingPage from '../loading';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
          toast.error('Invalid credentials');
          return;
        } else {
          console.log(error);
          toast.error('Error fetching reservations');
        }
      }
    };

    fetchData();
  }, [page]);

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      {loading ? (
        <LoadingPage/>
      ) : (
        <>
          {reservations.length > 0 ? (
            <div>
              <ul>
                {reservations.map((reservation) => (
                  <li key={reservation.id}>
                    <p>ID: {reservation.id}</p>
                    <p>Email: {reservation.email}</p>
                    <p>Seat: {reservation.seat}</p>
                    <p>Private: {reservation.private}</p>
                    <p>Date: {reservation.date}</p>
                    <p>Time: {reservation.time}</p>
                    <p>ModifiedDate: {reservation.modifiedDate}</p>
                    <p>Note: {reservation.note}</p>
                    <p>AssignedTableId: {reservation.assignedTableId}</p>
                    <p>Status: {reservation.status}</p>
                  </li>
                ))}
              </ul>
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
  );
};

export default withAuthentication(ReservationList);
