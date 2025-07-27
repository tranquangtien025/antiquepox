import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

// Reducer function for handling state related to user profile update
// logged in user can update name and password
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const Profile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Local state for form inputs and loading state
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UseReducer hook for handling state changes
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // Function to handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Password must be not empty');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password and confirm password do not match');
      return;
    }

    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const { data } = await axios.put(
        `${baseUrl}/api/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <br />
      <h1 className='box'>User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Update</Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
