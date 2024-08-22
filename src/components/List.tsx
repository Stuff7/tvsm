import jsx, { computed, ref, watchOnly } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import For from "jsx/components/For";
import { showList as fullShowList } from "~/storage";
import { filteredShows as showList } from "~/components/Filter";
import Tooltip from "~/components/Tooltip";
import { formatDate, formatEp, formatOption, getDeep, KeysDeep, optionCmp, padNum } from "~/utils";
import { TvShow } from "~/tvsm";

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

export default function List() {
  const sortKey = ref("");
  const ctrlPressed = ref(false);
  const originalSelection = new Set<number>;
  const isAreaSelecting = ref(false);
  const areaStart = ref(0);
  const areaEnd = ref(0);

  function onMount() {
    window.addEventListener("keydown", keyListener);
    window.addEventListener("keyup", keyListener);
    window.addEventListener("mouseup", endAreaSelection);
  }

  function onDestroy() {
    window.removeEventListener("keypress", keyListener);
    window.removeEventListener("keyup", keyListener);
    window.removeEventListener("mouseup", endAreaSelection);
  }

  function keyListener(e: KeyboardEvent) {
    if (e.ctrlKey !== ctrlPressed.value) {
      ctrlPressed.value = e.ctrlKey;
    }
  }

  function sortBy(...keys: KeysDeep<TvShow>[]) {
    const key = keys.join(".");

    return () => {
      if (sortKey.value === key) {
        fullShowList.sort((a, b) => optionCmp(getDeep(a, ...keys), getDeep(b, ...keys), true));
        sortKey.value = `${key}-desc`;
      }
      else {
        fullShowList.sort((a, b) => optionCmp(getDeep(a, ...keys), getDeep(b, ...keys)));
        sortKey.value = key;
      }
    };
  }

  function selectShow(id: number) {
    return function () {
      const refSelected = selected.value;
      if (selected.value.has(id)) {
        refSelected.delete(id);
      }
      else {
        refSelected.add(id);
      }
      selected.value = refSelected;
    };
  }

  function toggleSelectAll() {
    const refSelected = selected.value;
    if (refSelected.size === showList.length) {
      refSelected.clear();
    }
    else {
      showList.forEach(s => refSelected.add(s.id));
    }
    selected.value = refSelected;
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

  return (
    <ul
      class:tv-show-list
      class:empty={showList.length === 0}
      class:is-selecting={isAreaSelecting.value}
      on:mount={onMount}
      on:unmount={onDestroy}
    >
      <li class:header>
        <FixedFor each={HEADERS} do={([title, keys]) => (
          <button class:list-cell on:click={sortBy(...keys)}>
            <i class:descending={sortKey.value === `${keys.join(".")}-desc`}>
              {sortKey.value.startsWith(keys.join(".")) ? "" : ""}
            </i>
            <strong>{title}</strong>
          </button>
        )} />
      </li>
      <For each={showList} do={(show, i) => (
        <li
          data-status={show.status}
          class:selected={selected.value.has(show.id)}
          on:click={selectShow(show.id)}
          on:mousedown={(e) => e.button === 0 && startAreaSelection(i.value)}
          on:mouseover={() => setAreaEnd(i.value)}
          on:dblclick={toggleSelectAll}
          aria-disabled
        >
          <Tooltip $if={ctrlPressed.value}>
            <div
              class:show-search-preview-img
              style:background-image={show.image && `url(${show.image})`}
            >
              <em $if={!show.image}>{show.name}</em>
            </div>
          </Tooltip>
          <span class:list-cell>
            <button class:row-nav aria-hidden />
            {formatIdx(i.value + 1)} {show.name}
          </span>
          <span class:list-cell class:horizontal>
            <strong>{formatEp(show.prevEp)}</strong>
            <em>{formatDate(show.prevEp?.released)}</em>
          </span>
          <span class:list-cell class:horizontal>
            <strong>{formatEp(show.nextEp)}</strong>
            <em>{formatDate(show.nextEp?.released)}</em>
          </span>
          <span class:list-cell><i></i>{show.network}</span>
          <span class:list-cell class:status><i />{show.status}</span>
          <span class:list-cell><i></i>{padNum(show.seasons, 2)}</span>
          <span class:list-cell class:horizontal={show.rating != null}>
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
        </li>
      )} />
    </ul>
  );
}
