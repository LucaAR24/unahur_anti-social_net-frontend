import { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { getPublicaciones } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPublicaciones();
        console.log(res.data);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        const id = post._id ?? post.id;
        if (id !== postId) return post;
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: Math.max(0, (post.likes ?? 0) + (liked ? 1 : -1)),
        };
      })
    );
  };

  const filteredPosts = posts.filter((post) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const title = post.titulo?.toLowerCase() ?? '';
    const content = post.contenido?.toLowerCase() ?? '';
    const tags = (post.tags ?? []).map((tag: any) => (tag.tag ?? '').toLowerCase());
    return (
      title.includes(term) ||
      content.includes(term) ||
      tags.some((tag: string) => tag.includes(term))
    );
  });

  if (loading) return <Spinner animation="border" />;
  return (
    <Container>
      <h2>Publicaciones recientes</h2>

      <Form.Group className="mb-3">
        <Form.Label>Buscar publicaciones</Form.Label>
        <Form.Control
          type="text"
          placeholder="Buscar título, contenido o etiqueta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => {
          const postId = post._id ?? post.id;
          const author = post.usuarioId?.nickname ?? post.usuarioId ?? 'Anónimo';
          return (
            <Card key={postId} className="mb-3">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">
                  Publicado por @{author}
                </Card.Subtitle>
                <Card.Title>{post.titulo}</Card.Title>
                <Card.Text>{post.contenido}</Card.Text>
                <Card.Text>
                  {post.tags?.map((tag: any) => (
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
                {post.imagenes?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {post.imagenes?.map((img: any) => (
                      <Card.Img
                        key={img._id}
                        src={img.url}
                        alt={img.descripcion ?? 'Imagen de publicación'}
                        style={{
                          width: post.imagenes.length > 1 ? 'calc(50% - 0.5rem)' : '220px',
                          maxHeight: '180px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mb-2">
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
                  <div className="post-action-group d-flex align-items-center gap-3 flex-wrap">
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
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No hay publicaciones con esa etiqueta.</p>
      )}
    </Container>
  );
}

export default Home;