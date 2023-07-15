import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';
import withAuthentication from '../../helper/Authentication';
import LoadingPage from '../loading';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  const [newPhone, setNewPhone] = useState('');
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const fetchUrl = PUBLIC_URL + '/profile';
      const response = await axios.get(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { email, role, phone } = response.data;
      const newProfile = { email, role, phone };
      setProfile(newProfile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePhoneChange = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const updatePhoneUrl = PUBLIC_URL + '/profile/update-phone';
      await axios.post(updatePhoneUrl, { phone: newPhone }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchData(); 
      toast.success('Phone number updated successfully!');
    } catch (error) {
        if (Array.isArray(error.response?.data?.errors?.Phone) && error.response.data.errors.Phone.includes("Provided phone number is not valid!")) {
            toast.error('Provided phone number is not valid!');
        } else {
            console.log(error);
            toast.error('ERROR');
        }
    }
  };
  
  return (
    <>
    <div>
      {profile ? (
        <div>
          <h2>Email: {profile.email}</h2>
          <p>Role: {profile.role}</p>
          <p>Phone: {profile.phone}</p>
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Enter new phone number"
          />
          <button onClick={handlePhoneChange}>Update Phone</button>
        </div>
      ) : (
        <LoadingPage/>
      )}
    </div>
    <ToastContainer/>
    </>
    
  );
};

export default withAuthentication(ProfileComponent);
