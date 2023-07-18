import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';

const TableTypeComponent = () => {
  const [tableTypes, setTableTypes] = useState([]);

  useEffect(() => {
    fetchTableTypes(); // Fetch table types initially

    const interval = setInterval(() => {
      fetchTableTypes(); // Re-fetch table types every 1 minute
    }, 60000);

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const fetchTableTypes = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${PUBLIC_URL}/manage-table/type`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTableTypes(response.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching table types');
    }
  };

  return (
    <div>
      <h1>Table Types</h1>
      {tableTypes.map((table, index) => (
        <div key={index}>
          <p>Seat: {table.seat}</p>
          <p>
            Private: <input type="checkbox" checked={table.private} disabled />
          </p>
        </div>
      ))}
    </div>
  );
};

export default TableTypeComponent;
