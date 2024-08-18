import { Episode } from "~/tvsm";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => any;

export type KeysDeep<T> = T extends object ? {
  [K in keyof T]: T[K] extends Fn ? never : K | (
    T[K] extends Option<infer O> ? KeysDeep<O> : KeysDeep<T[K]>
  );
}[keyof T] : never;

export function getDeep<T>(data: T, ...keys: KeysDeep<T>[]) {
  let v = data;
  for (let i = 0; i < keys.length; i++) {
    v = v[keys[i] as keyof T] as T;
    if (v == null) {
      return v;
    }
  }
  return v as T[keyof T];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "2-digit",
});

const NA = "N/A";

export function formatDate(date: Option<Date>): string {
  return date ? dateFormatter.format(date) : NA;
}

export function formatOption<T>(thing: Option<T>): T | string {
  return thing ? thing : NA;
}

export function padNum(n: number, len: number) {
  return n.toString().padStart(len, "0");
}

export function formatEp<T>(ep: Option<Episode>): T | string {
  return ep ? `S${padNum(ep.season, 2)}E${padNum(ep.number, 2)}` : NA;
}
