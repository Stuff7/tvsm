import jsx, { Fragment, reactive, ref } from "jsx";
import For from "jsx/components/For";
import * as Storage from "~/storage";
import { findShowByID, findShows, TvShowPreview } from "~/tvsm";
import { debounced, formatDate, formatOption, isAnyInputFocused } from "~/utils";
import Dialog from "./Dialog";

export default function TvShowSearch() {
  const visible = ref(false);
  const text = ref("");
  const shows = reactive<TvShowPreview[]>([]);
  const selectedIdx = ref(0);
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
      visible.value = false;
    }
    else if (!isAnyInputFocused() && e.key === "/") {
      e.preventDefault();
      visible.value = true;
      input.value?.focus();
    }
  }

  function onMount() {
    document.body.addEventListener("keydown", keyListener);
  }

  function onDestroy() {
    document.body.removeEventListener("keydown", keyListener);
  }

  const search = debounced(async () => {
    shows.length = 0;
    (await findShows(text.value)).forEach((s, i) => shows[i] = s);
  }, 300);

  function onInput(this: HTMLInputElement) {
    text.value = this.value;
    search();
  }

  return (
    <>
      <button
        class:add-show
        on:click={() => visible.value = !visible.value}
        on:mount={onMount}
        on:unmount={onDestroy}
      >
        <i></i>
        <div class:divider />
        <strong>Add Show <em>[/]</em></strong>
      </button>
      <Dialog
        $if={visible.value}
        center
      >
        <label slot="header" class:show-search>
          <i></i>
          <input
            ref={input}
            value={text.value}
            on:input={onInput}
            placeholder="Search shows"
          />
        </label>
        <ul slot="content" class:show-search-results>
          <em $if={!!text.value && !shows.length}>No results</em>
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
      </Dialog>
    </>
  );
}

export async function addShow(id: number) {
  const show = await findShowByID(id);

  if (!show) {
    console.warn("Show with id", id, "not found");
    return;
  }

  Storage.local.insert(show);
}
