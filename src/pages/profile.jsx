import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "../Assets/Style/profile.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import user_photo from "../Assets/images/profile.png";

function MyProfile() {
  const { id } = useParams(); // Get user ID from URL if present
  const navigate = useNavigate();
  const [Img, setImg] = useState();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  // const [age, setAge] = useState();
  // const [gen, setGen] = useState(); 
  // const [ph_no, setPh_no] = useState();
  const [interest, setInterest] = useState();
  const [dob, setDob] = useState();
  const [about, setAbout] = useState();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const handleChange = (e) => {
  //   const file = e.target.files[0];  
  //   if (file) {
  //     setImg(URL.createObjectURL(file));  
  //   }
  // }; 

  const fetchCard = async () => {
    try {
      const response = await fetch(`http://localhost:3000/profile${id ? `/${id}` : ''}`, {
        method: "GET",
        credentials: 'include',
      }); 
  
      const dataDB = await response.json();

      if (response.ok) {

        if (dataDB.data) {
          setImg(dataDB.data.image); 
          setName(dataDB.data.name);
          // setAge(dataDB.data.age);
          // setGen(dataDB.data.gender);
          // setPh_no(dataDB.data.ph_no);
          setInterest(dataDB.data.interest);
          setDob(dataDB.data.dob);
          setAbout(dataDB.data.about);
        }else {
          console.error("Error :",response.message);
        }

      }else {
        console.error("Failed to fetch profile image");
        alert(dataDB.message)
        navigate("/")
      }
    } catch (error) {
      console.error('Error retrieving profile photo:', error);
    }
  };
  
  useEffect(() => {
    fetchCard();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();  
    const profile_img = document.querySelector('input[name="img"]').files[0];
  
    if (!profile_img) {
      alert("Please select an image before submitting!");
      return;
    }
  
    const formData = new FormData();
    formData.append('profile_img', profile_img);
  
    try {
      const response = await fetch('http://localhost:3000/profile', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        setImg(URL.createObjectURL(profile_img));  // Set the image URL if a file is selected
        setShow(false);
      } else {
        alert('Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    

  return (
    <div className="container mt-5">
      <div className="userProfile_card shadow-sm">
        <div className="card-header bg-dark text-white text-center">
          <h2>Profile</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img id="profile_photo"
                src={Img || user_photo}  // Fallback to a default image if none is selected
                className="rounded-circle img-fluid mb-3"
                alt="Profile"
              />
              
              {!id && ( 
                <button id="profile_photo_btn" onClick={handleShow}>Change Profile Photo</button>
              )}

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Change Profile Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formImage">
                      <Form.Label>Image</Form.Label>
                      <Form.Control type="file" name="img" required/>
                    </Form.Group>
                  </Form>
                </Modal.Body> 
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="col-md-8">
              <h3>{name}</h3>
              <p className="text-muted">@{name}</p>
                <div>
                  <div className="d-flex justify-content-between">
                    <p><strong>Interests: </strong> {interest}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p><strong>Date of Birth: </strong> {dob}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p><strong>Gender: </strong> {dob}</p>
                  </div>
                </div>
            </div>
        </div>
        <div id="about_box" >
          <p>{about}</p>
        </div>
      </div>
      <div className="card-footer text-muted text-center">
        <div className="row">
          <div className="col-md-4">
            <h5>Posts</h5>
            <p>12</p>
          </div>
          <div className="col-md-4">
            <h5>Followers</h5>
            <p>300</p>
          </div>
          <div className="col-md-4">
            <h5>Following</h5>
            <p>180</p>
          </div>
        </div>
      </div>
    </div>

    {!id && (
        <button id="add_detail_btn" onClick={() => navigate('/details')}>Add Details</button>
    )}

  </div>
  );
}

export default MyProfile;
