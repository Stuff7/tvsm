import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { template as _jsx$template } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { createMutationObserver as _jsx$createMutationObserver } from "jsx";
window._jsx$mutObserver = window._jsx$mutObserver || _jsx$createMutationObserver();
import { setAttribute as _jsx$setAttribute } from "jsx";
import { observeTree as _jsx$observeTree } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ4 = _jsx$template(`<button class="g-icon-btn"><i>+</i><!></button>`);
const _jsx$templ33 = _jsx$template(`<div class="ShowSearch-preview"><div class="img"></div><strong><!></strong><em><!></em></div>`);
const _jsx$templ27 = _jsx$template(`<ul class="List-general ShowSearch-results"><!><!><!></ul>`);
const _jsx$templ9 = _jsx$template(`<label class="ShowSearch"><i></i><input placeholder="Search shows" spellcheck="false"/><!></label>`);
const _jsx$templ8 = _jsx$template(`<button style="--button-bg:var(--color-ok);--button-bg-2:var(--color-ok-2);padding-block:0.07em;">Add <strong><!></strong> show/s</button>`);
const _jsx$templ11 = _jsx$template(`<li class="header"><button class="list-cell"><!></button></li>`);
const _jsx$templ2 = _jsx$template(`<strong>Add new shows <em>[/]</em></strong>`);
const _jsx$templ14 = _jsx$template(`<li><em>No results</em></li>`);
const _jsx$templ25 = _jsx$template(`<li><!><span class="list-cell"><button aria-hidden class="g-active-hidden"></button><!></span><span class="list-cell"><!></span><span class="list-cell"><!></span><span class="list-cell status"><i></i><!></span><span class="list-cell"><i></i><!></span></li>`);

