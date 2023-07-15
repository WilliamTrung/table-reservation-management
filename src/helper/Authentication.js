import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ALLOWED_EMAIL } from '../constants/constants';
import "./StringExtension";

const withAuthentication = (Component) => {
  const WrappedComponent = (props) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const user = token ? token.TokenToUser() : null;

    useEffect(() => {
      if (!token || token.trim() === '') {
        toast.error('Please log in!');
        navigate('/login');
      } else if (!user || !user.email.Contains(ALLOWED_EMAIL)) {
        toast.error('User is not allowed!');
        navigate('/login');
      }
    }, [navigate, token, user]);

    return user && user.email.Contains(ALLOWED_EMAIL) ? <Component {...props} /> : null;
  };

  return WrappedComponent;
};

export default withAuthentication;
