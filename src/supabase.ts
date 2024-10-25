import { reactive, watch } from "jsx";
import type * as tvsm from "./tvsm";
import { parseShowList, StorageAPI, tags } from "./storage";

// SQL through URL query params: https://postgrest.org/en/stable/references/api/tables_views.html
const API = () => supabase.url && `${supabase.url}/rest/v1`;
const headers = () => ({ apikey: supabase.key, "Content-Type": "application/json" });

export const SUPABASE_LOCAL_KEY = "TVSM__supabaseKey";
export const SUPABASE_LOCAL_URL = "TVSM__supabaseUrl";

export const supabase = reactive({
  key: localStorage.getItem(SUPABASE_LOCAL_KEY) || "",
  url: localStorage.getItem(SUPABASE_LOCAL_URL) || "",
});

watch(() => {
  localStorage.setItem(SUPABASE_LOCAL_KEY, supabase.key);
  localStorage.setItem(SUPABASE_LOCAL_URL, supabase.url);
});

export type Image = {
  image_medium: Option<string>,
  image_original: Option<string>,
};

export type TvShow = Omit<tvsm.TvShow, "prevEp" | "nextEp" | "image" | "episodes"> & Image & {
  prev_ep_id: Option<number>,
  next_ep_id: Option<number>,
};

export type Episode = Omit<tvsm.Episode, "image"> & Image & {
  show_id: number,
};

export async function updateShow(showId: number, show: Partial<TvShow>) {
  return fetch(`${API()}/shows?id=eq.${showId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(show),
  });
}

export const db: StorageAPI = {
  async loadShows() {
    const r = await fetch(`${API()}/rpc/all_shows`, {
      method: "POST",
      headers: headers(),
    });

    if (!r.ok) { return [] }

    return parseShowList(await r.text());
  },
  async loadTags() {
    const r = await fetch(`${API()}/tags?id=eq.1`, {
      method: "GET",
      headers: headers(),
    });

    if (!r.ok) { return {} }
    const data = JSON.stringify((await r.json())?.[0]?.data);

    return JSON.parse(data, (_, v) => (
      v instanceof Array ? new Set(v) : v
    ));
  },
  saveTags() {
    return fetch(`${API()}/tags?id=eq.1`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ data: tags() }, (_, v) => (
        v instanceof Set ? [...v] : v
      )),
    });
  },
  async upsertShows(shows) {
    insertShows(shows);
  },
};


export async function insertShows(shows: tvsm.TvShow[]) {
  await fetch(`${API()}/rpc/upsert_show_and_episodes`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      param_updates: shows.map(show => ({
        ...show,
        image_medium: show.image.medium,
        image_original: show.image.original,
        next_ep_id: show.nextEp?.id,
        prev_ep_id: show.prevEp?.id,
      })),
      param_episodes: shows.flatMap(show => show.episodes.map(ep => ({
        ...ep,
        show_id: show.id,
        image_medium: ep.image.medium,
        image_original: ep.image.original,
      }))),
    }, (k, v) => (
      k === "episodes" || k === "image" || k === "nextEp" || k === "prevEp"
    ) ? undefined : v),
  });
}
