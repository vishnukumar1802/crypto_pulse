import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketProvider } from './contexts/MarketContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Learn from './pages/Learn';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <MarketProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/coin/:id" element={<CoinDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/learn" element={<Learn />} />

                <Route path="/watchlist" element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                } />

                <Route path="/portfolio" element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </MarketProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
