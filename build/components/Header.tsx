import { template as _jsx$template } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ30 = _jsx$template(`<aside class="RightSidebar"><button class="close g-border"><i></i></button></aside>`);
const _jsx$templ5 = _jsx$template(`<strong>Import / Export</strong>`);
const _jsx$templ11 = _jsx$template(`<form class="ImportExport"><input readonly placeholder="Select shows to export"/><input placeholder="Import by id i.e '1 2 3'"/><button></button></form>`);
const _jsx$templ27 = _jsx$template(`<header class="Header"><p class="logo">TVSM</p><div class="g-divider"></div><!><!><button class="g-icon-btn"><i></i><!><!></button><div class="g-divider"></div><button class="g-icon-btn" style="--button-bg:var(--color-danger);--button-bg-2:var(--color-danger-2);"><i></i><!></button><button class="g-icon-btn" style="--button-bg:var(--color-ok);--button-bg-2:var(--color-ok-2);"><i></i><!></button><div class="g-divider"></div><!><div class="g-divider"></div><button class="g-icon-btn"><!><i></i></button></header>`);
const _jsx$templ7 = _jsx$template(`<strong>Import / Export</strong>`);

import { reactive, ref } from "jsx";
import { setShowList, selectedStorage } from "~/storage";
import Filter from "~/components/Filter";
import Search, { addShows } from "./Search";
import { selected, setSelected } from "./List";
import Tooltip from "./Tooltip";
import Dialog from "./Dialog";
import Settings from "./Settings";

type HeaderProps = {
  expanded: boolean,
  ["on:expand"]: (expanded: boolean) => void,
};

export default function Header(props: HeaderProps) {
  const [rightSidebar, setRightSidebar] = ref<HTMLElement>();
  const importExportDialog = reactive({ open: false });

  function removeShow() {
    if (!selected().size) { return }

    const ids = [...selected()];
    setSelected.byRef(selected => selected.clear());
    setShowList.byRef(list => {
      ids.forEach(id => {
        const idx = list.findIndex(s => s.id === id);
        if (idx !== -1) {
          list.splice(idx, 1);
        }
      });
    });
    selectedStorage().removeShows(ids);
  }

  let importInput!: HTMLInputElement;
  async function importShows(e: SubmitEvent) {
    e.preventDefault();
    await addShows(...importInput.value.split(" ").map(Number));
  }

  return (
    [(() => {
const _jsx$el0 = _jsx$templ27(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_self_closing_element
const _jsx$el5 = _jsx$el4.nextSibling; // jsx_self_closing_element
const _jsx$el6 = _jsx$el5.nextSibling; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_element
const _jsx$el8 = _jsx$el7.firstChild; // jsx_text
const _jsx$el9 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el10 = _jsx$el9.nextSibling; // jsx_element
const _jsx$el11 = _jsx$el6.nextSibling; // jsx_self_closing_element
const _jsx$el12 = _jsx$el11.nextSibling; // jsx_element
const _jsx$el13 = _jsx$el12.firstChild; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_text
const _jsx$el15 = _jsx$el13.nextSibling; // jsx_element
const _jsx$el16 = _jsx$el12.nextSibling; // jsx_element
const _jsx$el17 = _jsx$el16.firstChild; // jsx_element
const _jsx$el18 = _jsx$el17.firstChild; // jsx_text
const _jsx$el19 = _jsx$el17.nextSibling; // jsx_element
const _jsx$el20 = _jsx$el16.nextSibling; // jsx_self_closing_element
const _jsx$el21 = _jsx$el20.nextSibling; // jsx_self_closing_element
const _jsx$el22 = _jsx$el21.nextSibling; // jsx_self_closing_element
const _jsx$el23 = _jsx$el22.nextSibling; // jsx_element
const _jsx$el24 = _jsx$el23.firstChild; // jsx_element
const _jsx$el25 = _jsx$el24.nextSibling; // jsx_element
const _jsx$el26 = _jsx$el25.firstChild; // jsx_text

_jsx$trackClass(_jsx$el0, "expanded", () => props.expanded);
Settings.$$slots = {};
_jsx$insertChild(_jsx$el4, Settings({}));
Search.$$slots = {};
_jsx$insertChild(_jsx$el5, Search({}));
_jsx$addLocalEvent(_jsx$el6, "click", () => importExportDialog.open = !importExportDialog.open);
Tooltip.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ5(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el9, Tooltip({}, Tooltip.$$slots));
Dialog.$$slots = {header: (() => {
const _jsx$el0 = _jsx$templ7(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
}), content: (() => {
const _jsx$el0 = _jsx$templ11(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_self_closing_element

_jsx$addLocalEvent(_jsx$el0, "submit", importShows);
_jsx$trackAttribute(_jsx$el1, "value", () => importExportDialog.open ? [...selected()].join(" ") : "");
_jsx$addLocalEvent(_jsx$el1, "click", e => e.currentTarget.select());
importInput = _jsx$el2;

return _jsx$el0;
}), };
_jsx$insertChild(_jsx$el10, Dialog({get $open() { return importExportDialog.open }, set $open(_jsx$v) { importExportDialog.open = _jsx$v }, center: true, }, Dialog.$$slots));
_jsx$trackAttribute(_jsx$el12, "disabled", () => !selected().size);
_jsx$addLocalEvent(_jsx$el12, "click", removeShow);
Tooltip.$$slots = {default: () => ["Delete selected shows"]};
_jsx$insertChild(_jsx$el15, Tooltip({}, Tooltip.$$slots));
_jsx$trackAttribute(_jsx$el16, "disabled", () => !selected().size);
_jsx$addLocalEvent(_jsx$el16, "click", () => addShows(...selected()));
Tooltip.$$slots = {default: () => ["Update selected shows"]};
_jsx$insertChild(_jsx$el19, Tooltip({}, Tooltip.$$slots));
Filter.$$slots = {};
_jsx$insertChild(_jsx$el21, Filter({get expandedSection() { return rightSidebar() }, get isExpanded() { return props.expanded }, }));
_jsx$addLocalEvent(_jsx$el23, "click", (e) => {
          e.currentTarget.focus();
          props["on:expand"](!props.expanded);
        });
Tooltip.$$slots = {default: () => ["More filtering options"]};
_jsx$insertChild(_jsx$el24, Tooltip({}, Tooltip.$$slots));

return _jsx$el0;
})(), (() => {
const _jsx$el0 = _jsx$templ30(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text

_jsx$trackClass(_jsx$el0, "expanded", () => props.expanded);
setRightSidebar(_jsx$el0);
_jsx$addLocalEvent(_jsx$el1, "click", () => props["on:expand"](false));

return _jsx$el0;
})(), ]

  );
}
