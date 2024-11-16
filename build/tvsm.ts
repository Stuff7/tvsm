

import type * as TvMaze from "~/tvmaze.d.ts";
import { sleep, stripHTML } from "./utils";

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
  const r = (await Promise.all([fetchJSON<Option<TvMaze.ShowResponse>>(`/shows/${id}`, true), sleep()]))[0];

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
  out.image = { medium: show.image?.medium, original: show.image?.original };
  out.summary = show.summary && stripHTML(show.summary);

  return out;
}

function toTvShow(show: TvMaze.ShowResponse, out = {} as TvShow): TvShow {
  toTvShowPreview(show, out);
  out.nextEp = show._embedded.nextepisode && toEpisode(show._embedded.nextepisode);
  out.prevEp = show._embedded.previousepisode && toEpisode(show._embedded.previousepisode);
  out.seasons = show._embedded.seasons.length;
  out.episodes = show._embedded.episodes.map(toEpisode);

  return out;
}

function toNetwork(show: TvMaze.Show): string {
  return show.network?.name || show.webChannel?.name || "N/A";
}

function toEpisode(ep: TvMaze.Episode): Episode {
  return {
    id: ep.id,
    name: ep.name,
    summary: ep.summary && stripHTML(ep.summary),
    image: { medium: ep.image?.medium, original: ep.image?.original },
    rating: ep.rating.average,
    number: ep.number || 0,
    season: ep.season,
    released: new Date(ep.airstamp),
  };
}

const STATUS: Record<TvMaze.Status, Status> = {
  "Ended": "Ended",
  "In Development": "In Dev",
  "Running": "Running",
  "To Be Determined": "TBD",
};

export type Status = "TBD" | "Running" | "Ended" | "In Dev";

export const STATUS_VALUES = Object.values(STATUS);

export type Image = {
  medium: Option<string>,
  original: Option<string>,
};

export type TvShowPreview = {
  id: number,
  image: Image,
  name: string,
  network: string,
  premiered: Option<Date>,
  rating: Option<number>,
  status: Status,
  summary: Option<string>,
};

export type TvShow = TvShowPreview & {
  episodes: Episode[],
  nextEp: Option<Episode>,
  prevEp: Option<Episode>,
  seasons: number,
};

export type Episode = {
  id: number,
  image: Image,
  name: string,
  number: number,
  rating: Option<number>,
  released: Date,
  season: number,
  summary: string,
};
