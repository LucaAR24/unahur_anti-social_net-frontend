import { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createUsuario } from '../services/api';

function Registro() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    nickname?: string;
    email?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  const validateFields = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!nickname.trim()) {
      errors.nickname = 'El nombre de usuario es requerido';
    }
    if (!email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    if (!password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    if (!validateFields()) {
      return;
    }

    try {
      const res = await createUsuario({
        nickname: nickname,
        email: email,
        password: password,
      });
      if (res.status === 201) {
        setSuccess('Usuario creado con éxito');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ?? "Error al crear el usuario, refresca e intenta nuevamente.";
      
      // Check if it's a duplicate nickname error
      if (err.response?.status === 409 || errorMessage.includes('nickname')) {
        setFieldErrors(prev => ({
          ...prev,
          nickname: 'El nombre de usuario (nickname) ya existe'
        }));
      } else if (err.response?.status === 409 || errorMessage.includes('email')) {
        setFieldErrors(prev => ({
          ...prev,
          email: 'El email ya está registrado'
        }));
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Registro de Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
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
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.email}
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

        <Button variant="success" type="submit" className="w-100">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
}

export default Registro;