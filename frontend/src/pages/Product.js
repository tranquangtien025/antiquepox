import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';

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

// Main functional component for displaying product details
export default function ProductMag() {
  // Extracting slug from URL params
  const params = useParams();
  const { slug } = params;

  // Initializing state using useReducer hook
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  // Fetching product data from API using useEffect hook
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        // Making API call to retrieve product details based on slug
        const result = await axios.get(`${baseUrl}/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        // Handling error if API call fails
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    // Calling fetchData function on component mount with dependency on slug
    fetchData();
  }, [slug]);

  // Rendering content based on loading and error states
  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    // Displaying product details if data is successfully fetched
    <div className='content'>
      <br />
      <div className='box'>
        <Row>
          <p className='mt-3'>
            ~ All of the products are hand picked over many years. ~
          </p>
        </Row>
      </div>
      <br />
      <Row>
        {/* Displaying product image */}
        <Col md={6}>
          <img
            className='img-large'
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={6}>
          {/* Displaying product details using ListGroup */}
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
              {/* Displaying product rating using Rating component */}
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

          {/* Displaying additional product details in a Card */}
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  {/* Displaying product price */}
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* Displaying product availability status */}
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>In Stock</Badge>
                      ) : (
                        //  turnery operator, condition ? expression_if_true : expression_if_false;
                        <Badge bg='danger'>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Displaying 'Add to Cart' button if product is in stock */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button variant='primary'>Add to Cart</Button>
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
