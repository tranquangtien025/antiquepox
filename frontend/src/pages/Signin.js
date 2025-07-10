// Importing necessary modules and components
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

// Signin component for user authentication
export default function Signin() {
    // Initializing necessary hooks and state
    const navigate = useNavigate();
    // Sets the redirect path after a successful login
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('tien@gmail.com');
    const [password, setPassword] = useState('Tien1234');

    // Accessing global state using useContext
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    // Function to handle form submission for user signin
    // (e) event prevents the page refreshing when the user clicks the signin button
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Making a POST request to the signin API endpoint with email and password
            // The response is the data: email, password useState
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const { data } = await Axios.post(`${baseUrl}/api/users/signin`, {
                email,
                password,
            });
            console.log(data);


            // Dispatching the USER_SIGNIN action and storing user info in local storage
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Navigating to the specified redirect path or the default path
            navigate(redirect || '/');
        } catch (err) {
            // Handling and displaying errors using toast notifications
            toast.error(getError(err));
        }
    };

    // useEffect to automatically redirect if user is already signed in
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    // Rendering the Signin component
    return (
        <div className='content'>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <br />
            <h1 className='box'>Sign In</h1>
            <Row>
                {/* Signin form */}
                <Col mg={6} className='box'>
                    <Form onSubmit={submitHandler}>
                        {/* Email input */}
                        <Form.Group className='mb-3' controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        {/* Password input */}
                        <Form.Group className='mb-3' controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        {/* Signin button */}
                        <div className='mb-3'>
                            <Button type='submit'>Sign In</Button>
                        </div>
                        {/* Link to Signup page */}
                        <div className='mb-3'>
                            New customer?{' '}
                            <Link to={`/signup?redirect=${redirect}`}>
                                Create your account
                            </Link>
                        </div>
                    </Form>
                </Col>
                {/* Signin image */}
                <Col md={6}>
                    <img src='/images/signin.png' alt='signin' />
                </Col>
            </Row>
        </div>
    );
}
