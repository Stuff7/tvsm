import { ref, watchFn } from "jsx";
import { TvShow, TvShowPreview } from "~/tvsm";
import { objCmp, ObjectCmpResult } from "./utils";

type StorageAPI = {
  load(): TvShow[],
  loadTags(): Record<string, Set<number>>,
  saveTags(): void,
  insert(show: TvShow): void,
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
  load() {
    return parseShowList(localStorage.getItem(SHOWS_LOCAL_KEY) || "[]");
  },
  loadTags() {
    return JSON.parse(localStorage.getItem(TAGS_LOCAL_KEY) || "{}", (_, v) => (
      v instanceof Array ? new Set(v) : v
    ));
  },
  saveTags() {
    localStorage.setItem(TAGS_LOCAL_KEY, JSON.stringify(tags(), (_, v) => (
      v instanceof Set ? [...v] : v
    )));
  },
  insert(show) {
    const list = showList();
    const idx = list.findIndex(s => s.id === show.id);
    if (idx !== -1) {
      setChanges.byRef(changes => changes[show.id] = objCmp(list[idx], show));
      setShowList.byRef(list => list[idx] = show);
    }
    else {
      setShowList.byRef(list => list.push(show));
    }

    localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(showList()));
  },
};

export const [showList, setShowList] = ref(local.load());
export const [tags, setTags] = ref(local.loadTags());
watchFn(tags, () => local.saveTags());
console.log(setShowList);

const list = showList();
if (!list.length && location.search) {
  const url = new URL(location.href);
  const testData = url.searchParams.get("showList");

  if (testData) {
    try {
      setShowList(parseShowList(testData));
    }
    catch (e) {
      console.warn("Failed to load test data");
    }
  }
}
