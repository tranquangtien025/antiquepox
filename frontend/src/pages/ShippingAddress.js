// rfc
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddress() {
  // Initialize necessary hooks and variables
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  // Destructure relevant data from global state
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  // Local state to manage user input for shipping address, use or leave empty
  // data is stored in local storage even if you refresh the page
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [states, setStates] = useState(shippingAddress.states || ''); // states not state
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  // Effect to redirect to sign-in if user is not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  // Handler function for form submission
  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch action to save the shipping address to the global state
    // (e) event prevents the page refreshing when the user clicks the signin button
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        states,
        postalCode,
        country,
      },
    });
    // Save the shipping address to local storage
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        states,
        postalCode,
        country,
      })
    );
    // Navigate to the payment screen
    navigate('/payment');
  };

  return (
    <div className='content'>
      {/* Helmet for setting the title of the page */}
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <br />
      {/* Display the checkout steps component with appropriate steps marked as completed */}
      <CheckoutSteps step1 step2></CheckoutSteps>
      <br />
      <div className='container small-container'>
        <h1 className='box'>Shipping Address</h1>
        {/* Form for capturing user's shipping address */}
        <Form onSubmit={submitHandler}>
          {/* Full Name input field */}
          <Form.Group className='mb-3' controlId='fullName'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          {/* Address input field */}
          <Form.Group className='mb-3' controlId='address'>
            <Form.Label>Full Address, Bld, Apt, Space</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          {/* City input field */}
          <Form.Group className='mb-3' controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          {/* State input field */}
          <Form.Group className='mb-3' controlId='states'>
            <Form.Label>State</Form.Label>
            <Form.Control
              value={states}
              onChange={(e) => setStates(e.target.value)}
              required
            />
          </Form.Group>
          {/* Postal Code input field */}
          <Form.Group className='mb-3' controlId='postalCode'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          {/* Country input field */}
          <Form.Group className='mb-3' controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          {/* Continue button */}
          <div className='mb-3'>
            <Button variant='primary' type='submit'>
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// step 2 (ShippingAddress) <= CURRENT STEP
// step 3 (PaymentMethod) select radial button for PayPal or Stripe
