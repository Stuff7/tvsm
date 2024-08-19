import jsx, { reactive, ref } from "jsx";
import For from "jsx/components/For";
import * as Storage from "~/storage";
import { findShowByID, findShows, TvShowPreview } from "~/tvsm";
import { debounced, formatDate, formatOption, isAnyInputFocused } from "~/utils";

type SearchInputProps = {
  text: string,
};

export default function SearchInput(props: SearchInputProps) {
  const shows = reactive<TvShowPreview[]>([]);
  const selectedIdx = ref(0);
  const focused = ref(false);
  const input = ref<HTMLInputElement | null>(null);

  function keyListener(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIdx.value = (selectedIdx.value + 1) % shows.length;
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIdx.value = selectedIdx.value === 0 ? shows.length - 1 : selectedIdx.value - 1;
    }
    else if (e.key === "Enter") {
      addShow(shows[selectedIdx.value].id);
    }
    else if (e.key === "Escape") {
      input.value?.blur();
    }
    else if (!isAnyInputFocused() && e.key === "/") {
      e.preventDefault();
      input.value?.focus();
    }
  }

  async function addShow(id: number) {
    const show = await findShowByID(id);

    if (!show) {
      console.warn("Show with id", id, "not found");
      return;
    }

    Storage.local.insert(show);
  }

  queueMicrotask(() => {
    document.body.addEventListener("keydown", keyListener);
  });

  function onDestroy() {
    document.body.removeEventListener("keydown", keyListener);
  }

  const search = debounced(async () => {
    shows.length = 0;
    (await findShows(props.text)).forEach((s, i) => shows[i] = s);
  }, 300);

  function onInput(this: HTMLInputElement) {
    props.text = this.value;
    search();
  }

  return (
    <header class:search-input on:unmount={onDestroy}>
      <p>TVSM</p>
      <div />
      <label>
        <i></i>
        <input
          ref={input}
          value={props.text}
          on:input={onInput}
          on:focus={() => focused.value = true}
          on:blur={() => focused.value = false}
          placeholder="Search shows"
        />
      </label>
      <ul class:empty={!focused.value || shows.length === 0}>
        <For each={shows} do={(show, i) => (
          <li
            data-status={show.status}
            class:selected={selectedIdx.value === i.value}
          >
            <span><i></i>{show.name}</span>
            <span><i></i>{formatDate(show.premiered)}</span>
            <span><i></i>{show.network}</span>
            <span class:status><i />{show.status}</span>
            <span><i></i>{formatOption(show.rating)}</span>
          </li>
        )} />
      </ul>
    </header>
  );
}
