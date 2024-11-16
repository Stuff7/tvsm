import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { template as _jsx$template } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { createMutationObserver as _jsx$createMutationObserver } from "jsx";
window._jsx$mutObserver = window._jsx$mutObserver || _jsx$createMutationObserver();
import { observeTree as _jsx$observeTree } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ32 = _jsx$template(`<p>Changed from <!> to <!></p>`);
const _jsx$templ19 = _jsx$template(`<em><!></em>`);
const _jsx$templ21 = _jsx$template(`<li aria-disabled><!><!><!><!><!><!><!></li>`);
const _jsx$templ27 = _jsx$template(`<mark><!><i></i></mark>`);
const _jsx$templ7 = _jsx$template(`<button class="details g-icon-btn" style="--button-bg:var(--color-ok);--button-bg-2:var(--color-ok-2);"><i>+</i></button>`);
const _jsx$templ36 = _jsx$template(`<span class="list-cell g-horizontal"><strong><!></strong><em><!></em><!></span>`);
const _jsx$templ2 = _jsx$template(`<button class="list-cell"><i><!></i><strong><!></strong></button>`);
const _jsx$templ13 = _jsx$template(`<i></i>`);
const _jsx$templ31 = _jsx$template(`<p>Changed from <!> to <!></p>`);
const _jsx$templ18 = _jsx$template(`<div class="progress-bar"><div></div><i></i></div>`);
const _jsx$templ28 = _jsx$template(`<span class="list-cell"><slot></slot><!></span>`);
const _jsx$templ35 = _jsx$template(`<mark><!><i></i></mark>`);
const _jsx$templ8 = _jsx$template(`<button aria-hidden class="g-active-hidden"></button>`);
const _jsx$templ23 = _jsx$template(`<ul class="List-general List"><li class="header"><!></li><!><!></ul>`);

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
    (() => {
const _jsx$el0 = _jsx$templ23(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_self_closing_element
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_self_closing_element

_jsx$trackClass(_jsx$el0, "expanded", () => props.expanded);
_jsx$trackClass(_jsx$el0, "empty", () => showList().length === 0);
_jsx$trackClass(_jsx$el0, "is-selecting", () => isAreaSelecting());
listElem = _jsx$el0;
_jsx$observeTree(_jsx$mutObserver, _jsx$el0, true);
_jsx$addLocalEvent(_jsx$el0, "mount", mountSelect);
_jsx$observeTree(_jsx$mutObserver, _jsx$el0, false);
_jsx$addLocalEvent(_jsx$el0, "unmount", destroySelect);
_jsx$addLocalEvent(_jsx$el0, "show-update", onShowUpdate);
FixedFor.$$slots = {};
_jsx$insertChild(_jsx$el2, FixedFor({get each() { return HEADERS }, do: (header) => {
          const [title, keys] = header();

          return (
            (() => {
const _jsx$el0 = _jsx$templ2(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_expression
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_expression

_jsx$addLocalEvent(_jsx$el0, "click", sortBy(...keys));
_jsx$trackClass(_jsx$el1, "descending", () => sortKey() === `${keys.join(".")}-desc`);
_jsx$insertChild(_jsx$el2, () => sortKey().startsWith(keys.join(".")) ? "" : "");
_jsx$insertChild(_jsx$el4, () => title);

return _jsx$el0;
})()
          );
        }, }));
Details.$$slots = {};
_jsx$insertChild(_jsx$el3, Details({get $open() { return details.open }, set $open(_jsx$v) { details.open = _jsx$v }, get show() { return detailedShow() }, }));
For.$$slots = {};
_jsx$insertChild(_jsx$el4, For({get each() { return showList() }, do: (show, i) => (
        (() => {
const _jsx$el0 = _jsx$templ21(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.nextSibling; // jsx_element
const _jsx$el7 = _jsx$el6.nextSibling; // jsx_element

_jsx$trackAttribute(_jsx$el0, "data-status", () => show().status);
_jsx$trackClass(_jsx$el0, "selected", () => selected().has(show().id));
_jsx$trackClass(_jsx$el0, "updated", () => updated().has(show().id));
_jsx$addLocalEvent(_jsx$el0, "click", selectIdx(i));
_jsx$addLocalEvent(_jsx$el0, "mousedown", (e) => e.button === 0 && startAreaSelect(i));
_jsx$addLocalEvent(_jsx$el0, "mouseover", () => doAreaSelect(i));
_jsx$addLocalEvent(_jsx$el0, "dblclick", (e) => selectAll(e, filtered()));
ListCell.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ7(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text

_jsx$addLocalEvent(_jsx$el0, "click", e => openDetails(e, show()));

return _jsx$el0;
})(),(() => {
const _jsx$el0 = _jsx$templ8(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]

_jsx$trackAttribute(_jsx$el0, "disabled", () => filtered().has(show().id));

return _jsx$el0;
})(),() => formatIdx(i + 1)," ",() => show().name]};
_jsx$insertChild(_jsx$el1, ListCell({get show() { return show() }, key: "name", }, ListCell.$$slots));
EpisodeCell.$$slots = {};
_jsx$insertChild(_jsx$el2, EpisodeCell({get show() { return show() }, key: "prevEp", }));
EpisodeCell.$$slots = {};
_jsx$insertChild(_jsx$el3, EpisodeCell({get show() { return show() }, key: "nextEp", }));
ListCell.$$slots = {default: () => [() => show().network]};
_jsx$insertChild(_jsx$el4, ListCell({get show() { return show() }, key: "network", }, ListCell.$$slots));
ListCell.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ13(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]


return _jsx$el0;
})(),() => show().status]};
_jsx$insertChild(_jsx$el5, ListCell({get show() { return show() }, key: "status", }, ListCell.$$slots));
ListCell.$$slots = {default: () => [() => padNum(show().seasons, 2)]};
_jsx$insertChild(_jsx$el6, ListCell({get show() { return show() }, key: "seasons", }, ListCell.$$slots));
ListCell.$$slots = {default: () => [(() => {

const _jsx$el0 = _jsx$conditionalRender(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ18(); // root[false]/component[true]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text

_jsx$trackCssProperty(_jsx$el0, "--percent", () => `${(show().rating || 0) / 10 * 100}%`);

return _jsx$el0;
}), () => show().rating != null);

return _jsx$el0;
})(),(() => {
const _jsx$el0 = _jsx$templ19(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$insertChild(_jsx$el1, () => formatOption(show().rating));

return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el7, ListCell({get show() { return show() }, key: "rating", get horizontal() { return show().rating != null }, }, ListCell.$$slots));

return _jsx$el0;
})()
      ), }));

