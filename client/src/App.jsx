import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Collection from './Pages/Collection.jsx';
import Cart from './Pages/Cart.jsx';
import Product from './Pages/Product.jsx';
import Ingredients from './Pages/Ingredients.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import Ritual from './Pages/Ritual.jsx';

function AppRoutes() {

  return (
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/collection" element={<Collection />} />
        <Route path="/cart" element={ <Cart /> } />
        <Route path="/dashboard" element={ <DashBoard /> } />
        <Route path="/product" element={ <Product /> } />
        <Route path="/ritual" element={ <Ritual /> } />
        <Route path="/ingredients" elements={ <Ingredients /> } />
      </Routes>
  )
}

const App = () => {
  return(
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
