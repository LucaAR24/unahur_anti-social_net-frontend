import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function MyNavbar() {
  const auth = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          UnaHur Anti-Social Net
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          {auth?.user && (
            <>
              <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
              <Nav.Link as={Link} to="/nueva-publicacion">Nueva Publicación</Nav.Link>
            </>
          )}
        </Nav>
        <Nav>
          {!auth?.user ? (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/registro">Registro</Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={auth.logout}>Cerrar sesión</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;