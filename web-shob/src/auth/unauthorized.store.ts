let unauthorized = false;
const listeners = new Set<() => void>();

export const reportUnauthorized = () => {
  if (unauthorized) return;

  unauthorized = true;
  listeners.forEach((listener) => {
    listener();
  });
};

export const isUnauthorized = () => unauthorized;

export const subscribeUnauthorized = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
