import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import PublicacionDetalle from './pages/PublicacionDetalle';
import NuevaPublicacion from './pages/NuevaPublicacion';
import MyNavbar from './components/Navbar';
import MyFooter from './components/Footer';
import { Container } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const auth = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (auth?.loading) {
    return <p>Cargando...</p>;
  }
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

  return (
    <div className="app-shell">
      <MyNavbar />
      <div className="app-content-wrapper">
        <main className="app-main">
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/post/:id" element={<PublicacionDetalle />} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/nueva-publicacion" element={<ProtectedRoute><NuevaPublicacion /></ProtectedRoute>} />
            </Routes>
          </Container>
        </main>
        <MyFooter />
      </div>
    </div>
  );
}

export default App;
