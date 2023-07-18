import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PUBLIC_URL } from "../../../constants/constants";
import LoadingPage from "../../loading";
import withAuthentication from "../../../helper/Authentication";

const UpdateTableComponent = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  useEffect( () => {    
    const fetchTableData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${PUBLIC_URL}/manage-table?$filter=Id eq ${tableId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data && response.data.length === 1) {
          setTableData(response.data[0]);
        } else {
          toast.error("Error retrieving table data");
        }
  
        setLoading(false);
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
          value: parseInt(i++),
          label: option.toString(),
        }));
  
        setStatusOptions(options);        
      } catch (error) {
        console.log(error);
        toast.error("Cannot load selecting status");
      }
    };

    fetchTableData();
    fetchStatusOptions();
  }, []);

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Implement the logic to update the table data here
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${PUBLIC_URL}/manage-table`,
        tableData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Table updated successfully!");
      navigate("/manage-table");
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data || "Error";
      toast.error(errorMessage);
    }
  };
  const initStatus = () => {
    statusOptions.forEach(option => {
      if(tableData.status === option.label){
        return option.value
      }
    });
    return 0;
  }
  const handleCheckboxChange = () => {
    let result = true;
    if(!tableData.isDeleted){
      result = window.confirm(
        "Are you sure you want to mark this table as deleted?"
      );
    }    
    if (result) {
      setTableData({
        ...tableData,
        isDeleted: !tableData.isDeleted,
      })
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container">
      <h1 className="mt-2">Update Table</h1>
      <div className="row">
        <div className="col-md-8">
          {/* Render the form with the tableData */}
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Table Description:</label>
              <input
                type="text"
                className="form-control"
                value={tableData.tableDescription}
                onChange={(e) =>
                  setTableData({
                    ...tableData,
                    tableDescription: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status:</label>
              <select
                className="form-select"
                value={initStatus()}
                onChange={(e) =>
                  setTableData({ ...tableData, status: e.target.value })
                }
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={tableData.isDeleted}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label">Mark as Deleted</label>
            </div>
            <button type="submit" className="btn btn-primary">
              Update Table
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuthentication(UpdateTableComponent);
