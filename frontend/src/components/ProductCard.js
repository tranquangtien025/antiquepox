import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import LazyLoad from 'react-lazyload';

function ProductCard(props) {
  const { product } = props;
  return (
    // Render a Card component to display product information
    <Card>
      {/* Create a Link to navigate to the product details page when the image is clicked */}
      <Link to={`/product/${product.slug}`}>
        <LazyLoad>
          <img
            src={product.image}
            className='card-img-top'
            alt={product.name}
            loading='lazy'
          />
        </LazyLoad>
      </Link>
      {/* Card body contains details of the product */}
      <Card.Body>
        {/* Create a Link to navigate to the product details page when the product name is clicked */}
        <Link to={`/product/${product.slug}`}>
          {/* Display the product name as the Card Title */}
          <Card.Title>{product.name}</Card.Title>
          {/* Display additional product details like 'Made In' and 'Finish' */}
          <Card.Title>Made In: {product.madeIn}</Card.Title>
          <Card.Title>Finish: {product.finish}</Card.Title>
        </Link>
        {/* Display the product rating and number of reviews using the Rating component */}
        <Rating rating={product.rating} numReviews={product.numReviews} />
        {/* Display the product price */}
        <Card.Text>${product.price}</Card.Text>
        {/* Add a button to allow users to add the product to the cart */}
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
