import { Episode } from "~/tvsm";

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function circularClamp(value: number, arr: unknown[]) {
  if (value >= arr.length) {
    return value - arr.length;
  }

  if (value < 0) {
    return arr.length + value;
  }

  return value;
}

export function syncFrame<T>(fn: () => T) {
  return new Promise<T>(res => {
    requestAnimationFrame(async () => {
      res(await fn());
    });
  });
}

export function delayCall<T>(fn: () => T, delay = 300) {
  return new Promise(res => setTimeout(async () => res(await fn()), delay));
}

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

export function optionCmp<T>(a: Option<T>, b: Option<T>, reverse = false) {
  if (a === b) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  const ret = a < b ? -1 : 1;
  return reverse ? -ret : ret;
}

export function isAnyInputFocused() {
  const activeElement = document.activeElement;

  if (!activeElement) {
    return false;
  }

  if (activeElement instanceof HTMLInputElement) {
    return isTextInput(activeElement.type);
  }

  if (activeElement instanceof HTMLTextAreaElement) {
    return true;
  }

  if (activeElement instanceof HTMLSelectElement) {
    return true;
  }

  if (activeElement instanceof HTMLElement && activeElement.isContentEditable) {
    return true;
  }

  return false;
}

function isTextInput(inputType: string) {
  switch (inputType) {
    case "button":
    case "checkbox":
    case "color":
    case "file":
    case "hidden":
    case "image":
    case "radio":
    case "range":
    case "reset":
    case "submit":
      return false;
    default:
      return true;
  }
}

export type MouseTouchEvent = MouseEvent | TouchEvent;

export function getCursorPosition(e: MouseTouchEvent) {
  if (window.TouchEvent && e instanceof TouchEvent) {
    const touch = e.touches[0];

    return touch;
  }

  return e as MouseEvent;
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

const dateFormatterFullYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function formatDateFullYear(date: Option<Date>): string {
  return date ? dateFormatterFullYear.format(date) : NA;
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

export type ObjectCmpResult<A extends object, B extends object = A> = {
  a: A,
  b: B,
  paths: string[],
};

export function objCmp<A extends object, B extends object>(
  a: A,
  b: B,
  path = "",
  paths: string[] = [],
): ObjectCmpResult<A, B> {
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);

  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;

    if (a[key] instanceof Date && b[key] instanceof Date) {
      if (a[key].getTime() !== b[key].getTime()) {
        paths.push(newPath);
      }
    }
    else if (typeof a[key] === "object" && typeof b[key] === "object") {
      objCmp(a[key], b[key], newPath, paths);
    }
    else if (a[key] !== b[key]) {
      paths.push(newPath);
    }
  }

  return { a, b, paths };
}
