// rfc
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

// PaymentMethodScreen component allows users to select a payment method during checkout
export default function PaymentMethod() {
  // Initialize necessary hooks and variables
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // Destructuring relevant data from global state
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  // Local state to manage the selected payment method
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  // Effect to redirect to the shipping screen if the shipping address is not provided
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Handler function for form submission
  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch action to save the selected payment method to the global state
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    // Save the selected payment method to local storage
    localStorage.setItem('paymentMethod', paymentMethodName);
    // Navigate to the place order screen
    navigate('/placeorder');
  };

  return (
    <div className='content'>
      <br />
      {/* Display the checkout steps component with appropriate steps marked as completed */}
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className='container small-container'>
        {/* Helmet for setting the title of the page */}
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <br />
        {/* Heading for the payment method screen */}
        <h1 className='box'>Payment Method</h1>
        {/* Form for selecting the payment method */}
        <Form onSubmit={submitHandler}>
          {/* PayPal radio button */}
          <div className='mb-3'>
            <div className='payment-option'>
              <Form.Check
                type='radio'
                id='PayPal'
                label='PayPal'
                value='PayPal'
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className='fab fa-cc-paypal'></i>
            </div>
          </div>

          {/* Stripe radio button */}
          <div className='mb-3'>
            <div className='payment-option'>
              <Form.Check
                type='radio'
                id='Stripe'
                label='Credit Card' // makes it less confusing for customer
                value='Stripe'
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className='fab fa-cc-stripe'></i>
            </div>
          </div>

          {/* Continue button */}
          <div className='mb-3'>
            <Button type='submit'>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// step 2 (ShippingAddress)
// step 3 (PaymentMethod) select radial button for PayPal or Stripe  <= CURRENT STEP
