type Result<T> = {
  data: T,
} | {
  err: Error,
};

type Option<T> = T | null | undefined;
