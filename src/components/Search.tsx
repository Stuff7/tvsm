import { reactive, ref } from "jsx";
import For from "jsx/components/For";
import * as Storage from "~/storage";
import { findShowByID, findShows, TvShowPreview } from "~/tvsm";
import { debounced, delayCall, formatDate, formatOption, isAnyInputFocused } from "~/utils";
import Dialog from "./Dialog";
import Tooltip from "./Tooltip";
import FixedFor from "jsx/components/FixedFor";
import useSelection from "~/useSelection";

const HEADERS = [
  "Name",
  "Released",
  "Network",
  "Status",
  "Rating",
];

function initSearch() {
  let list: string | null;
  if (location.search && (list = new URL(location.href).searchParams.get("searchList"))) {
    return Storage.parseShowList<TvShowPreview>(list);
  }

  return [];
}

export default function Search() {
  const visible = reactive({ value: false });
  const [text, setText] = ref("");
  const [shows, setShows] = ref<TvShowPreview[]>(initSearch());
  const [added, setAdded] = ref(new Set<number>);
  const [selected, setSelected] = ref(new Set<number>);

  const {
    mountSelect,
    destroySelect,
    selectIdx,
    selectAll,
    isAreaSelecting,
    startAreaSelect,
    doAreaSelect,
  } = useSelection([selected, setSelected], shows);

  let input!: HTMLInputElement;

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      visible.value = false;
    }
    else if (!isAnyInputFocused() && e.key === "/") {
      e.preventDefault();
      visible.value = true;
      input.focus();
    }
  }

  const search = debounced(async () => {
    setShows(await findShows(text()));
    setSelected.byRef(selected => selected.clear());

    setAdded.byRef(added => {
      added.clear();
      shows().forEach(a => {
        if (Storage.showList().some(b => a.id === b.id)) {
          added.add(a.id);
        }
      });
    });
  }, 300);

  function onInput(this: HTMLInputElement) {
    setText(this.value);
    search();
  }

  async function addShows() {
    for (const id of selected()) {
      await delayCall(async () => await addShow(id));
    }
  }

  return (
    <>
      <button
        class:g-icon-btn
        on:click={() => visible.value = !visible.value}
        g:onkeydown={keyListener}
      >
        <i>+</i>
        <Tooltip>
          <strong>Add new shows <em>[/]</em></strong>
        </Tooltip>
      </button>
      <Dialog $open={visible.value} center>
        <label slot="header" class:ShowSearch>
          <i></i>
          <input
            $ref={input}
            value={text()}
            on:input={onInput}
            placeholder="Search shows"
            spellcheck={false}
          />
          <button
            $if={!!selected().size}
            var:button-bg="var(--color-ok)"
            var:button-bg-2="var(--color-ok-2)"
            style:padding-block="0.07em"
            on:click={addShows}
          >Add <strong>{selected().size}</strong> show/s</button>
        </label>
        <ul
          slot="content"
          class:List-general
          class:ShowSearch-results
          class:is-selecting={isAreaSelecting()}
          class:empty={!shows().length}
          on:mount={mountSelect}
          on:unmount={destroySelect}
        >
          <FixedFor each={HEADERS} do={(name) => (
            <li class:header><button class:list-cell>{name()}</button></li>
          )} />
          <li $if={!!text() && !shows().length}><em>No results</em></li>
          <For each={shows()} do={(show, i) => (
            <li
              $data-status={show().status}
              class:selected={selected().has(show().id)}
              on:click={selectIdx(i)}
              on:mousedown={(e) => e.button === 0 && startAreaSelect(i)}
              on:mouseover={() => doAreaSelect(i)}
              on:dblclick={(e) => selectAll(e, added())}
            >
              <Tooltip><ShowSummary show={show()} /></Tooltip>
              <span class:list-cell>
                <button class:g-active-hidden $disabled={added().has(show().id)} aria-hidden />
                {show().name}
              </span>
              <span class:list-cell>{formatDate(show().premiered)}</span>
              <span class:list-cell>{show().network}</span>
              <span class:list-cell class:status><i />{show().status}</span>
              <span class:list-cell><i></i>{formatOption(show().rating)}</span>
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

export function ShowSummary(props: { show: TvShowPreview }) {
  return (
    <div class:ShowSearch-preview>
      <div
        class:img
        style:background-image={props.show.image?.medium && `url(${props.show.image.medium})`}
      />
      <strong>{props.show.name}</strong>
      <em>{props.show.summary}</em>
    </div>
  );
}
