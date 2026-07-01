import axios from 'axios';

const API_URL = 'http://localhost:5000';

//Usuarios
const getUsuarios = () => axios.get(`${API_URL}/usuarios`);
const createUsuario = (body: { nickname: string, email: string, password: string }) =>
  axios.post(`${API_URL}/usuarios`, body);

//Publicaciones
const getPublicaciones = () => axios.get(`${API_URL}/publicaciones`);
const getPublicacionById = (id: string) =>
  axios.get(`${API_URL}/publicaciones/${id}`);

const createPublicacion = (
  usuarioId: string,
  body: { titulo: string; contenido: string }
) => axios.post(`${API_URL}/usuarios/${usuarioId}/publicaciones`, body);

const getPublicacionesByUsuarioId = (usuarioId: string) =>
  axios.get(`${API_URL}/usuarios/${usuarioId}/publicaciones`);

//Comentarios
const createComentario = (publicacionId: string, data: { contenido: string, usuarioId: string }) =>
  axios.post(`${API_URL}/publicaciones/${publicacionId}/comentarios`, data);

const getComentariosByPublicacionId = (publicacionId: string) =>
  axios.get(`${API_URL}/publicaciones/${publicacionId}/comentarios`);

//Imagenes
const createImagen = (publicacionId: string, data: { url: string; descripcion?: string }) =>
  axios.post(`${API_URL}/publicaciones/${publicacionId}/imagenes`, data);

//Tags
const createOrAddTagToPublicacion = (publicacionId: string, tag: string) =>
  axios.post(`${API_URL}/publicaciones/${publicacionId}/tags`, { tag });

export { getUsuarios, createUsuario, getPublicaciones, getPublicacionById, createComentario, createPublicacion, getPublicacionesByUsuarioId, getComentariosByPublicacionId, createImagen, createOrAddTagToPublicacion };