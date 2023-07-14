import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

function Login() {
  const [token, setToken] = useState('');
  const responseMessage = (response) => {    
    setToken(response.credential);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </header>
    </div>
  );
}

export default Login;
