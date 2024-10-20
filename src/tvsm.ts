import type * as TvMaze from "~/tvmaze.d.ts";
import { stripHTML } from "./utils";

export async function findShows(search: string): Promise<TvShowPreview[]> {
  if (!search) {
    return [];
  }

  const r = await fetchJSON<TvMaze.SearchResponse[]>(`/search/shows?q=${search}`);
  if ("err" in r) {
    return [];
  }

  return r.data.map(r => toTvShowPreview(r.show));
}

export async function findSingleShow(search: string): Promise<Option<TvShow>> {
  if (!search) {
    return;
  }

  const r = await fetchJSON<Option<TvMaze.ShowResponse>>(`/singlesearch/shows?q=${search}`, true);
  if ("err" in r) {
    console.error(r.err);
    return;
  }

  return r.data && toTvShow(r.data);
}

export async function findShowByID(id: number): Promise<Option<TvShow>> {
  const r = await fetchJSON<Option<TvMaze.ShowResponse>>(`/shows/${id}`, true);
  if ("err" in r) {
    return;
  }

  return r.data && toTvShow(r.data);
}

export function deserializeTvShow<T extends TvShowPreview | TvShowPreview[]>(src: string): T {
  return JSON.parse(src, (k, v) => {
    if ((k === "premiered" || k === "released") && typeof v === "string") {
      return new Date(v);
    }
    return v;
  });
}

const API = "https://api.tvmaze.com";
const EMBED = "embed[]=nextepisode&embed[]=previousepisode&embed[]=seasons&embed[]=episodes";
function fetchJSON<T>(endpoint: string, embed = false): Promise<Result<T>> {
  const url = new URL(`${API}${endpoint}`);
  if (embed) {
    url.search += `${url.searchParams.size === 0 ? "?" : "&"}${EMBED}`;
  }

  return new Promise(res => {
    fetch(url)
      .then(r => r.json())
      .then(data => res({ data }))
      .catch(err => res({ err }));
  });
}

function toTvShowPreview(show: TvMaze.ShowMatch, out = {} as TvShowPreview): TvShowPreview {
  out.id = show.id;
  out.name = show.name;
  out.premiered = show.premiered ? new Date(show.premiered) : undefined;
  out.network = toNetwork(show);
  out.status = STATUS[show.status];
  out.rating = show.rating.average || undefined;
  out.image = show.image?.medium;
  out.summary = show.summary && stripHTML(show.summary);

  return out;
}

function toTvShow(show: TvMaze.ShowResponse, out = {} as TvShow): TvShow {
  toTvShowPreview(show, out);
  out.nextEp = show._embedded.nextepisode && toEpisode(show._embedded.nextepisode);
  out.prevEp = show._embedded.previousepisode && toEpisode(show._embedded.previousepisode);
  out.seasons = show._embedded.seasons.length;

  return out;
}

function toNetwork(show: TvMaze.Show): string {
  return show.network?.name || show.webChannel?.name || "N/A";
}

function toEpisode(ep: TvMaze.Episode): Episode {
  return {
    name: ep.name,
    summary: ep.summary && stripHTML(ep.summary),
    number: ep.number || 0,
    season: ep.season,
    released: new Date(ep.airstamp),
  };
}

const STATUS: Record<TvMaze.Status, Status> = {
  "To Be Determined": "TBD",
  "In Development": "In Dev",
  "Running": "Running",
  "Ended": "Ended",
};

export type Status = "TBD" | "Running" | "Ended" | "In Dev";

export const STATUS_VALUES = Object.values(STATUS);

export type TvShowPreview = {
  id: number,
  name: string,
  premiered: Option<Date>,
  network: string,
  status: Status,
  rating: Option<number>,
  image: Option<string>,
  summary: Option<string>,
};

export type TvShow = TvShowPreview & {
  nextEp: Option<Episode>,
  prevEp: Option<Episode>,
  seasons: number,
};

export type Episode = {
  name: string,
  summary: string,
  season: number,
  number: number,
  released: Date,
};