window._jsx$global_event_keydown = window._jsx$global_event_keydown || _jsx$createGlobalEvent("keydown");
import { reactive, ref } from "jsx";
import For from "jsx/components/For";
import { insertToList, parseShowList, selectedStorage, showList } from "~/storage";
import { findShowByID, findShows, TvShow, TvShowPreview } from "~/tvsm";
import { debounced, formatDate, formatOption, isAnyInputFocused } from "~/utils";
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
    return parseShowList<TvShowPreview>(list);
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
        if (showList().some(b => a.id === b.id)) {
          added.add(a.id);
        }
      });
    });
  }, 300);

  function onInput(this: HTMLInputElement) {
    setText(this.value);
    search();
  }

  return (
    [(() => {
const _jsx$el0 = _jsx$templ4(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_element

_jsx$addLocalEvent(_jsx$el0, "click", () => visible.value = !visible.value);
_jsx$addGlobalEvent(window._jsx$global_event_keydown, _jsx$el0, keyListener);
Tooltip.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ2(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text


return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el3, Tooltip({}, Tooltip.$$slots));

return _jsx$el0;
})(), (() => {
Dialog.$$slots = {header: (() => {
const _jsx$el0 = _jsx$templ9(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_element

input = _jsx$el3;
_jsx$setAttribute(_jsx$el3, "value", text());
_jsx$addLocalEvent(_jsx$el3, "input", onInput);
_jsx$conditionalRender(_jsx$el4, (() => {
const _jsx$el0 = _jsx$templ8(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_expression
const _jsx$el4 = _jsx$el2.nextSibling; // jsx_text

_jsx$addLocalEvent(_jsx$el0, "click", () => addShows(...selected()));
_jsx$insertChild(_jsx$el3, () => selected().size);

return _jsx$el0;
}), () => !!selected().size);

return _jsx$el0;
}), content: (() => {
const _jsx$el0 = _jsx$templ27(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_self_closing_element

_jsx$trackClass(_jsx$el0, "is-selecting", () => isAreaSelecting());
_jsx$trackClass(_jsx$el0, "empty", () => !shows().length);
_jsx$observeTree(_jsx$mutObserver, _jsx$el0, true);
_jsx$addLocalEvent(_jsx$el0, "mount", mountSelect);
_jsx$observeTree(_jsx$mutObserver, _jsx$el0, false);
_jsx$addLocalEvent(_jsx$el0, "unmount", destroySelect);
FixedFor.$$slots = {};
_jsx$insertChild(_jsx$el1, FixedFor({get each() { return HEADERS }, do: (name) => (
            (() => {
const _jsx$el0 = _jsx$templ11(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_expression

_jsx$insertChild(_jsx$el2, () => name());

return _jsx$el0;
})()
          ), }));
_jsx$conditionalRender(_jsx$el2, (() => {
const _jsx$el0 = _jsx$templ14(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text


return _jsx$el0;
}), () => !!text() && !shows().length);
For.$$slots = {};
_jsx$insertChild(_jsx$el3, For({get each() { return shows() }, do: (show, i) => (
            (() => {
const _jsx$el0 = _jsx$templ25(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_expression
const _jsx$el5 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_expression
const _jsx$el7 = _jsx$el5.nextSibling; // jsx_element
const _jsx$el8 = _jsx$el7.firstChild; // jsx_expression
const _jsx$el9 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el10 = _jsx$el9.firstChild; // jsx_self_closing_element
const _jsx$el11 = _jsx$el10.nextSibling; // jsx_expression
const _jsx$el12 = _jsx$el9.nextSibling; // jsx_element
const _jsx$el13 = _jsx$el12.firstChild; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_text
const _jsx$el15 = _jsx$el13.nextSibling; // jsx_expression

_jsx$trackAttribute(_jsx$el0, "data-status", () => show().status);
_jsx$trackClass(_jsx$el0, "selected", () => selected().has(show().id));
_jsx$addLocalEvent(_jsx$el0, "click", selectIdx(i));
_jsx$addLocalEvent(_jsx$el0, "mousedown", (e) => e.button === 0 && startAreaSelect(i));
_jsx$addLocalEvent(_jsx$el0, "mouseover", () => doAreaSelect(i));
_jsx$addLocalEvent(_jsx$el0, "dblclick", (e) => selectAll(e, added()));
Tooltip.$$slots = {default: () => [(() => {
ShowSummary.$$slots = {}
const _jsx$el0 = ShowSummary({get show() { return show() }, });

return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el1, Tooltip({}, Tooltip.$$slots));
_jsx$trackAttribute(_jsx$el3, "disabled", () => added().has(show().id));
_jsx$insertChild(_jsx$el4, () => show().name);
_jsx$insertChild(_jsx$el6, () => formatDate(show().premiered));
_jsx$insertChild(_jsx$el8, () => show().network);
_jsx$insertChild(_jsx$el11, () => show().status);
_jsx$insertChild(_jsx$el15, () => formatOption(show().rating));

return _jsx$el0;
})()
          ), }));

return _jsx$el0;
}), }
const _jsx$el0 = Dialog({get $open() { return visible.value }, set $open(_jsx$v) { visible.value = _jsx$v }, center: true, }, Dialog.$$slots);

return _jsx$el0;
})(), ]

  );
}

export async function addShows(...ids: number[]) {
  if (!ids.length) { return }

  const shows: TvShow[] = [];

  for (const id of ids) {
    const show = await findShowByID(id);

    if (!show) {
      console.warn("Show with id", id, "not found");
      return;
    }

    insertToList(show);
    shows.push(show);
  }

  selectedStorage().upsertShows(shows);
}

export function ShowSummary(props: { show: TvShowPreview }) {
  return (
    (() => {
const _jsx$el0 = _jsx$templ33(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_expression
const _jsx$el4 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_expression

_jsx$trackCssProperty(_jsx$el1, "background-image", () => props.show.image?.medium && `url(${props.show.image.medium})`);
_jsx$insertChild(_jsx$el3, () => props.show.name);
_jsx$insertChild(_jsx$el5, () => props.show.summary);

return _jsx$el0;
})()
  );
}
