import { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

// Functional component for the site header
const Header = () => {
  // Accessing state and dispatch function from the global context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Handler for user signout
  const signoutHandler = () => {
    // Dispatching an action to sign out the user
    ctxDispatch({ type: 'USER_SIGNOUT' });
    // Removing user information from local storage
    localStorage.removeItem('userInfo');
  };

  return (
    <header>
      <Navbar className='header' variant='dark' expand='lg'>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <img src='./images/logo2.png' className='logo' alt='logo'></img>
            {/* <i className='fas fa-store'></i> Oldneit */}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          {/* Navigation links aligned to the right */}
          <Nav className='mr-auto  w-100  justify-content-end'>
            <NavDropdown title='About Us' id='basic-nav-dropdown'>
              <NavDropdown.Item href='/about'>About Us</NavDropdown.Item>
              <NavDropdown.Item href='/contact'>Contact Us</NavDropdown.Item>
              <NavDropdown.Item href='/design'>Design</NavDropdown.Item>
            </NavDropdown>

            {/* Conditional rendering based on userInfo */}
            {userInfo ? (
              // If userInfo is available
              <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                {/* Dropdown links for user profile and order history */}
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/orderhistory'>
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                {/* Divider line in the dropdown */}
                <NavDropdown.Divider />
                {/* Link to sign out */}
                <Link
                  className='dropdown-item'
                  to='#signout'
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              // If userInfo is not available, link to Sign In page
              <Link className='nav-link' to='/signin'>
                <i class='fas fa-sign-in-alt'></i> Sign In
              </Link>
            )}
            {/* Link to Cart page with a badge showing item count */}
            <Link to='/cart' className='nav-link'>
              <i className='fa fa-shopping-cart'></i> Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg='danger'>
                  {/* Dynamically update the cart item count */}
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
