import { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getPublicacionesByUsuarioId, deletePublicacion } from '../services/api';
import { getLikedPublicaciones, addLikedPublicacion, removeLikedPublicacion } from '../services/likedPosts';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const auth = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [headerLoaded, setHeaderLoaded] = useState(false);
  const navigate = useNavigate();
  const userId = auth.user?.id ? String(auth.user.id) : undefined;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userId) {
          const res = await getPublicacionesByUsuarioId(userId);
          const likedPosts = getLikedPublicaciones(userId);
          const normalizedPosts = res.data.map((post: any) => {
            const id = post._id ?? post.id;
            const liked = id ? likedPosts.includes(id) : false;
            return {
              ...post,
              liked,
              likes: Math.max(0, (post.likes ?? 0) + (liked ? 1 : 0)),
            };
          });
          setPosts(normalizedPosts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    setHeaderLoaded(true);
  }, []);

  const toggleLike = (postId: string) => {
    if (!auth.user) return;
    const currentUserId = String(auth.user.id);

    setPosts((prev) =>
      prev.map((post) => {
        const id = post._id ?? post.id;
        if (id !== postId) return post;
        const liked = !post.liked;
        if (liked) addLikedPublicacion(id, currentUserId);
        else removeLikedPublicacion(id, currentUserId);
        return {
          ...post,
          liked,
          likes: Math.max(0, (post.likes ?? 0) + (liked ? 1 : -1)),
        };
      })
    );
  };

  const handleCreatePublicacion = () => {
    navigate('/nueva-publicacion');
  };

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPostId) return;
    setDeleting(true);
    setDeleteError('');

    try {
      await deletePublicacion(selectedPostId);
      setPosts(posts.filter(post => (post._id ?? post.id) !== selectedPostId));
      setShowDeleteModal(false);
      setSelectedPostId(null);
    } catch (err: any) {
      console.error('Error al eliminar publicación:', err);
      setDeleteError(err?.response?.data?.message || 'No se pudo eliminar la publicación');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <div
        className="perfil-header mb-4 text-center"
        style={{
          transform: headerLoaded ? 'translateY(0) scale(1)' : 'translateY(-30px) scale(0.85)',
          opacity: headerLoaded ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
        }}
      >
        <h2 className="perfil-header-title">
          Bienvenidx, {auth?.user?.nickname}
        </h2>
      </div>
      <div className="perfil-actions d-flex justify-content-center mb-4">
        <Button variant="primary" onClick={handleCreatePublicacion}>
          Crear publicación
        </Button>
      </div>
      {posts.length > 0 ? (
        posts.map((post) => {
          const postId = post._id ?? post.id;
          return (
            <Card key={postId} className="mb-3">
              <Card.Body>
                <Card.Title>{post.titulo}</Card.Title>
                <Card.Text>{post.contenido}</Card.Text>
                <Card.Text>
                    {post.tags?.map((tag:any)=>(
                        <Badge
                          bg="light"
                          text="dark"
                          className="me-1"
                          style={{ border: '1px solid #dee2e6' }}
                          key={tag._id ?? tag.tag}
                        >
                            #{tag.tag}
                        </Badge>
                    ))}
                </Card.Text>
                <div className="perfil-card-meta post-action-group d-flex justify-content-between align-items-center mb-2 flex-wrap">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    onClick={() => navigate(`/post/${postId}`)}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        border: '1px solid currentColor',
                        borderRadius: '4px',
                      }}
                    >
                      →
                    </span>
                    Ver post
                  </Button>
                  <div className="d-flex align-items-center gap-3">
                    <Button
                      variant="link"
                      className={`p-0 ${post.liked ? 'text-danger' : 'text-muted'}`}
                      onClick={() => toggleLike(postId)}
                      style={{ textDecoration: 'none' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>
                        {post.liked ? '❤️' : '🤍'}
                      </span>
                    </Button>
                    <span style={{ fontWeight: 600 }}>{post.likes ?? 0}</span>
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
                      💬 {post.comentarios?.length ?? 0}
                    </span>
                  </div>
                </div>
                <Button variant="danger" size="sm" className="ms-auto" onClick={() => handleDeleteClick(postId)}>
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No tenés publicaciones todavía.</p>
      )}

      {deleteError && <div className="text-danger mb-3">{deleteError}</div>}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta publicación?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Perfil;
