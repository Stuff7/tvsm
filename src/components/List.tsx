import jsx, { computed, ref, watchOnly } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import For from "jsx/components/For";
import { showList as fullShowList } from "~/storage";
import { filteredShows as showList } from "~/components/Filter";
import { formatDate, formatEp, formatOption, getDeep, KeysDeep, padNum } from "~/utils";
import { TvShow } from "~/tvsm";
import Tooltip from "./Tooltip";

const HEADERS = [
  ["Name", ["name"]] as const,
  ["Prev Ep", ["prevEp", "released"]] as const,
  ["Next Ep", ["nextEp", "released"]] as const,
  ["Network", ["network"]] as const,
  ["Status", ["status"]] as const,
  ["Seasons", ["seasons"]] as const,
  ["Rating", ["rating"]] as const,
];

const showCountDigits = computed(() => showList.length.toString().length);
export const selected = ref(new Set<number>);

function formatIdx(i: number) {
  return padNum(i, showCountDigits.value);
}

function cmp<T>(a: Option<T>, b: Option<T>, reverse = false) {
  if (a === b) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  const ret = a < b ? -1 : 1;
  return reverse ? -ret : ret;
}

const TouchEnter = new CustomEvent("touchenter");

export default function List() {
  const sortKey = ref("");
  const ctrlPressed = ref(false);
  const originalSelection = new Set<number>;
  const isAreaSelecting = ref(false);
  const areaStart = ref(0);
  const areaEnd = ref(0);

  function keyListener(e: KeyboardEvent) {
    if (e.ctrlKey !== ctrlPressed.value) {
      ctrlPressed.value = e.ctrlKey;
    }
  }

  function onMount() {
    window.addEventListener("keydown", keyListener);
    window.addEventListener("keyup", keyListener);
    window.addEventListener("mouseup", endAreaSelection);
    window.addEventListener("touchend", endAreaSelection);
    window.addEventListener("touchmove", triggerTouchEnter);
    document.body.addEventListener("touchstart", disableMobileScroll, { passive: false });
  }

  function onDestroy() {
    window.removeEventListener("keypress", keyListener);
    window.removeEventListener("keyup", keyListener);
    window.removeEventListener("mouseup", endAreaSelection);
    window.removeEventListener("touchend", endAreaSelection);
    window.removeEventListener("touchmove", triggerTouchEnter);
    document.body.removeEventListener("touchstart", disableMobileScroll);
  }

  function triggerTouchEnter(e: TouchEvent) {
    const p = e.touches[0];
    const elem = document.elementFromPoint(p.clientX, p.clientY);

    if (!elem) { return }

    let parent = elem.parentElement;
    while (parent && !(parent instanceof HTMLLabelElement)) {
      parent = parent?.parentElement;
    }

    parent?.dispatchEvent(TouchEnter);
  }

  function disableMobileScroll(e: Event) {
    if (isAreaSelecting.value) {
      e.preventDefault();
    }
  }

  function startAreaSelection(idx: number) {
    originalSelection.clear();
    selected.value.forEach(s => originalSelection.add(s));
    areaStart.value = idx;
    isAreaSelecting.value = true;
  }

  function setAreaEnd(idx: number) {
    if (isAreaSelecting.value) {
      areaEnd.value = idx;
    }
  }

  function endAreaSelection() {
    originalSelection.clear();
    isAreaSelecting.value = false;
  }

  watchOnly([areaEnd], () => {
    if (!isAreaSelecting.value) { return }

    const selectedArea = new Set(originalSelection);

    let start = areaStart.value;
    let end = areaEnd.value;

    if (start > end) {
      [start, end] = [end, start];
    }

    for (let i = start; i <= end; i++) {
      const id = showList[i].id;
      if (selectedArea.has(id)) {
        selectedArea.delete(id);
      }
      else {
        selectedArea.add(id);
      }
    }

    selected.value = selectedArea;
  });

  function sortBy(...keys: KeysDeep<TvShow>[]) {
    const key = keys.join(".");

    return () => {
      if (sortKey.value === key) {
        fullShowList.sort((a, b) => cmp(getDeep(a, ...keys), getDeep(b, ...keys), true));
        sortKey.value = `${key}-desc`;
      }
      else {
        fullShowList.sort((a, b) => cmp(getDeep(a, ...keys), getDeep(b, ...keys)));
        sortKey.value = key;
      }
    };
  }

  function selectShow(id: number) {
    return function (this: HTMLInputElement) {
      if (this.checked) {
        selected.value.add(id);
      }
      else {
        selected.value.delete(id);
      }
      // eslint-disable-next-line no-self-assign
      selected.value = selected.value;
    };
  }

  return (
    <ul
      class:tv-show-list
      class:empty={showList.length === 0}
      class:is-selecting={isAreaSelecting.value}
      on:mount={onMount}
      on:unmount={onDestroy}
    >
      <label class:header>
        <FixedFor each={HEADERS} do={([title, keys]) => (
          <span on:click={sortBy(...keys)}>
            <i class:descending={sortKey.value === `${keys.join(".")}-desc`}>
              {sortKey.value.startsWith(keys.join(".")) ? "" : ""}
            </i>
            <strong>{title}</strong>
          </span>
        )} />
      </label>
      <For each={showList} do={(show, i) => (
        <label
          data-status={show.status}
          on:mousedown={() => startAreaSelection(i.value)}
          on:touchstart={() => startAreaSelection(i.value)}
          on:mouseover={() => setAreaEnd(i.value)}
          on:touchenter={() => setAreaEnd(i.value)}
        >
          <Tooltip $if={ctrlPressed.value}>
            <div
              class:show-search-preview-img
              style:background-image={show.image && `url(${show.image})`}
            >
              <em $if={!show.image}>{show.name}</em>
            </div>
          </Tooltip>
          <input type="checkbox" on:change={selectShow(show.id)} checked={selected.value.has(show.id)} />
          <span>
            {formatIdx(i.value + 1)} {show.name}
          </span>
          <span class:horizontal>
            <strong>{formatEp(show.prevEp)}</strong>
            <em>{formatDate(show.prevEp?.released)}</em>
          </span>
          <span class:horizontal>
            <strong>{formatEp(show.nextEp)}</strong>
            <em>{formatDate(show.nextEp?.released)}</em>
          </span>
          <span><i></i>{show.network}</span>
          <span class:status><i />{show.status}</span>
          <span><i></i>{padNum(show.seasons, 2)}</span>
          <span class:horizontal={show.rating != null}>
            <div
              class:progress-bar
              var:percent={`${(show.rating || 0) / 10 * 100}%`}
              $if={show.rating != null}
            >
              <div />
              <i></i>
            </div>
            <em>{formatOption(show.rating)}</em>
          </span>
        </label>
      )} />
    </ul>
  );
}
