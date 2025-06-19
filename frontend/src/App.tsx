import './styles/App.css'
import './styles/Pages.css'
import './styles/themes.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { UserProvider } from './state/User/UserContext'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { ServicesPage } from './pages/ServicesPage'
import { AdminPage } from './pages/AdminPage'
import { LoginPage } from './pages/LoginPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
