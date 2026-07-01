import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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

  const addTag = () => {
    const normalizedTag = tagInput.trim();

    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags((prev) => [...prev, normalizedTag]);
    }

    setTagInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!auth.user?.usuarioId) {
      setError('Debes iniciar sesión para publicar.');
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
        <Form.Control value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contenido</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
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
            <span key={tag} className="badge bg-secondary">
              #{tag}
            </span>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Imágenes (URL)</Form.Label>
        <Form.Control
          placeholder="https://..."
          onBlur={(e) => {
            if (e.target.value) {
              setImagenes([...imagenes, { url: e.target.value }]);
              e.target.value = '';
            }
          }}
        />
        <ul>
          {imagenes.map((img, i) => (
            <li key={i}>{img.url}</li>
          ))}
        </ul>
      </Form.Group>

      <Button type="submit" variant="primary">Publicar</Button>
    </Form>
  );
}

export default NuevaPublicacion;