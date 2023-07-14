import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './login';

function LoginGoogle(){
    return (
        <>
        <h2>Login Page</h2>
        <GoogleOAuthProvider clientId="247022900275-3eltdkn1vma20l3pr61jfnvpa4k8bgeo.apps.googleusercontent.com">
                <Login />
        </GoogleOAuthProvider>    
        </>
    );
}
export default LoginGoogle;
