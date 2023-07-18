import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';
import LoadingPage from '../loading';
import withAuthentication from '../../helper/Authentication';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

const TableListComponent = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => {
      clearInterval(intervalId); // Cleanup the interval when the component unmounts
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${PUBLIC_URL}/manage-table`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTables(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired! Please log in again!');
        navigate('/login');
      } else {
        console.log(error);
        const errorMessage = error.response?.data || 'Error';
        toast.error(errorMessage);
      }
    }
  };

  const handleRowClick = (tableId) => {
    navigate(`/manage-table/update/${tableId}`);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <h1>Table Management</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Seat</th>
            <th>Private</th>
            <th>Deleted</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <OverlayTrigger
              key={table.id}
              placement="top"
              overlay={<Tooltip>Click to modify</Tooltip>}
            >
              <tr
                onClick={() => handleRowClick(table.id)}
                className="table-row"
              >
                <td>{table.id}</td>
                <td>{table.tableDescription}</td>
                <td>{table.status}</td>
                <td>{table.seat}</td>
                <td>{table.private ? 'Yes' : 'No'}</td>
                <td>{table.isDeleted ? 'Yes' : 'No'}</td>
              </tr>
            </OverlayTrigger>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuthentication(TableListComponent);