return _jsx$el0;
})()
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
    (() => {
const _jsx$el0 = _jsx$templ28(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element

_jsx$trackClass(_jsx$el0, "status", () => props.key === "status");
_jsx$trackClass(_jsx$el0, "g-horizontal", () => !!props.horizontal);
_jsx$insertChild(_jsx$el1, arguments[1]?.["default"]?.());
_jsx$conditionalRender(_jsx$el2, (() => {
const _jsx$el0 = _jsx$templ27(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text

Tooltip.$$slots = {default: () => ["Changed from ",() => change()?.a?.[props.key]," to ",() => change()?.b?.[props.key]]};
_jsx$insertChild(_jsx$el1, Tooltip({}, Tooltip.$$slots));

return _jsx$el0;
}), () => !!change()?.paths.includes(props.key));

return _jsx$el0;
})()
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
    (() => {
const _jsx$el0 = _jsx$templ36(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_expression
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_expression
const _jsx$el5 = _jsx$el3.nextSibling; // jsx_element

_jsx$insertChild(_jsx$el2, () => formatEp(ep()));
_jsx$insertChild(_jsx$el4, () => formatDate(ep()?.released));
_jsx$conditionalRender(_jsx$el5, (() => {
const _jsx$el0 = _jsx$templ35(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text

Tooltip.$$slots = {default: () => [(() => {

const _jsx$el0 = _jsx$conditionalRender(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ31(); // root[false]/component[true]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_expression
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_text
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_expression

_jsx$insertChild(_jsx$el2, () => formatEp(
              change()?.a?.[props.key],
            ));
_jsx$insertChild(_jsx$el4, () => formatEp(
              change()?.b?.[props.key],
            ));

return _jsx$el0;
}), () => !!change()?.paths.some(epNumsChanged));

return _jsx$el0;
})(),(() => {

const _jsx$el0 = _jsx$conditionalRender(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ32(); // root[false]/component[true]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_expression
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_text
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_expression

_jsx$insertChild(_jsx$el2, () => formatDate(
              change()?.a?.[props.key]?.released,
            ));
_jsx$insertChild(_jsx$el4, () => formatDate(
              change()?.b?.[props.key]?.released,
            ));

return _jsx$el0;
}), () => !!change()?.paths.some(epDateChanged));

return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el1, Tooltip({}, Tooltip.$$slots));

return _jsx$el0;
}), () => !!change()?.paths.some(epChanged));

return _jsx$el0;
})()
  );
}
