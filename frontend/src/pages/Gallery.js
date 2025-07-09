import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

// Gallery component that displays a collection of products
export default function Gallery() {
  // State to hold the products data
  const [products, setProducts] = useState([]);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Fetch data from the server using axios
    const fetchData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const result = await axios.get(`${baseUrl}/api/products`);
        // Update the state with the fetched data
        setProducts(result.data);
      } catch (error) {
        // Handle errors if any
        console.error('Error fetching data:', error.message);
      }
    };
    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <div className='content'>
        <Helmet>
          <title>Gallery</title>
        </Helmet>
        <br />
        <h1 className='box'>Gallery</h1>
        <Row>
          <Col>
            <div className='products'>
              {/* Map through the products and render each product */}
              {products.map((product) => (
                <div className='product' key={product.slug}>
                  {/* Link to the individual product page */}
                  <Link to={`/product/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className='product-info'>
                    {/* Link to the individual product page */}
                    <Link to={`/product/${product.slug}`}>
                      <p>{product.name}</p>
                    </Link>
                    {/* <p>
                    <strong>${product.price}</strong>
                  </p>
                  <button>Add to cart</button> */}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
