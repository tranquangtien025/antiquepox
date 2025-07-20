import React from 'react';
import { Row, Col } from 'react-bootstrap';

// CheckoutSteps component displays the steps of the checkout process
export default function CheckoutSteps(props) {
  return (
    // Container for the checkout steps, using Bootstrap's Row component
    <Row className='checkout-steps'>
      {/* Step 1: Sign-In */}
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      {/* Step 2: ShippingAddress */}
      <Col className={props.step2 ? 'active' : ''}>Shipping Address</Col>
      {/* Step 3: PaymentMethod */}
      <Col className={props.step3 ? 'active' : ''}>Payment Method</Col>
      {/* Step 4: PlaceOrder */}
      <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}
