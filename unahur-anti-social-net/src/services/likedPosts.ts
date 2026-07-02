const STORAGE_KEY_PREFIX = 'likedPublicaciones';

const getStorageKey = (userId?: string) =>
  userId ? `${STORAGE_KEY_PREFIX}:${userId}` : STORAGE_KEY_PREFIX;

const readLikedPublicaciones = (userId?: string): string[] => {
  try {
    const saved = localStorage.getItem(getStorageKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const writeLikedPublicaciones = (ids: string[], userId?: string) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(ids));
};

export const getLikedPublicaciones = (userId?: string) => readLikedPublicaciones(userId);

export const hasLikedPublicacion = (id: string, userId?: string) =>
  readLikedPublicaciones(userId).includes(id);

export const addLikedPublicacion = (id: string, userId?: string) => {
  const liked = readLikedPublicaciones(userId);
  if (!liked.includes(id)) {
    liked.push(id);
    writeLikedPublicaciones(liked, userId);
  }
};

export const removeLikedPublicacion = (id: string, userId?: string) => {
  writeLikedPublicaciones(
    readLikedPublicaciones(userId).filter((postId) => postId !== id),
    userId
  );
};
