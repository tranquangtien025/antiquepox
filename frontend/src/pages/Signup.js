// rfc
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function Signup() {
  // Initialize necessary hooks and variables
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  // Local state to manage user registration input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Accessing global state using context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Handler function for form submission
  // (e) event prevents the page refreshing when the user clicks the signin button
  const submitHandler = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      // Make a request to the server to register the user
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const { data } = await Axios.post(`${baseUrl}/api/users/signup`, {
        name,
        email,
        password,
      });
      // Dispatch user signin action and store user information in local storage
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      // Redirect to the specified route or the default route
      navigate(redirect || '/');
    } catch (err) {
      // Display error message using toast
      toast.error(getError(err));
    }
  };

  // Effect to check if the user is already signed in, and redirect if true
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className='content'>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <br />
      <Row>
        <h1 className='box'>Sign Up</h1>
        <Col md={6}>
          {/* Form for user registration */}
          <Form onSubmit={submitHandler} className='box'>
            {/* Name input field */}
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            {/* Email input field */}
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            {/* Password input field */}
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Confirm Password input field */}
              <Form.Group className='mb-3' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Form.Group>
            {/* Sign Up button */}
            <div className='mb-3'>
              <Button type='submit'>Sign Up</Button>
            </div>
            {/* Link to Sign-In page */}
            <div className='mb-3'>
              Already have an account?{' '}
              <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
            </div>
          </Form>
        </Col>

        <Col md={6} className='mt-3'>
          <img src='/images/register.png' alt='register' />
        </Col>
      </Row>
    </div>
  );
}
