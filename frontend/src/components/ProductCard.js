import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';

function ProductCard(props) {
  // Destructuring props to get the 'product' object
  const { product } = props;

  // Using React context to access global state and dispatch function
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // Extracting cartItems from the global state
  const {
    cart: { cartItems },
  } = state;

  // Function to handle adding a product to the cart
  const addToCartHandler = async (item) => {
    // Check if the item already exists in the cart
    const existItem = cartItems.find((x) => x._id === product._id);

    // Calculate the quantity based on whether the item exists in the cart
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // Make an API request to get more details about the product
    // Note: axios.get returns a promise, and we use 'await' to wait for the promise to be resolved.
    // The resolved value (response data) is stored in the 'data' variable.
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { data } = await axios.get(`${baseUrl}/api/products/${item._id}`);

    // Check if the product is in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    // Dispatch an action to add the item to the cart
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    // toast notification
    toast.success(
      <div>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '50px', height: '50px', marginRight: '10px' }}
          loading='lazy'
        />
        <span>{product.name} added to cart</span>
      </div>,
      {
        position: 'top-center mt-3',
        autoClose: 2000, // Duration in milliseconds (2 second)
      }
    );
  };

  return (
    <Card>
      {/* Link to the ProductMag page */}
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <img
          src={product.image}
          className='card-img-top'
          alt={product.name}
          loading='lazy'
        />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: 'none', color: 'var(--dark)' }}
        >
          <Card.Title>{product.name}</Card.Title>
          <Card.Title>From: {product.from}</Card.Title>
          <Card.Title>Finish: {product.finish}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {/* Conditionally render a button based on product availability */}
        {product.countInStock === 0 ? (
          <Button variant='light' disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
