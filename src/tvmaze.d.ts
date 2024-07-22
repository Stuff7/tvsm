export type SearchResponse = {
  score: number;
  show: ShowMatch;
};

export type ShowLinks = {
  self: Self;
  previousepisode?: NamedLink;
  nextepisode?: NamedLink;
};

export type NamedLink = {
  href: string;
  name: string;
};

export type Self = {
  href: string;
};

export type Externals = {
  tvrage: Option<number>;
  thetvdb: Option<number>;
  imdb: null | string;
};

export type Image = {
  medium: string;
  original: string;
};

export type Network = {
  id: number;
  name: string;
  country: Option<Country>;
  officialSite: null | string;
};

export type Country = {
  name: string;
  code: string;
  timezone: string;
};

export type Rating = {
  average: Option<number>;
};

export type Schedule = {
  time: string;
  days: string[];
};

export type Status = "To Be Determined" | "Running" | "Ended" | "In Development";

export type ShowType = "Scripted" | "Game Show" | "Reality" | "Variety" | "Documentary" | "Animation";

export type Show = {
  id: number;
  url: string;
  name: string;
  type: ShowType;
  language: string;
  genres: string[];
  status: Status;
  runtime: Option<number>;
  averageRuntime: Option<number>;
  premiered: Option<string>;
  ended: Option<string>;
  officialSite: null | string;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Option<Network>;
  webChannel: Option<Network>;
  dvdCountry: null;
  externals: Externals;
  summary: null | string;
  updated: number;
};

export type ShowMatch = Show & {
  image: Option<Image>;
  _links: ShowLinks;
};

export type ShowResponse = Show & {
  image: Image;
  _links: SingleSearchLinks;
  _embedded: Embedded;
};

export type Embedded = {
  seasons: Season[];
  episodes: Episode[];
  previousepisode?: Episode;
  nextepisode?: Episode;
};

export type Episode = {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: PreviousepisodeType;
  airdate: string;
  airtime: Airtime;
  airstamp: string;
  runtime: number;
  rating: Rating;
  image: Image;
  summary: string;
  _links: PreviousepisodeLinks;
};

export type PreviousepisodeLinks = {
  self: Self;
  show: NamedLink;
};

export type Airtime = "22:00" | "21:00";

export type PreviousepisodeType = "regular";

export type Season = {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate: Option<string>;
  endDate: Option<string>;
  network: Option<Network>;
  webChannel: Option<Network>;
  image: Option<Image>;
  summary: null | string;
  _links: SeasonLinks;
};

export type SeasonLinks = {
  self: Self;
};

export type SingleSearchLinks = {
  self: Self;
  previousepisode?: NamedLink;
};
