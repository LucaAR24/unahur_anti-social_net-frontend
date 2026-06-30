import { useEffect, useState, useContext } from 'react';
import { Container, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getPublicacionesByUsuarioId } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = auth?.user?.id;
        if (userId) {
          const res = await getPublicacionesByUsuarioId(String(userId));
          setPosts(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [auth?.user]);

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <h2>Perfil de {auth?.user?.nickname}</h2>
      <Button variant="secondary" className="mb-3" onClick={handleLogout}>
        Cerrar sesión
      </Button>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post._id} className="mb-3">
            <Card.Body>
              <Card.Title>{post.titulo}</Card.Title>
              <Card.Text>{post.contenido}</Card.Text>
              <Card.Text>
                  Etiquetas:
                  {post.tags?.map((tag:any)=>(
                      <Badge bg="secondary" className="me-1" key={tag._id}>
                          {tag.tag}
                      </Badge>
                  ))}
              </Card.Text>
              <Button variant="link" onClick={() => navigate(`/post/${post.id}`)}>
                Ver más
              </Button>
              <Card.Text>
                Comentarios: {post.comentarios?.length ?? 0}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No tenés publicaciones todavía.</p>
      )}
    </Container>
  );
}

export default Perfil;
