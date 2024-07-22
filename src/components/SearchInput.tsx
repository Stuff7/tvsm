import jsx, { reactive } from "jsx";
import For from "jsx/components/For";
import { findShows, TvShowPreview } from "~/tvsm";
import { debounced } from "~/utils";

type SearchInputProps = {
  text: string,
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "2-digit",
});

function formatDate(date: Option<Date>): string {
  return date ? dateFormatter.format(date) : "N/A";
}

function formatOption<T>(thing: Option<T>): T | string {
  return thing ? thing : "N/A";
}

export default function SearchInput(props: SearchInputProps) {
  const shows = reactive<TvShowPreview[]>([]);

  const search = debounced(async () => {
    shows.length = 0;
    (await findShows(props.text)).forEach((s, i) => shows[i] = s);
  }, 300);

  function onInput(this: HTMLInputElement) {
    props.text = this.value;
    search();
  }

  return (
    <header class:search-input>
      <p>TVSM</p>
      <div />
      <label>
        <i></i>
        <input value={props.text} on:input={onInput} placeholder="Search shows" />
      </label>
      <ul class:empty={shows.length === 0}>
        <For each={shows} do={(show) => (
          <li>
            <span><i></i> {show.name}</span>
            <span><i></i> {formatDate(show.premiered)}</span>
            <span><i></i> {show.network}</span>
            <span><i></i> {show.status}</span>
            <span>{formatOption(show.rating)} <i></i></span>
          </li>
        )} />
      </ul>
    </header>
  );
}
