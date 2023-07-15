import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PUBLIC_URL } from '../../constants/constants';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token || token.trim() === '') {
      toast.error('Please log in!');
      navigate('/login');
    }
  }, [navigate]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        let fetchUrl = PUBLIC_URL.Push('profile');
        console.log(fetchUrl);
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

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>Email: {profile.email}</h2>
          <p>Role: {profile.role}</p>
          <p>Phone: {profile.phone}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileComponent;
