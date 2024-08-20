import jsx, { computed, ref } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import For from "jsx/components/For";
import { showList as fullShowList } from "~/storage";
import { filteredShows as showList } from "~/components/TvShowFilter";
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

export default function TvShowList() {
  const sortKey = ref("");

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

  function removeShow(id: number) {
    const idx = fullShowList.findIndex(s => s.id === id);
    if (idx !== -1) {
      fullShowList.splice(idx, 1);
    }
  }

  return (
    <ul class:tv-show-list class:empty={showList.length === 0}>
      <li class:header>
        <FixedFor each={HEADERS} do={([title, keys]) => (
          <span on:click={sortBy(...keys)}>
            <i class:descending={sortKey.value === `${keys.join(".")}-desc`}>
              {sortKey.value.startsWith(keys.join(".")) ? "" : ""}
            </i>
            <strong>{title}</strong>
          </span>
        )} />
      </li>
      <For each={showList} do={(show, i) => (
        <li data-status={show.status}>
          <span>
            <button on:click={() => removeShow(show.id)}></button>
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
        </li>
      )} />
    </ul>
  );
}
