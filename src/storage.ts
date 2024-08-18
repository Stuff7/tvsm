import { reactive } from "jsx";
import { TvShow } from "~/tvsm";

type StorageAPI = {
  load(): TvShow[],
  insert(show: TvShow): void,
};

function isDateField(k: string) {
  return k === "premiered" || k === "released";
}

function parseShowList(src: string): TvShow[] {
  return JSON.parse(src, (k, v) => {
    if (isDateField(k) && typeof v === "string") {
      return new Date(v);
    }
    return v;
  });
}

const localStorageKey = "TVSM__showList";
export const local: StorageAPI = {
  load() {
    return parseShowList(localStorage.getItem(localStorageKey) || "[]");
  },
  insert(show) {
    showList.push(show);
    localStorage.setItem(localStorageKey, JSON.stringify(showList));
  },
};

export const showList = reactive(local.load());
