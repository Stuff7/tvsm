import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { createTransition as _jsx$createTransition } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ7 = _jsx$template(`<div tabindex="0" class="Dialog"><header class="header"><slot name="header"></slot><button class="close-btn g-border"><i></i></button></header><article class="content"><slot name="content"></slot></article><slot></slot></div>`);

window._jsx$global_event_touchmove = window._jsx$global_event_touchmove || _jsx$createGlobalEvent("touchmove");
window._jsx$global_event_mousemove = window._jsx$global_event_mousemove || _jsx$createGlobalEvent("mousemove");
window._jsx$global_event_mouseup = window._jsx$global_event_mouseup || _jsx$createGlobalEvent("mouseup");
window._jsx$global_event_touchend = window._jsx$global_event_touchend || _jsx$createGlobalEvent("touchend");
import { reactive, ref } from "jsx";
import Portal from "jsx/components/Portal";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type DialogProps = {
  $open?: boolean,
  x?: number,
  y?: number,
  draggable?: boolean,
  center?: boolean,
};

export default function Dialog(props: DialogProps) {
  const cursor = reactive({ x: props.x || 0, y: props.y || 0 });
  const cursorStart = reactive({ x: cursor.x, y: cursor.y });
  const cursorEnd = reactive({ x: cursor.x, y: cursor.y });
  const [dragging, setDragging] = ref(false);

  function startDrag(e: MouseTouchEvent) {
    if (!props.draggable) {
      return;
    }

    if (!(
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    )) {
      e.preventDefault();
    }

    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    setDragging(true);

    const pos = getCursorPosition(e);
    cursorStart.x = pos.pageX;
    cursorStart.y = pos.pageY;

    drag(e);
  }

  function drag(e: MouseTouchEvent) {
    if (!dragging()) { return }

    const pos = getCursorPosition(e);
    cursor.x = cursorEnd.x + pos.pageX - cursorStart.x;
    cursor.y = cursorEnd.y + pos.pageY - cursorStart.y;
  }

  function stopDrag() {
    setDragging(false);
    cursorEnd.x = cursor.x;
    cursorEnd.y = cursor.y;
  }

  return (
    (() => {
Portal.$$slots = {default: () => [(() => {

const _jsx$el0 = _jsx$createTransition(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ7(); // root[false]/component[true]/conditional[false]/transition[true]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_self_closing_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_text
const _jsx$el6 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_self_closing_element
const _jsx$el8 = _jsx$el6.nextSibling; // jsx_self_closing_element

_jsx$trackClass(_jsx$el0, "draggable", () => !!props.draggable);
_jsx$trackClass(_jsx$el0, "center", () => !!props.center);
_jsx$addLocalEvent(_jsx$el0, "mousedown", e => e.currentTarget.focus());
_jsx$addLocalEvent(_jsx$el0, "touchstart", e => e.currentTarget.focus());
_jsx$addGlobalEvent(window._jsx$global_event_touchmove, _jsx$el0, drag);
_jsx$addGlobalEvent(window._jsx$global_event_touchend, _jsx$el0, stopDrag);
_jsx$addGlobalEvent(window._jsx$global_event_mousemove, _jsx$el0, drag);
_jsx$addGlobalEvent(window._jsx$global_event_mouseup, _jsx$el0, stopDrag);
_jsx$trackCssProperty(_jsx$el0, "--x", () => `${cursor.x}px`);
_jsx$trackCssProperty(_jsx$el0, "--y", () => `${cursor.y}px`);
_jsx$trackClass(_jsx$el1, "dragging", () => dragging());
_jsx$addLocalEvent(_jsx$el1, "mousedown", startDrag);
_jsx$addLocalEvent(_jsx$el1, "touchstart", startDrag);
_jsx$insertChild(_jsx$el2, arguments[1]?.["header"]?.());
_jsx$addLocalEvent(_jsx$el3, "click", () => props.$open = false);
_jsx$insertChild(_jsx$el7, arguments[1]?.["content"]?.());
_jsx$insertChild(_jsx$el8, arguments[1]?.["default"]?.());

return _jsx$el0;
}), () => !!props.$open, "pop");

return _jsx$el0;
})()]}
const _jsx$el0 = Portal({to: "[data-layer=modals]", }, Portal.$$slots);

return _jsx$el0;
})()
  );
}
