import jsx, { ref } from "jsx";
import { findShows, TvShowPreview } from "~/tvsm";
import { debounced } from "~/utils";

type SearchInputProps = {
  text: string,
};

export default function SearchInput(props: SearchInputProps) {
  const shows = ref<TvShowPreview[]>([]);

  const search = debounced(async () => shows.value = await findShows(props.text), 300);

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
      <pre>{JSON.stringify(shows.value, null, 2)}</pre>
    </header>
  );
}
