import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DEV_URL, PUBLIC_URL } from "../../constants/constants";
import "../../helper/StringExtension";

const AddTableComponent = () => {
  const [tableDescription, setTableDescription] = useState("");
  const [status, setStatus] = useState("");
  const [seat, setSeat] = useState("2");
  const [privateTable, setPrivateTable] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatusOptions();
  }, []);

  const fetchStatusOptions = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${PUBLIC_URL}/manage-table/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let i = 0;
      const options = response.data.map((option) => ({
        value: i++,
        label: option.toString(),
      }));

      setStatusOptions(options);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching status options");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const data = {
        tableDescription,
        status: parseInt(status),
        seat: parseInt(seat),
        private: privateTable,
      };
      console.log(data);
      const response = await axios.post(`${PUBLIC_URL}manage-table`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      toast.success("Table added successfully!");      
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
  };

  return (
    <div className="container">
      <h1>Add Table</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="tableDescription" className="form-label">
            Table Description:
          </label>
          <input
            type="text"
            id="tableDescription"
            className="form-control"
            value={tableDescription}
            onChange={(e) => setTableDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status:
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select</option>
            {statusOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="seat" className="form-label">
            Seat:
          </label>
          <select
            id="seat"
            className="form-select"
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
          >
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="private"
              className="form-check-input"
              checked={privateTable}
              onChange={(e) => setPrivateTable(e.target.checked)}
            />
            <label htmlFor="private" className="form-check-label">
              Private
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Table
        </button>
      </form>
    </div>
  );
};

export default AddTableComponent;
