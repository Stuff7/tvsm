import type * as TvMaze from "~/tvmaze.d.ts";

export async function findShows(search: string): Promise<TvShowPreview[]> {
  if (!search) {
    return [];
  }

  const r = await fetchJSON<TvMaze.SearchResponse[]>(`/search/shows?q=${search}`);
  if ("err" in r) {
    return [];
  }

  return r.data.map(r => ({
    id: r.show.id,
    name: r.show.name,
    premiered: r.show.premiered ? new Date(r.show.premiered) : undefined,
    network: toNetwork(r.show),
    status: STATUS[r.show.status],
    rating: r.show.rating.average || undefined,
  }));
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

function toTvShow(show: TvMaze.ShowResponse): TvShow {
  return {
    id: show.id,
    name: show.name,
    rating: show.rating.average || undefined,
    status: STATUS[show.status],
    network: toNetwork(show),
    nextEp: show._embedded.nextepisode && toEpisode(show._embedded.nextepisode),
    prevEp: show._embedded.previousepisode && toEpisode(show._embedded.previousepisode),
    seasons: show._embedded.seasons.length,
    premiered: show.premiered ? new Date(show.premiered) : undefined,
  };
}

function toNetwork(show: TvMaze.Show): string {
  return show.network?.name || show.webChannel?.name || "N/A";
}

function toEpisode(ep: TvMaze.Episode): Episode {
  return {
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

export type TvShowPreview = {
  id: number,
  name: string,
  premiered: Option<Date>,
  network: string,
  status: string,
  rating: Option<number>,
};

export type TvShow = {
  id: number,
  name: string,
  nextEp: Option<Episode>,
  prevEp: Option<Episode>,
  premiered: Option<Date>,
  network: string,
  status: Status,
  seasons: number,
  rating: Option<number>,
};

export type Episode = {
  season: number,
  number: number,
  released: Date,
};

type Status = "TBD" | "Running" | "Ended" | "In Dev";
