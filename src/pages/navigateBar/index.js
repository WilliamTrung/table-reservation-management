import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { USER_GIVENNAME, USER_PICTURE } from '../../constants/constants';

const NavigationBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  useEffect(() => {
    setPicture(sessionStorage.getItem(USER_PICTURE));
    setName(sessionStorage.getItem(USER_GIVENNAME));
  }, [navigate]);
  const [userPicture, setPicture] = useState(sessionStorage.getItem(USER_PICTURE));
  const [userName, setName] = useState(sessionStorage.getItem(USER_GIVENNAME));

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/manage-table" className='ms-2'>Table Management</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Reservation Service</Nav.Link>
            <Nav.Link as={NavLink} to="/customer-service">Customer Service</Nav.Link>
            <Nav.Link as={NavLink} to="/booking">Booking</Nav.Link>
          {/* Add more Nav.Link elements for other routes */}
        </Nav>
          <NavDropdown
            align="end"
            renderMenuOnMount={true}
            title={
              <div className="d-inline-block text-light">
                <div className="d-flex">
                  <Image src={userPicture} alt="User" roundedCircle className="me-2" width='15%'/>
                  <div className="d-flex me-2">{userName}</div>
                </div>
              </div>
            }
          >
            <NavDropdown.Item to="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
