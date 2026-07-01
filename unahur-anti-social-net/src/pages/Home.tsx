import { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { getPublicaciones } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
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

  const uniqueTags = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag: any) => tag.tag).filter(Boolean) ?? []))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.some((tag: any) => tag.tag === selectedTag))
    : posts;

  if (loading) return <Spinner animation="border" />;
  return (
    <Container>
      <h2>Publicaciones recientes</h2>

      <Form.Group className="mb-3">
        <Form.Label>Filtrar por etiqueta</Form.Label>
        <Form.Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Todas</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
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
                {post.tags?.map((tag: any) => (
                  <Badge bg="secondary" className="me-1" key={tag._id ?? tag.tag}>
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
        <p>No hay publicaciones con esa etiqueta.</p>
      )}
    </Container>
  );
}

export default Home;