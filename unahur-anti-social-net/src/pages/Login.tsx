import { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    nickname?: string;
    password?: string;
  }>({});
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const validateFields = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!nickname.trim()) {
      errors.nickname = 'El nombre de usuario es requerido';
    }
    if (!password.trim()) {
      errors.password = 'La contraseña es requerida';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateFields()) {
      return;
    }

    const success = await auth?.login(nickname, password);
    if (success) {
      navigate('/perfil');
    } else {
      setError('Usuario no encontrado o contraseña incorrecta');
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Iniciar Sesión</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            isInvalid={!!fieldErrors.nickname}
          />
          {fieldErrors.nickname && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.nickname}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.password}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        
        <Button variant="primary" type="submit" className="w-100">
          Entrar
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
