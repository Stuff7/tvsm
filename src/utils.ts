export function debounced<T extends unknown[]>(fn: (...params: T) => void, ms = 0) {
  let timeoutID = -1;

  return Object.assign((...params: T) => {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn(...params), ms);
  }, {
    runNow(...params: T) {
      clearTimeout(timeoutID);
      fn(...params);
    },
  });
}
