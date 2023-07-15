import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import "../../helper/StringExtension";
import "../../helper/global";
import { useEffect, useState } from 'react';
import { USER_FAMILYNAME, USER_GIVENNAME, USER_PICTURE } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  useEffect(
    () => {
      let checkSession = Function.prototype.TokenIsNullOrEmpty();
      if(!checkSession){
        setToken(sessionStorage.getItem('token'));
      }
    }, []
  );
  useEffect(() => {
    let checkToken = token.IsNullOrEmpty();
    if(!checkToken){
      try {
        let user = token.TokenToUser();
        sessionStorage.setItem(USER_FAMILYNAME, user.family_name);
        sessionStorage.setItem(USER_GIVENNAME, user.given_name);
        sessionStorage.setItem(USER_PICTURE, user.picture);

        // let user_session = User.GetSession();
        // toast(user_session.getFullname());
        // toast(user_session.picture);

        navigate('/');
      } catch (error) {
        toast.error(error.message);
      }
    } 
  }, [token, navigate]); // Provide an empty array as the second argument to run only once
  const responseMessage = (response) => {    
    let temp_token = response.credential;
    setToken(temp_token);
    sessionStorage.setItem('token', temp_token);
    toast('Login successfully!');
  };
  const errorMessage = (error) => {
    toast.error(error);
  };
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        <ToastContainer/>
      </header>
    </div>
  );
}

export default Login;
