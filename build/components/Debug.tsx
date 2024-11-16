import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";

const _jsx$templ3 = _jsx$template(`<pre contenteditable spellcheck="false" class="Debug-content"><!></pre>`);
const _jsx$templ0 = _jsx$template(`<button class="Debug-button"><!></button>`);
const _jsx$templ2 = _jsx$template(`<label><!></label>`);

/* eslint-disable no-unused-labels */
import { reactive } from "jsx";
import Dialog from "./Dialog";
import Portal from "jsx/components/Portal";

type DebugProps<T> = {
  data: T,
  "on:change"?: (data: T) => void,
  title?: string,
  x?: number,
  y?: number,
};

export default function Debug<T>(props: DebugProps<T>) {
  DEV: {
    const visible = reactive({ value: false });
    const title = () => props.title ?? "Debug";

    const updData = (strData: string) => {
      try {
        props["on:change"]?.(JSON.parse(strData));
      }
      catch (_e) {
        return;
      }
    };

    return (
      [(() => {
Portal.$$slots = {default: () => [(() => {

const _jsx$el0 = _jsx$conditionalRender(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ0(); // root[false]/component[true]/conditional[true]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$addLocalEvent(_jsx$el0, "click", () => visible.value = !visible.value);
_jsx$trackCssProperty(_jsx$el0, "left", () => props.x != null ? `${props.x}px` : 0);
_jsx$trackCssProperty(_jsx$el0, "top", () => props.y != null ? `${props.y}px` : 0);
_jsx$insertChild(_jsx$el1, () => title());

return _jsx$el0;
}), () => !visible.value);

return _jsx$el0;
})()]}
const _jsx$el0 = Portal({to: "[data-layer=modals]", }, Portal.$$slots);

return _jsx$el0;
})(), (() => {
Dialog.$$slots = {header: (() => {
const _jsx$el0 = _jsx$templ2(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$insertChild(_jsx$el1, () => title());

return _jsx$el0;
}), content: (() => {
const _jsx$el0 = _jsx$templ3(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$addLocalEvent(_jsx$el0, "input", [e => updData(e.currentTarget.innerHTML), { once: true }]);
_jsx$insertChild(_jsx$el1, () => JSON.stringify(props.data, null, 2));

return _jsx$el0;
}), }
const _jsx$el0 = Dialog({get $open() { return visible.value }, set $open(_jsx$v) { visible.value = _jsx$v }, draggable: true, get x() { return props.x }, get y() { return props.y }, }, Dialog.$$slots);

return _jsx$el0;
})(), ]

    );
  }
}
