import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Product from './pages/Product';
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import BottomFooter from './components/BottomFooter';
import Footer from './components/Footer';
import Signin from './pages/Signin';
import Cart from './pages/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentMethod from './pages/PaymentMethod';
import ShippingAddress from './pages/ShippingAddress';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetails from './pages/OrderDetails';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <ToastContainer />
      <main className='mt-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:slug' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/payment' element={<PaymentMethod />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/order/:id' element={<OrderDetails />} />
          <Route path='/orderhistory' element={<OrderHistory />} />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
