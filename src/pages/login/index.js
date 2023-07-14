import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './login';


const LoginGoogle = () => {
    return (
        <>
            <GoogleOAuthProvider clientId="247022900275-3eltdkn1vma20l3pr61jfnvpa4k8bgeo.apps.googleusercontent.com">
                <Login />
            </GoogleOAuthProvider>
        </>
    );
}
export default LoginGoogle;
