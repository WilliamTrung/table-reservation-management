import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import "../../helper/StringExtension";
import "../../helper/global";
import { useEffect, useState } from 'react';
function Login() {
  const [token, setToken] = useState('');
  useEffect(() => {
    console.log("use effect");
    console.log(token);
    let check = Function.prototype.TokenIsNullOrEmpty();
    if (check) {
      toast("Please login!");
    } else {
      toast("You have logged in!");
    }
  }, []); // Provide an empty array as the second argument to run only once
  const responseMessage = (response) => {    
    let temp_token = response.credential;
    setToken(temp_token);
    sessionStorage.setItem('token', temp_token);
    console("Response: " + response);
  };
  const errorMessage = (error) => {
    console.log("Error:" + error);
    toast(error);
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
