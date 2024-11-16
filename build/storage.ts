

import { ref, watchFn } from "jsx";
import { TvShow, TvShowPreview } from "~/tvsm";
import { objCmp, ObjectCmpResult } from "./utils";
import { listElem } from "./components/List";
import { db, supabase } from "./supabase";
import { dropbox, dropboxApp, fetchDropboxToken } from "./dropbox";

export type Tags = Record<string, Set<number>>;

export type StorageAPI = {
  loadShows(): Promise<TvShow[]>,
  loadTags(): Promise<Tags>,
  saveTags(): void,
  upsertShows(shows: TvShow[]): void,
  removeShows(shows: number[]): void,
};

function isDateField(k: string) {
  return k === "premiered" || k === "released";
}

export function parseShowList<T extends TvShow | TvShowPreview>(src: string): T[] {
  return JSON.parse(src, (k, v) => {
    if (isDateField(k) && typeof v === "string") {
      return new Date(v);
    }
    return v;
  });
}

type Changes = Partial<Record<number, ObjectCmpResult<TvShow>>>;

export const [changes, setChanges] = ref<Changes>({});

const SHOWS_LOCAL_KEY = "TVSM__showList";
const TAGS_LOCAL_KEY = "TVSM__tags";
export const local: StorageAPI = {
  async loadShows() {
    return parseShowList(localStorage.getItem(SHOWS_LOCAL_KEY) || "[]");
  },
  async loadTags() {
    return JSON.parse(localStorage.getItem(TAGS_LOCAL_KEY) || "{}", (_, v) => (
      v instanceof Array ? new Set(v) : v
    ));
  },
  saveTags() {
    localStorage.setItem(TAGS_LOCAL_KEY, JSON.stringify(tags(), (_, v) => (
      v instanceof Set ? [...v] : v
    )));
  },
  upsertShows() {
    localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(showList()));
  },
  removeShows() {
    localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(showList()));
  },
};

export function insertToList(show: TvShow) {
  const list = showList();
  const idx = list.findIndex(s => s.id === show.id);
  if (idx !== -1) {
    setChanges.byRef(changes => changes[show.id] = objCmp(list[idx], show));
    setShowList.byRef(list => list[idx] = show);
  }
  else {
    setShowList.byRef(list => list.push(show));
  }
  const ShowUpdate = new CustomEvent("show-update", { detail: show.id });
  listElem.dispatchEvent(ShowUpdate);
}

export const STORAGE_BROWSER = "browser";
export const STORAGE_POSTGREST = "postgrest";
export const STORAGE_DROPBOX = "dropbox";
export type StorageOption = typeof STORAGE_BROWSER | typeof STORAGE_POSTGREST | typeof STORAGE_DROPBOX;

const SELECTED_STORAGE_LOCAL_KEY = "TVSM__selectedStorage";
export const [storageOption, setStorageOption] = ref(
  localStorage.getItem(SELECTED_STORAGE_LOCAL_KEY) as StorageOption || STORAGE_BROWSER,
);
export const [selectedStorage, setSelectedStorage] = ref<StorageAPI>(getSelectedStorage());

watchFn(storageOption, () => {
  setSelectedStorage(getSelectedStorage());
  localStorage.setItem(SELECTED_STORAGE_LOCAL_KEY, storageOption());
});

export function getSelectedStorage() {
  const option = storageOption();
  if (option === STORAGE_POSTGREST && supabase.url && supabase.key) {
    return db;
  }
  else if (option === STORAGE_DROPBOX && dropboxApp.name && dropboxApp.token) {
    return dropbox;
  }
  else {
    return local;
  }
}

export const [showList, setShowList] = ref<TvShow[]>([]);
export const [tags, setTags] = ref<Tags>({});

queueMicrotask(() => {
  selectedStorage().loadShows().then(setShowList);
  selectedStorage().loadTags().then(setTags);
  let first = true;
  watchFn(tags, () => {
    if (first) {
      first = false;
      return;
    }
    selectedStorage().saveTags();
  });
});

const list = showList();
if (!list.length && location.search) {
  const url = new URL(location.href);
  const testData = url.searchParams.get("showList");
  const dropboxCode = url.searchParams.get("code");

  if (testData) {
    try {
      setShowList(parseShowList(testData));
    }
    catch (e) {
      console.warn("Failed to load test data");
    }
  }

  if (dropboxCode) {
    fetchDropboxToken(dropboxCode);
  }
}
