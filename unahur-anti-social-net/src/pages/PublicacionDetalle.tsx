import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Spinner, ListGroup, Badge, Form, Button, Alert } from 'react-bootstrap';
import { getPublicacionById, createComentario } from '../services/api';
import { useAuth } from '../context/AuthContext';

function PublicacionDetalle() {
  const { id } = useParams();
  const auth = useAuth();
  const [publicacion, setPublicacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publicacionRes = await getPublicacionById(id!);

        setPublicacion(publicacionRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!auth.user?.id) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }

    try {
      const res = await createComentario(id!, {
        contenido: nuevoComentario,
        usuarioId: String(auth.user.usuarioId),
      });


      if (res.status === 201 || res.status === 200) {
        // Actualizar la publicación con el nuevo comentario
        setPublicacion((prev: any) => ({
          ...prev,
          comentarios: [...(prev.comentarios ?? []), res.data],
        }));
        setNuevoComentario('');
        setSuccess('Comentario agregado con éxito');
      }
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || 'No se pudo agregar el comentario');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      {publicacion ? (
        <Card>
          <Card.Body>
            <Card.Title>{publicacion.titulo}</Card.Title>
            <Card.Text>{publicacion.contenido}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              Usuario: {publicacion.usuarioId.nickname}
            </Card.Subtitle>

            {publicacion.imagenes?.map((img: any) => (
              <Card.Img
                key={img._id}
                src={img.url}
                alt={img.descripcion ?? 'Imagen de publicación'}
              />
            ))}

            <Card.Text>
              Etiquetas:
              {publicacion.tags?.map((tag: any) => (
                <Badge bg="secondary" className="me-1" key={tag._id}>
                  {tag.tag}
                </Badge>
              ))}
            </Card.Text>

            <Card.Title>Comentarios</Card.Title>
            <ListGroup className="mb-3">
              {publicacion.comentarios?.map((comentario: any) => (
                <ListGroup.Item key={comentario.id ?? comentario._id}>
                  <strong>{comentario.usuarioId?.nickname}</strong>
                  <br />
                  {comentario.contenido}
                </ListGroup.Item>
              ))}
            </ListGroup>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmitComentario}>
              <Form.Group className="mb-3">
                <Form.Label>Agregar comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Comentar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p>No se encontró la publicación</p>
      )}
    </Container>
  );
}

export default PublicacionDetalle;
