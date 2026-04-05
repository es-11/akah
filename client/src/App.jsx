import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ConfirmationPage from './pages/ConfirmationPage';
import TrackOrder from './pages/TrackOrder';
import BranchDashboard from './pages/BranchDashboard';
import AdminPanel from './pages/AdminPanel';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <div className="min-h-screen font-cairo">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />
              <Route path="/branch-dashboard" element={<BranchDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
