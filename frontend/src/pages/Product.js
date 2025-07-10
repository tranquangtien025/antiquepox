// Importing necessary dependencies from external libraries
import axios from 'axios';
import { useEffect, useReducer, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

// Reducer function to handle state changes based on different actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Functional component for displaying product details
export default function Product() {
  // Initializing necessary hooks and variables
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  // State and dispatch for handling product data, loading, and errors
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  // Effect hook to fetch product data based on the slug parameter
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const result = await axios.get(`${baseUrl}/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // Context hook to access global state and dispatch function
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  // Handler function to add the product to the cart
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { data } = await axios.get(`${baseUrl}/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  // Rendering different components based on loading and error states
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div className='content'>
      <br />
      <div className='box'>
        <Row>
          {/* Introduction paragraph */}
          <p className='mt-3'>
            ~ Explore a meticulously curated collection where each item has been
            thoughtfully chosen over the years. Our exclusive range features
            unique and timeless pieces that beautifully capture the essence of
            history. Driven by our unwavering passion for antiques, we embark on
            a continuous quest for treasures, each with its own captivating
            story. Every item is lovingly handpicked, ensuring not only
            exceptional quality but also enduring value. Immerse yourself in a
            world of carefully selected artifacts that stand as a testament to
            our commitment to bringing you the very best in every piece. ~
          </p>
        </Row>
      </div>
      <br />
      <Row>
        <Col md={6}>
          {/* Displaying product image */}
          <img
            className='img-large'
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={6}>
          {/* Product details list */}
          <ListGroup variant='flush'>
            <ListGroup.Item>
              {/* Setting the title of the page dynamically */}
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              {/* Displaying product name */}
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              {/* Displaying product rating using the Rating component */}
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>From : {product.from}</ListGroup.Item>
            <ListGroup.Item>Finish : {product.finish}</ListGroup.Item>
            <ListGroup.Item>
              {/* Displaying product description */}
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>

          <br />

          {/* Card for additional product details */}
          <Card>
            <Card.Body>
              {/* List of details such as price, status, and add to cart button */}
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {/* Displaying product availability status */}
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>In Stock</Badge>
                      ) : (
                        <Badge bg='danger'>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Add to cart button, displayed only if product is in stock */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button onClick={addToCartHandler} variant='primary'>
                        Add to Cart
                      </Button>
                    </div>
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
