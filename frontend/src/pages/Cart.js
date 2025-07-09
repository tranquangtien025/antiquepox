// Importing necessary dependencies and components
import React, { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Functional component for the shopping cart page
export default function Cart() {
    // Initializing useNavigate hook for navigation
    const navigate = useNavigate();

    // Using useContext hook to access the global state and dispatch function from the Store context
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    // Async function to update the quantity of items in the cart
    const updateCartHandler = async (item, quantity) => {
        // Fetching additional data about the item from the server
        const { data } = await axios.get(`/api/products/${item._id}`);
        // Checking if the item is in stock
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        // Dispatching an action to update the cart with the new quantity
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    // Function to remove an item from the cart
    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    // Function to handle checkout, redirects to the signin page with a redirect parameter
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
                        // Displaying a message if the cart is empty
                        <MessageBox>
                            Cart is empty. <Link to='/'>Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        // Displaying the list of items in the cart
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={4}>
                                            {/* Displaying item image and name with a link to the product page */}
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
                                            {/* Button to remove the item from the cart */}
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
                    {/* Card displaying subtotal and checkout button */}
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    {/* Displaying the subtotal of the items in the cart */}
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {/* Checkout button */}
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
