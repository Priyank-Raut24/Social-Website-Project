import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import "../Assets/Style/login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for sending and receiving cookies
      });

      const result = await response.json();
      
      if (response.status === 200) {
        console.log('Redirection to homepage');
        navigate('/');
      } else {
        console.error("error");
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
};


  return (
    <div className="login-container">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </div>
        <button id="Loginbtn" type="submit">Login</button>
      </form>
    </div>
  );
}


function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for sending and receiving cookies
      });
      
      const result = await response.json();

      if (response.ok) {
        console.log('Redirection to homepage');
        navigate('/details');

      } else {
        console.error("error");
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div>
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              name="email"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </div>
        <button id="Loginbtn" type="submit">Sign Up</button>
      </form>
    </div>
  );
}


export{ Signup, Login};
