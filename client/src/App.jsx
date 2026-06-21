import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import ScrollToTop from './Components/ScrollToTop.jsx';
import Lenis from 'lenis';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRoute from './Components/AdminPanel/AdminRoute';
import Home      from './Pages/Home.jsx';
import Login       from './Pages/Login.jsx';
import Collection from './Pages/Collection.jsx';
import Cart        from './Pages/Cart.jsx';
import Product     from './Pages/Product.jsx';
import Ingredients from './Pages/Ingredients.jsx';
import DashBoard   from './Pages/DashBoard.jsx';
import Ritual      from './Pages/Ritual.jsx';
import AdminDashBoard from './Pages/AdminDashBoard.jsx';
import OrderSuccess from './Pages/OrderSuccess.jsx';
import { useAuth } from './context/AuthContext';
import Loader from './Components/Loader';
import FloatingCart from './Components/FloatingCart.jsx';


// remove this later
function LoginRouteGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, isAdmin } = useAuth();
  const hasShownAlert = useRef(false);

  useEffect(() => {
    if (!token || !user) return;
    if (hasShownAlert.current) return;

    hasShownAlert.current = true;

    alert("Work in Progress");

    const previousPath = location.state?.from;

    if (previousPath) {
      navigate(previousPath, { replace: true });
      return;
    }

    navigate(isAdmin ? "/admin/dashboard" : "/dashboard", { replace: true });
  }, [token, user, isAdmin, navigate, location.state]);

  if (token && user) {
    return null;
  }

  return <Login />;
}
// till here


function AppRoutes() {
  const { loading } = useAuth();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FCFBF9' }}>
        <Loader />
      </div>
    );
  }
  
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/"                         element={<Home />} />
          {/* <Route path="/login"                    element={<Login />} />*/}
          <Route path="/login"                    element={<LoginRouteGuard />} />
          {/* Collection routes */}
          <Route path="/collection"               element={<Collection />} />
          <Route path="/collection/:category"     element={<Collection />} />
          {/* Individual product */}
          <Route path="/product/:slug"            element={<Product />} />
          <Route path="/cart"                     element={<Cart />} />
          <Route path="/ritual"                   element={<Ritual />} />
          <Route path="/ingredients"              element={<Ingredients />} />
  
          {/* Protected — redirects to /login if not authenticated */}
          <Route
              path="/dashboard/*"
              element={
                  <ProtectedRoute>
                      <DashBoard />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/orders/:orderId/success"
              element={
                  <ProtectedRoute>
                      <OrderSuccess />
                  </ProtectedRoute>
              }
          />
  
          {/* Admin Routes */}
  
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashBoard />
              </AdminRoute>
            }
          />
        </Routes>
        <FloatingCart />
      </>
  );
}

const App = () => (
  <Router>
    {/* AuthProvider wraps everything so any child can call useAuth() */}
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default App;
