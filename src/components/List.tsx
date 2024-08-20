import jsx, { computed, ref, watch } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import For from "jsx/components/For";
import { showList as fullShowList } from "~/storage";
import { filteredShows as showList } from "~/components/Filter";
import { formatDate, formatEp, formatOption, getDeep, KeysDeep, padNum } from "~/utils";
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

export default function List() {
  const sortKey = ref("");

  watch(() => console.log(selected.value));

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
    <ul class:tv-show-list class:empty={showList.length === 0}>
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
        <label data-status={show.status}>
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
