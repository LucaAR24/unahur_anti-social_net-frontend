import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Container, Spinner, ListGroup, Badge, Form, Button, Alert, Modal } from 'react-bootstrap';
import { getPublicacionById, createComentario, deleteComentario } from '../services/api';
import { hasLikedPublicacion, addLikedPublicacion, removeLikedPublicacion } from '../services/likedPosts';
import { useAuth } from '../context/AuthContext';

function PublicacionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth.user?.id ? String(auth.user.id) : undefined;
  const [publicacion, setPublicacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState(false);
  const successTimeoutRef = useRef<number | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publicacionRes = await getPublicacionById(id!);
        const baseLikes = publicacionRes.data.likes ?? 0;
        const alreadyLiked = id && userId ? hasLikedPublicacion(id, userId) : false;

        setPublicacion(publicacionRes.data);
        setLiked(alreadyLiked);
        setLikes(baseLikes + (alreadyLiked ? 1 : 0));
      } catch (err: any) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, userId]);

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!auth.user?.id) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }
    if (!nuevoComentario || nuevoComentario.trim() === '') {
      setError('El comentario no puede estar vacío.');
      return;
    }

    try {
      setSubmittingComment(true);
      const res = await createComentario(id!, {
        contenido: nuevoComentario.trim(),
        usuarioId: String(auth.user.usuarioId),
      });

      if (res.status === 201 || res.status === 200) {
        setPublicacion((prev: any) => ({
          ...prev,
          comentarios: [...(prev.comentarios ?? []), res.data],
        }));
        setNuevoComentario('');
        setSuccess('Comentario agregado con éxito');
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = window.setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || 'No se pudo agregar el comentario');
    }
      setSubmittingComment(false);
  };

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteComentario = async (comentarioId: string) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }
    if (!id) return;

    try {
      await deleteComentario(id, comentarioId);
      setPublicacion((prev: any) => ({
        ...prev,
        comentarios: (prev.comentarios ?? []).filter((c: any) => (c._id ?? c.id) !== comentarioId),
      }));
    } catch (err: any) {
      console.error('Error al eliminar comentario', err);
    }
  };

  const openDeleteModal = (comentarioId: string) => {
    setCommentToDelete(comentarioId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    setDeletingComment(true);
    try {
      await handleDeleteComentario(commentToDelete);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } finally {
      setDeletingComment(false);
    }
  };

  const toggleLike = () => {
    if (!auth.user) {
      navigate('/login');
      return;
    }
    if (!id) return;

    const currentUserId = String(auth.user.id);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    if (nextLiked) {
      addLikedPublicacion(id, currentUserId);
    } else {
      removeLikedPublicacion(id, currentUserId);
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
              {publicacion.comentarios?.map((comentario: any) => {
                const commentId = comentario.id ?? comentario._id;
                const commentUserId = comentario.usuarioId?._id ?? comentario.usuarioId?.id ?? comentario.usuarioId;
                const currentUserId = auth.user ? (auth.user.usuarioId ?? auth.user.id) : undefined;
                const isOwner = currentUserId && String(currentUserId) === String(commentUserId);

                return (
                  <ListGroup.Item key={commentId} className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{comentario.usuarioId?.nickname ?? 'Anónimo'}</strong>
                      <br />
                      {comentario.contenido}
                    </div>
                    {isOwner && (
                      <div>
                        <Button variant="outline-danger" size="sm" onClick={() => openDeleteModal(commentId)}>
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Eliminar comentario</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Estás seguro de que deseas eliminar este comentario?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deletingComment}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={confirmDelete} disabled={deletingComment}>
                  {deletingComment ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </Modal.Footer>
            </Modal>

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
                <Button
                  type="submit"
                  variant="primary"
                  className="py-2"
                  disabled={submittingComment || nuevoComentario.trim().length === 0}
                >
                  {submittingComment ? 'Enviando...' : 'Comentar'}
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
