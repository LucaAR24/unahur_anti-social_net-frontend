import { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { getPublicaciones } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState<any[]>([]);
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

  if (loading) return <Spinner animation="border" />;
  return (
    <Container>
      <h2>Publicaciones recientes</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post._id} className="mb-3">
            <Card.Body>
              <Card.Title>{post.titulo}</Card.Title>
              <Card.Text>{post.contenido}</Card.Text>
              <Button variant="link" onClick={() => navigate(`/post/${post.id}`)}>
                Ver más
              </Button>
              <Card.Text>
                Comentarios: {post.comentarios?.length ?? 0}
              </Card.Text>
              <Card.Text>
                  Etiquetas:
                  {post.tags?.map((tag:any)=>(
                      <Badge bg="secondary" className="me-1" key={tag._id}>
                          {tag.tag}
                      </Badge>
                  ))}
              </Card.Text>
              {post.imagenes?.map((img: any) => (
                <Card.Img
                  key={img._id}
                  src={img.url}
                  alt={img.descripcion ?? 'Imagen de publicación'}
                />
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay publicaciones todavía.</p>
      )}
    </Container>
  );
}

export default Home;