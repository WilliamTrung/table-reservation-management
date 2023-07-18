import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PUBLIC_URL, USER_FAMILYNAME, USER_GIVENNAME, USER_PICTURE } from "../../constants/constants";
import withAuthentication from "../../helper/Authentication";
import LoadingPage from "../loading";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { Button, Card, Container } from "react-bootstrap";

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const picture = sessionStorage.getItem(USER_PICTURE);
  const username = sessionStorage.getItem(USER_FAMILYNAME) + ' ' + sessionStorage.getItem(USER_GIVENNAME);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const fetchUrl = PUBLIC_URL + "/profile";
      const response = await axios.get(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { email, role, phone } = response.data;
      const newProfile = { email, role, phone };
      setProfile(newProfile);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired! Please log in again!");
        navigate("/login");
      } else {
        console.log(error);
        const errorMessage = error.response?.data || "Error";
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePhoneChange = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const updatePhoneUrl = PUBLIC_URL + "/profile/update-phone";
      await axios.post(
        updatePhoneUrl,
        { phone: newPhone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
      toast.success("Phone number updated successfully!");
    } catch (error) {
      if (
        Array.isArray(error.response?.data?.errors?.Phone) &&
        error.response.data.errors.Phone.includes(
          "Provided phone number is not valid!"
        )
      ) {
        toast.error("Provided phone number is not valid!");
      } else {
        console.log(error);
        toast.error("ERROR");
      }
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center">
      {profile ? (
        <Card border="primary" className="mt-4">
          <Card.Body>
            <div className="text-center mt-2">
              <Card.Img
                variant="top"
                src={picture}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <Card.Title className="mt-2">{username}</Card.Title>
            </div>
            <Card.Text className="text-left">Email: {profile.email}</Card.Text>
            <Card.Text className="text-left">Role: {profile.role}</Card.Text>
            <Card.Text className="text-left">Phone: {profile.phone}</Card.Text>
            <Container className="justify-content-center">
              <Form.Group controlId="newPhone" className="mt-4 mb-2">
                <Form.Control
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter new phone number"
                />
              
              </Form.Group>
              <div className="text-center mt-2">
              <Button
                variant="primary"
                onClick={() => handlePhoneChange(newPhone)}
              >
                Update Phone
              </Button>
            </div>
            </Container>
          </Card.Body>
        </Card>
      ) : (
        <LoadingPage />
      )}
    </Container>
    </>
  );
};

export default withAuthentication(ProfileComponent);
