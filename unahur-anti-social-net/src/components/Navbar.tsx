import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function MyNavbar() {
  const auth = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    auth?.logout();
    setShowLogoutModal(false);
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <>
      <Modal show={showLogoutModal} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar bg="dark" variant="dark" expand="lg" className="top-nav d-lg-none">
        <Container>
          <Navbar.Brand as={Link} to="/">
            UnaHur Anti-Social Net
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="mobile-nav" />
          <Navbar.Collapse id="mobile-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              {auth?.user && (
                <>
                  <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
                  <Nav.Link as={Link} to="/nueva-publicacion">Crear publicación</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {!auth?.user ? (
                <>
                  <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                  <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={openLogoutModal}>Cerrar sesión</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <aside className="app-sidebar d-none d-lg-flex flex-column p-3 bg-dark text-white">
        <div className="mb-4 sidebar-brand">
          <Link to="/" className="text-white text-decoration-none">
            <h4 className="mb-1">UnaHur</h4>
            <div className="text-muted small">Anti-Social Net</div>
          </Link>
        </div>
        <Nav className="flex-column gap-2">
          <Nav.Link as={Link} to="/" className="text-white sidebar-link">
            Inicio
          </Nav.Link>
          {auth?.user && (
            <>
              <Nav.Link as={Link} to="/perfil" className="text-white sidebar-link">
                Perfil
              </Nav.Link>
              <Nav.Link as={Link} to="/nueva-publicacion" className="text-white sidebar-link">
                Crear publicación
              </Nav.Link>
            </>
          )}
          {!auth?.user ? (
            <>
              <Nav.Link as={Link} to="/login" className="text-white sidebar-link">
                Iniciar Sesión
              </Nav.Link>
              <Nav.Link as={Link} to="/registro" className="text-white sidebar-link">
                Registrarse
              </Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={openLogoutModal} className="text-white sidebar-link">
              Cerrar sesión
            </Nav.Link>
          )}
        </Nav>
      </aside>
    </>
  );
}

export default MyNavbar;