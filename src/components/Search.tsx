import jsx, { Fragment, ref } from "jsx";
import For from "jsx/components/For";
import * as Storage from "~/storage";
import { findShowByID, findShows, TvShowPreview } from "~/tvsm";
import { debounced, formatDate, formatOption, isAnyInputFocused } from "~/utils";
import Dialog from "./Dialog";
import Tooltip from "./Tooltip";

export default function Search() {
  const [visible, setVisible] = ref(false);
  const [text, setText] = ref("");
  const [shows, setShows] = ref<TvShowPreview[]>([]);
  const [selectedIdx, setSelectedIdx] = ref(0);
  const [input, setInput] = ref<HTMLInputElement | null>(null);

  function keyListener(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((selectedIdx() + 1) % shows().length);
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(selectedIdx() === 0 ? shows.length - 1 : selectedIdx() - 1);
    }
    else if (e.key === "Enter") {
      if (selectedIdx() < shows().length) {
        addShow(shows()[selectedIdx()].id);
      }
    }
    else if (e.key === "Escape") {
      setVisible(false);
    }
    else if (!isAnyInputFocused() && e.key === "/") {
      e.preventDefault();
      setVisible(true);
      input()?.focus();
    }
  }

  function onMount() {
    document.body.addEventListener("keydown", keyListener);
  }

  function onDestroy() {
    document.body.removeEventListener("keydown", keyListener);
  }

  const search = debounced(async () => {
    setShows(await findShows(text()));
  }, 300);

  function onInput(this: HTMLInputElement) {
    setText(this.value);
    search();
  }

  return (
    <>
      <button
        class:add-show
        on:click={() => setVisible(!visible())}
        on:mount={onMount}
        on:unmount={onDestroy}
      >
        <i></i>
        <div class:divider />
        <strong>Add Show <em>[/]</em></strong>
      </button>
      <Dialog
        $if={visible()}
        center
      >
        <label slot="header" class:show-search>
          <i></i>
          <input
            $ref={setInput}
            value={text()}
            on:input={onInput}
            placeholder="Search shows"
          />
        </label>
        <ul slot="content" class:show-search-results>
          <em $if={!!text() && !shows().length}>No results</em>
          <For each={shows()} do={(show, i) => (
            <li
              data-status={show().status}
              class:selected={selectedIdx() === i}
            >
              <Tooltip>
                <div
                  class:show-search-preview-img
                  style:background-image={show().image && `url(${show().image})`}
                >
                  <em $if={!show().image}>{show().name}</em>
                </div>
              </Tooltip>
              <span><i></i>{show().name}</span>
              <span><i></i>{formatDate(show().premiered)}</span>
              <span><i></i>{show().network}</span>
              <span class:status><i />{show().status}</span>
              <span><i></i>{formatOption(show().rating)}</span>
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
