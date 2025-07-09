// Rating component that displays stars based on the given rating and the number of reviews
function Rating(props) {
  // Destructure rating and numReviews from props
  const { rating, numReviews } = props;

  // If rating is greater than or equal to 1, it displays a full star.
  // If rating is greater than or equal to 0.5 but less than 1, it displays a half star.

  return (
    // Container div with the 'rating' class to style the component
    <div className='rating'>
      {/* Individual spans for each star, using Font Awesome icons */}
      <span>
        <i
          className={
            // Determine the star icon based on the rating value
            rating >= 1
              ? 'fas fa-star'
              : rating >= 0.5 // 1/2 star
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 2
              ? 'fas fa-star'
              : rating >= 1.5 // 1 1/2 star
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 3
              ? 'fas fa-star'
              : rating >= 2.5 // 2 1/2 star
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 4
              ? 'fas fa-star'
              : rating >= 3.5 // 3 1/2 star
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 5
              ? 'fas fa-star'
              : rating >= 4.5 // 4 1/2 star
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>

      {/* Display the number of reviews */}
      <span> {numReviews} reviews</span>
    </div>
  );
}

// Export the Rating component as the default export
export default Rating;
