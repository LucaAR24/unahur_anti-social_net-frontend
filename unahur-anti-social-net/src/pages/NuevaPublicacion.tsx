import { useState } from 'react';
import { Form, Button, Alert, Badge, ListGroup, Image, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { createPublicacion, createImagen, createOrAddTagToPublicacion } from '../services/api';

function NuevaPublicacion() {
  const auth = useAuth();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<{ url: string; descripcion?: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validated, setValidated] = useState(false);
  const [imageInput, setImageInput] = useState('');

  const addTag = () => {
    const normalizedTag = tagInput.trim();

    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags((prev) => [...prev, normalizedTag]);
    }

    setTagInput('');
  };

  const removeImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidated(true);

    if (!auth.user?.usuarioId) {
      setError('Debes iniciar sesión para publicar.');
      return;
    }

    if (!titulo.trim() || !contenido.trim()) {
      setError('Por favor completa el título y el contenido.');
      return;
    }

    try {
      // 1. Crear la publicación sin enviar tags directamente
      const pubRes = await createPublicacion(String(auth.user.usuarioId), {
        titulo,
        contenido,
      });

      const publicacionId = pubRes.data.id;

      // 2. Agregar cada etiqueta al publicar
      for (const tag of tags) {
        await createOrAddTagToPublicacion(publicacionId, tag);
      }

      // 3. Crear imágenes asociadas
      for (const img of imagenes) {
        await createImagen(publicacionId, img);
      }

      setSuccess('Publicación creada con éxito');
      setTitulo('');
      setContenido('');
      setTagInput('');
      setTags([]);
      setImagenes([]);
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || 'No se pudo crear la publicación');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          isInvalid={validated && !titulo.trim()}
          placeholder="Escribe un título"
        />
        <Form.Control.Feedback type="invalid">El título es obligatorio.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contenido</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          isInvalid={validated && !contenido.trim()}
          placeholder="Escribe el contenido de la publicación"
        />
        <Form.Control.Feedback type="invalid">El contenido es obligatorio.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Etiquetas</Form.Label>
        <Form.Control
          placeholder="Escribe una etiqueta y presiona Enter o coma"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === ',' || e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
        />
        <div className="mt-2 d-flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge bg="secondary" key={tag} className="me-1">#{tag}</Badge>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Imágenes (URL)</Form.Label>
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="https://..."
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (imageInput.trim()) {
                  setImagenes((prev) => [...prev, { url: imageInput.trim() }]);
                  setImageInput('');
                }
              }
            }}
          />
          <Button
            variant="outline-secondary"
            onClick={() => {
              if (imageInput.trim()) {
                setImagenes((prev) => [...prev, { url: imageInput.trim() }]);
                setImageInput('');
              }
            }}
          >Agregar</Button>
        </InputGroup>

        {imagenes.length > 0 && (
          <ListGroup>
            {imagenes.map((img, i) => (
              <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <Image src={img.url} alt={img.descripcion ?? 'Imagen'} rounded style={{ width: 64, height: 48, objectFit: 'cover' }} />
                  <div style={{ wordBreak: 'break-all' }}>{img.url}</div>
                </div>
                <Button size="sm" variant="outline-danger" onClick={() => removeImage(i)}>Eliminar</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>

      <Button type="submit" variant="primary">Publicar</Button>
    </Form>
  );
}

export default NuevaPublicacion;