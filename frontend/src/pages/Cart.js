// Importing necessary dependencies and components
import React, { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
    // Initializing useNavigate hook for navigation
    const navigate = useNavigate();

    // Using useContext hook to access the global state and dispatch function from the Store context
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item, quantity) => {
        // Fetching additional data about the item from the server
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const { data } = await axios.get(`${baseUrl}/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    };

    return (
        <div className='content'>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <br />
            <h1 className='box'>Shopping Cart</h1>
            <Row>
                <Col md={8} className='box'>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to='/'>Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={4}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='img-fluid rounded img-thumbnail'
                                            ></img>{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            {/* Buttons for adjusting the quantity of items in the cart */}
                                            <Button
                                                onClick={() =>
                                                    updateCartHandler(item, item.quantity - 1)
                                                }
                                                variant='light'
                                                disabled={item.quantity === 1}
                                            >
                                                <i className='fas fa-minus-circle'></i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            <Button
                                                variant='light'
                                                onClick={() =>
                                                    updateCartHandler(item, item.quantity + 1)
                                                }
                                                disabled={item.quantity === item.countInStock}
                                            >
                                                <i className='fas fa-plus-circle'></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button
                                                onClick={() => removeItemHandler(item)}
                                                variant='light'
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button
                                            type='button'
                                            variant='primary'
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

// step 1 (Cart) <= CURRENT STEP
// step 2 (ShippingAddress2Screen)
// step 3 (PaymentMethod) select radial button for PayPal or Stripe
// step 4 (PlaceOrder)
// lands on (Order) for payment
