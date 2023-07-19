import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './login';
import { Col, Container, Row } from 'react-bootstrap';

function LoginGoogle(){
    return (
        <Row className="justify-content-center">
          <Col md={6}>
            <GoogleOAuthProvider clientId="247022900275-3eltdkn1vma20l3pr61jfnvpa4k8bgeo.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          </Col>
        </Row>
    );
}
export default LoginGoogle;
