import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import "../../helper/StringExtension";
import "../../helper/global";
// import { useEffect, useState } from 'react';
import { ALLOWED_EMAIL, USER_EMAIL, USER_FAMILYNAME, USER_GIVENNAME, USER_PICTURE } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate = useNavigate();
  const responseMessage = (response) => {    
    let token = response.credential;
    let user = token.TokenToUser();
    if (!user || !user.email.Contains(ALLOWED_EMAIL)) {
      toast.error('User is not allowed!');
      return;
    } else {
      sessionStorage.setItem('token', token);   
      sessionStorage.setItem(USER_FAMILYNAME, user.family_name);
      sessionStorage.setItem(USER_GIVENNAME, user.given_name);
      sessionStorage.setItem(USER_PICTURE, user.picture);
      sessionStorage.setItem(USER_EMAIL, user.email);
      // let user_session = User.GetSession();
      // toast(user_session.getFullname());
      // toast(user_session.picture);
      toast('Login successfully!');
      navigate('/');
    }
  };
  const errorMessage = (error) => {
    toast.error(error);
  };
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        {/* <ToastContainer/> */}
      </header>
    </div>
  );
}

export default Login;
