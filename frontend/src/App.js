import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Product from './Pages/Product';
import ProductCategory from './Pages/ProductCategory';
import About from './Pages/About';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import BottomBar from './Components/BottomBar/BottomBar';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/brownies' element={<ProductCategory category="brownies" />} />
          <Route path='/cookies' element={<ProductCategory category="cookies" />} />
          <Route path='/about' element={<About />} />
          <Route path='/product' element={<Product />} >
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
        <BottomBar />
      </BrowserRouter>
    </div>
  );
}

export default App;
