type StoredDraft<T> = { data: T; timestamp: number };

const EXPIRATION_MS = 1000 * 60 * 60 * 24;

export const saveTaskDraft = <T>(key: string, data: T) => {
  const payload: StoredDraft<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`task-draft/${key}`, JSON.stringify(payload));
};

export const getTaskDraft = <T>(key: string): T | null => {
  const raw = localStorage.getItem(`task-draft/${key}`);
  if (!raw) return null;
  
  try {
    const parsed: StoredDraft<T> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > EXPIRATION_MS) {
      clearTaskDraft(`task-draft/${key}`);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

export const clearTaskDraft = (key: string) => {
  localStorage.removeItem(`task-draft/${key}`);
};
