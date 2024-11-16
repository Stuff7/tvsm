import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { createTransition as _jsx$createTransition } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ12 = _jsx$template(`<button class="MultiSelect g-border"><section class="items"><!><!></section><i class="chevron"></i><!></button>`);
const _jsx$templ0 = _jsx$template(`<button data-item><!></button>`);
const _jsx$templ11 = _jsx$template(`<article class="content"><slot></slot><section class="items"><!></section></article>`);
const _jsx$templ8 = _jsx$template(`<label><input type="checkbox"/><span><!></span></label>`);
const _jsx$templ2 = _jsx$template(`<span><!></span>`);

window._jsx$global_event_click = window._jsx$global_event_click || _jsx$createGlobalEvent("click");
window._jsx$global_event_touchstart = window._jsx$global_event_touchstart || _jsx$createGlobalEvent("touchstart");
import { ref, watchFn } from "jsx";
import For from "jsx/components/For";
import { isTargetElement } from "~/utils";

type MultiSelectProps<T extends string> = {
  placeholder?: string,
  options: T[],
  ["on:change"]: (selected: Set<T>) => void,
  ["on:expand"]?: (expanded: boolean) => void,
};

export default function MultiSelect<T extends string>(props: MultiSelectProps<T>) {
  const [expanded, setExpanded] = ref(false);
  const [selected, setSelected] = ref(new Set<T>);

  let button!: HTMLButtonElement;
  let content!: HTMLElement;

  watchFn(() => props.options, () => {
    setSelected.byRef(selected => {
      selected.forEach((s) => {
        if (!props.options.includes(s)) {
          selected.delete(s);
        }
      });
    });
  });
  watchFn(expanded, () => props["on:expand"]?.(expanded()));
  watchFn(selected, () => props["on:change"](selected()));

  function close(e: Event) {
    if (expanded() && !(e.target instanceof HTMLElement && (
      e.target.dataset.item != null ||
      isTargetElement(e.target, button)
    ))) {
      setExpanded(false);
    }
  }

  function toggle(e: Event) {
    if (!content) {
      setExpanded(true);
    }
    else if (e.target instanceof HTMLElement && e.target.dataset.item == null && !isTargetElement(e.target, content)) {
      setExpanded(!expanded());
    }
  }

  function select(value: T) {
    return function(this: HTMLInputElement) {
      setSelected.byRef(selected => {
        if (this.checked) {
          selected.add(value);
        }
        else {
          selected.delete(value);
        }
      });
    };
  }

  return (
    (() => {
const _jsx$el0 = _jsx$templ12(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_self_closing_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_text
const _jsx$el6 = _jsx$el4.nextSibling; // jsx_element

button = _jsx$el0;
_jsx$trackClass(_jsx$el0, "expanded", () => expanded());
_jsx$addLocalEvent(_jsx$el0, "click", toggle);
_jsx$addGlobalEvent(window._jsx$global_event_click, _jsx$el0, close);
_jsx$addGlobalEvent(window._jsx$global_event_touchstart, _jsx$el0, close);
For.$$slots = {};
_jsx$insertChild(_jsx$el2, For({get each() { return props.options }, do: txt => (
          (() => {
const _jsx$el0 = _jsx$templ0(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$addLocalEvent(_jsx$el0, "click", () => setSelected.byRef(selected => selected.delete(txt())));
_jsx$trackClass(_jsx$el0, "hidden", () => !selected().has(txt()));
_jsx$insertChild(_jsx$el1, () => txt());

return _jsx$el0;
})()
        ), }));
_jsx$conditionalRender(_jsx$el3, (() => {
const _jsx$el0 = _jsx$templ2(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$insertChild(_jsx$el1, () => props.placeholder ?? "");

return _jsx$el0;
}), () => selected().size === 0);
_jsx$createTransition(_jsx$el6, (() => {
const _jsx$el0 = _jsx$templ11(); // root[false]/component[false]/conditional[false]/transition[true]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_self_closing_element

content = _jsx$el0;
_jsx$insertChild(_jsx$el1, arguments[1]?.["default"]?.());
For.$$slots = {};
_jsx$insertChild(_jsx$el3, For({get each() { return props.options }, do: txt => (
            (() => {
const _jsx$el0 = _jsx$templ8(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_expression

_jsx$trackAttribute(_jsx$el1, "checked", () => selected().has(txt()));
_jsx$addLocalEvent(_jsx$el1, "change", select(txt()));
_jsx$insertChild(_jsx$el3, () => txt());

return _jsx$el0;
})()
          ), }));

return _jsx$el0;
}), () => expanded(), "slide");

return _jsx$el0;
})()
  );
}
