import { reactive, watch } from "jsx";
import type * as tvsm from "./tvsm";

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

export async function insertShow(show: tvsm.TvShow) {
  {
    const r = await fetch(`${API()}/shows`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        ...show,
        image_medium: show.image.medium,
        image_original: show.image.original,
      }, (k, v) => (
        k === "episodes" || k === "image" || k === "nextEp" || k === "prevEp"
      ) ? undefined : v),
    });

    if (!r.ok) { return r }
  }

  {
    const r = await fetch(`${API()}/episodes`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(show.episodes.map(ep => ({
        ...ep,
        show_id: show.id,
        image_medium: ep.image.medium,
        image_original: ep.image.original,
      })), (k, v) => k === "image" ? undefined : v),
    });

    if (!r.ok) { return r }
  }

  return updateShow(show.id, {
    next_ep_id: show.nextEp?.id,
    prev_ep_id: show.prevEp?.id,
  });
}
