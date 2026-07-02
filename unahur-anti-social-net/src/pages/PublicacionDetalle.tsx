import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Container, Spinner, ListGroup, Badge, Form, Button, Alert } from 'react-bootstrap';
import { getPublicacionById, createComentario } from '../services/api';
import { useAuth } from '../context/AuthContext';

function PublicacionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [publicacion, setPublicacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publicacionRes = await getPublicacionById(id!);

        setPublicacion(publicacionRes.data);
        setLikes(publicacionRes.data.likes ?? 0);
      } catch (err: any) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikes((current) => Math.max(0, current + (next ? 1 : -1)));
      return next;
    });
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

            {publicacion.imagenes?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
                {publicacion.imagenes.map((img: any) => (
                  <Card.Img
                    key={img._id}
                    src={img.url}
                    alt={img.descripcion ?? 'Imagen de publicación'}
                    style={{
                      width: publicacion.imagenes.length > 1 ? 'calc(50% - 0.5rem)' : '320px',
                      maxHeight: '240px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                    }}
                  />
                ))}
              </div>
            )}

            <Card.Text>
              {publicacion.tags?.map((tag: any) => (
                <Badge
                  bg="light"
                  text="dark"
                  className="me-1"
                  style={{ border: '1px solid #dee2e6' }}
                  key={tag._id}
                >
                  #{tag.tag}
                </Badge>
              ))}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <div className="post-action-group d-flex align-items-center gap-3 flex-wrap">
                <Button
                  variant="link"
                  className={`p-0 ${liked ? 'text-danger' : 'text-muted'}`}
                  onClick={toggleLike}
                  style={{ textDecoration: 'none' }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {liked ? '❤️' : '🤍'}
                  </span>
                </Button>
                <span style={{ fontWeight: 600 }}>{likes}</span>
                <span
                  className="comment-count-badge"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#f1f3f5',
                    border: '1px solid #dee2e6',
                    borderRadius: '999px',
                    padding: '0.25rem 0.65rem',
                    color: '#495057',
                  }}
                >
                  💬 {publicacion.comentarios?.length ?? 0}
                </span>
              </div>
            </div>
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
              <div className="d-grid d-sm-flex justify-content-sm-end">
                <Button type="submit" variant="primary" className="py-2">
                  Comentar
                </Button>
              </div>
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
