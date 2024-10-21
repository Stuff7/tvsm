import { reactive, ref, watchOnly } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import For from "jsx/components/For";
import { changes, showList, setShowList } from "~/storage";
import { filtered } from "~/components/Filter";
import Tooltip from "~/components/Tooltip";
import { formatDate, formatEp, formatOption, getDeep, KeysDeep, optionCmp, padNum } from "~/utils";
import { TvShow, TvShowPreview } from "~/tvsm";
import useSelection from "~/useSelection";
import Details from "./Details";

const HEADERS = [
  ["Name", ["name"]] as const,
  ["Prev Ep", ["prevEp", "released"]] as const,
  ["Next Ep", ["nextEp", "released"]] as const,
  ["Network", ["network"]] as const,
  ["Status", ["status"]] as const,
  ["Seasons", ["seasons"]] as const,
  ["Rating", ["rating"]] as const,
];

const showCountDigits = () => showList().length.toString().length;
export const [selected, setSelected] = ref(new Set<number>);

function formatIdx(i: number) {
  return padNum(i, showCountDigits());
}

function sortList<T extends TvShowPreview>(reverse: boolean, a: T, b: T, ...keys: KeysDeep<T>[]) {
  if (filtered().has(a.id)) {
    return 1;
  }

  if (filtered().has(b.id)) {
    return -1;
  }

  return optionCmp(getDeep(a, ...keys), getDeep(b, ...keys), reverse);
}

type ListProps = {
  expanded: boolean,
};

export let listElem: HTMLUListElement;

export default function List(props: ListProps) {
  const [sortKey, setSortKey] = ref("");
  const {
    mountSelect,
    destroySelect,
    isAreaSelecting,
    selectIdx,
    selectAll,
    startAreaSelect,
    doAreaSelect,
  } = useSelection([selected, setSelected], showList);

  function sortBy(...keys: KeysDeep<TvShow>[]) {
    const key = keys.join(".");

    return () => {
      setSortKey(sortKey() !== key ? key : `${key}-desc`);
    };
  }

  function sort(): boolean {
    const key = sortKey();
    const isAscending = !key.endsWith("-desc");
    const keys = (isAscending ? key : key.slice(0, key.length - 5)).split(".") as KeysDeep<TvShow>[];

    setShowList.byRef(list => list.sort((a, b) => sortList(isAscending, a, b, ...keys)));

    return isAscending;
  }

  watchOnly([filtered, sortKey], sort);

  const [updated, setUpdated] = ref(new Set);
  function onShowUpdate(e: CustomEvent<number>) {
    setUpdated.byRef(updated => {
      updated.add(e.detail);
    });

    setTimeout(() => {
      setUpdated.byRef(updated => {
        updated.delete(e.detail);
      });
    }, 1e3);
  }

  const [detailedShow, setDetailedShow] = ref<TvShow>();
  const details = reactive({ open: false });
  function openDetails(e: MouseEvent, show: TvShow) {
    e.stopPropagation();
    if (show === detailedShow()) {
      details.open = !details.open;
    }
    else {
      setDetailedShow(show);
      details.open = true;
    }
  }

  return (
    <ul
      class:List-general
      class:List
      class:expanded={props.expanded}
      class:empty={showList().length === 0}
      class:is-selecting={isAreaSelecting()}
      $ref={listElem}
      on:mount={mountSelect}
      on:unmount={destroySelect}
      on:show-update={onShowUpdate}
    >
      <li class:header>
        <FixedFor each={HEADERS} do={(header) => {
          const [title, keys] = header();

          return (
            <button class:list-cell on:click={sortBy(...keys)}>
              <i class:descending={sortKey() === `${keys.join(".")}-desc`}>
                {sortKey().startsWith(keys.join(".")) ? "" : ""}
              </i>
              <strong>{title}</strong>
            </button>
          );
        }} />
      </li>
      <Details $open={details.open} show={detailedShow()} />
      <For each={showList()} do={(show, i) => (
        <li
          $data-status={show().status}
          class:selected={selected().has(show().id)}
          class:updated={updated().has(show().id)}
          on:click={selectIdx(i)}
          on:mousedown={(e) => e.button === 0 && startAreaSelect(i)}
          on:mouseover={() => doAreaSelect(i)}
          on:dblclick={(e) => selectAll(e, filtered())}
          aria-disabled
        >
          <ListCell show={show()} key="name">
            <button
              class:details
              class:g-icon-btn
              var:button-bg="var(--color-ok)"
              var:button-bg-2="var(--color-ok-2)"
              on:click={e => openDetails(e, show())}
            >
              <i>+</i>
            </button>
            <button class:g-active-hidden $disabled={filtered().has(show().id)} aria-hidden />
            {formatIdx(i + 1)} {show().name}
          </ListCell>
          <EpisodeCell show={show()} key="prevEp" />
          <EpisodeCell show={show()} key="nextEp" />
          <ListCell show={show()} key="network">{show().network}</ListCell>
          <ListCell show={show()} key="status"><i />{show().status}</ListCell>
          <ListCell show={show()} key="seasons">{padNum(show().seasons, 2)}</ListCell>
          <ListCell show={show()} key="rating" horizontal={show().rating != null}>
            <div
              class:progress-bar
              var:percent={`${(show().rating || 0) / 10 * 100}%`}
              $if={show().rating != null}
            >
              <div />
              <i></i>
            </div>
            <em>{formatOption(show().rating)}</em>
          </ListCell>
        </li>
      )} />
    </ul>
  );
}

type ListCellProps = {
  show: TvShow,
  key: keyof Pick<TvShow, "name" | "network" | "status" | "seasons" | "rating">,
  horizontal?: boolean,
};

function ListCell(props: ListCellProps) {
  const change = () => changes()[props.show.id];

  return (
    <span class:list-cell class:status={props.key === "status"} class:g-horizontal={!!props.horizontal}>
      <slot />
      <mark $if={!!change()?.paths.includes(props.key)}>
        <Tooltip>
          Changed from {change()?.a?.[props.key]} to {change()?.b?.[props.key]}
        </Tooltip>
        <i></i>
      </mark>
    </span>
  );
}

type EpisodeCellProps = {
  show: TvShow,
  key: "prevEp" | "nextEp",
};

function EpisodeCell(props: EpisodeCellProps) {
  const ep = () => props.show[props.key];
  const change = () => changes()[props.show.id];

  function epNumsChanged(p: string) {
    return p === props.key || (p.startsWith(props.key) && (p.endsWith("number") || p.endsWith("season")));
  }

  function epDateChanged(p: string) {
    return p === props.key || (p.startsWith(props.key) && p.endsWith("released"));
  }

  function epChanged(p: string) {
    return p.startsWith(props.key) && (p.endsWith("season") || p.endsWith("number") || p.includes("released"));
  }

  return (
    <span class:list-cell class:g-horizontal>
      <strong>{formatEp(ep())}</strong>
      <em>{formatDate(ep()?.released)}</em>
      <mark
        $if={!!change()?.paths.some(epChanged)}
      >
        <Tooltip>
          <p $if={!!change()?.paths.some(epNumsChanged)}>
            Changed from {formatEp(
              change()?.a?.[props.key],
            )} to {formatEp(
              change()?.b?.[props.key],
            )}
          </p>
          <p $if={!!change()?.paths.some(epDateChanged)}>
            Changed from {formatDate(
              change()?.a?.[props.key]?.released,
            )} to {formatDate(
              change()?.b?.[props.key]?.released,
            )}
          </p>
        </Tooltip>
        <i></i>
      </mark>
    </span>
  );
}
