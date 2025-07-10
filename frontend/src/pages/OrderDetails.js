import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Card, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

// Reducer function to handle different actions
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

// OrderScreen component
export default function OrderDetails() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Function to create the PayPal order
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // Function to handle PayPal payment approval
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const { data } = await axios.put(
          `${baseUrl}/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  // Function to handle PayPal payment error
  function onError(err) {
    toast.error(getError(err));
  }

  // Fetch order details and load PayPal script on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const { data } = await axios.get(`${baseUrl}/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }

    // If order details are not available, or payment is successful, or order ID is different,
    // fetch order details again
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();

      // Reset payment status if payment was successful
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      // Load PayPal script when order details are available
      const loadPaypalScript = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const { data: clientId } = await axios.get(`${baseUrl}/api/keys/paypal`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div className='content'>
      <Helmet>
        {/* displays PayPal or Stripe  */}
        <title>{order.paymentMethod} Order Details</title>
      </Helmet>
      <br />
      <h1 className='box'>Order Details | Order id: {orderId}</h1>

      <Row>
        <Col md={8}>
          {/* Order Items */}
          <Card className='box'>
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant='flush'>
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Shipping Details */}
          <Card className='box'>
            <Card.Body>
              <Card.Text>
                <title>Shipping</title>
                <text>
                  <strong>Name:</strong> {order.shippingAddress.fullName}
                  <br />
                  <strong>Address: </strong> {order.shippingAddress.address}
                  <br />
                  <strong>City:</strong> {order.shippingAddress.city} <br />
                  <strong>State:</strong> {order.shippingAddress.states} <br />
                  <strong>Postal Code:</strong>{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  <strong>Country:</strong> {order.shippingAddress.country}
                </text>
              </Card.Text>
              {order.isShipped ? (
                <MessageBox variant='success'>
                  Shipped On{' '}
                  {new Date(order.shippedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                  })}
                </MessageBox>
              ) : (
                <MessageBox variant='danger'>Not Shipped</MessageBox>
              )}
            </Card.Body>
          </Card>

          {/* Payment Details */}
          <Card className='box'>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant='success'>
                  Paid at{' '}
                  {new Date(order.paidAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                  })}
                </MessageBox>
              ) : (
                <MessageBox variant='danger'>Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card className='box'>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity</Col>
                    <Col>
                      {/* Calculate and display the total quantity of all items */}
                      {order.orderItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* Items Price */}
                <ListGroup.Item>
                  <Row>
                    <Col>Order Price</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                {/* Shipping Price */}
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                {/* Tax Price */}
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                {/* Order Total */}
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* PayPal Payment Buttons */}
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PaymentMethod) select radial button for PayPal or Stripe
// step 4 (PlaceOrder)
// lands on (OrderDetails) for payment <= LAST STEP
