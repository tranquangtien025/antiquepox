import React, { useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import logger from 'use-reducer-logger';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Jumbotron from '../components/Jumbotron';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const result = await axios.get(`${baseUrl}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='jumbotron1' alt='antiques'>
        <Jumbotron
          text={[
            'Antiques',
            'Art',
            'Collectibles',
            'Vintage Items',
            '@',
            'antiquepox.com',
          ]}
        />
      </div>

      <div className='content'>
        <Helmet>
          <title>Antiquepox</title>
        </Helmet>
        <br />
        <h1 className='box'>Featured Products</h1>
        <div className='box'>
          <p>
            ~ Explore our virtual antique haven! We take joy in curating an
            exclusive collection of unique and timeless pieces that capture the
            essence of history. Fueled by our passion for antiques, we
            tirelessly search for treasures with stories to tell. Each item is
            handpicked for its exceptional quality and enduring value. Welcome
            to a digital journey through the beauty of the past! ~
          </p>
        </div>
        <br />

        {/* Products section, product inside products */}
        <Row>
          <Col>
            {' '}
            <div className='products'>
              {loading ? (
                <LoadingBox />
              ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
              ) : (
                <Row>
                  {products.map((product) => (
                    // 4 col
                    // <Col
                    //   key={product.slug}
                    //   sm={6}
                    //   md={4}
                    //   lg={3}
                    //   className='mb-3'
                    // >

                    // 6 columns
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={3}
                      className='mb-3'
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
