import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { createTransition as _jsx$createTransition } from "jsx";
import { template as _jsx$template } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { createMutationObserver as _jsx$createMutationObserver } from "jsx";
window._jsx$mutObserver = window._jsx$mutObserver || _jsx$createMutationObserver();
import { observeTree as _jsx$observeTree } from "jsx";

const _jsx$templ3 = _jsx$template(`<span></span>`);
const _jsx$templ1 = _jsx$template(`<div class="Tooltip"><slot></slot></div>`);

window._jsx$global_event_mousemove = window._jsx$global_event_mousemove || _jsx$createGlobalEvent("mousemove");
window._jsx$global_event_touchmove = window._jsx$global_event_touchmove || _jsx$createGlobalEvent("touchmove");
import { reactive, ref, watch, watchOnly } from "jsx";
import Portal from "jsx/components/Portal";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type TooltipProps = {
  visible?: boolean,
  disableHover?: boolean,
};

const realtimeMouse = { x: 0, y: 0 };

function trackMouse(e: MouseTouchEvent) {
  const pos = getCursorPosition(e);
  realtimeMouse.x = pos.clientX;
  realtimeMouse.y = pos.clientY;
}

window.addEventListener("mousemove", trackMouse);
window.addEventListener("touchmove", trackMouse);

export default function Tooltip(props: TooltipProps) {
  const [mouse, setMouse] = ref(realtimeMouse);
  const translation = reactive({ x: "1rem", y: "1rem" });
  const [hovering, setHovering] = ref(false);
  const [visible, setVisible] = ref(false);

  let tooltip!: HTMLDivElement;
  let tooltipLayer!: Element;

  watch(() => {
    if (props.disableHover) {
      setVisible(props.visible || false);
      return;
    }

    setVisible(hovering() && (props.visible ?? true));
  });

  watchOnly([visible], () => {
    if (visible()) {
      trackMouse();
    }
  });

  function addHoverListener(this: HTMLElement) {
    let parent: Element;
    if (this.parentElement) {
      parent = this.parentElement;
    }
    else if (tooltipLayer) {
      parent = tooltipLayer;
    }
    else {
      parent = document.body;
    }

    function hover() {
      setHovering(true);
    }

    function unhover() {
      setHovering(false);
    }

    function addEvents() {
      if ("ontouchstart" in window) {
        parent.addEventListener("touchstart", hover);
        parent.addEventListener("touchend", unhover);
      }
      else {
        parent.addEventListener("mouseenter", hover);
        parent.addEventListener("mouseleave", unhover);
      }
    }

    if (parent.isConnected) {
      addEvents();
    }
    else {
      parent.addEventListener("mount", addEvents, { once: true });
    }

    parent.addEventListener("unmount", () => {
      setHovering(false);
      setVisible(false);
    });

    this.remove();
  }

  function trackMouse() {
    requestAnimationFrame(() => {
      const layerRight = tooltipLayer.clientWidth;
      const layerBottom = tooltipLayer.clientHeight;
      const tooltipRight = tooltip.clientWidth + realtimeMouse.x + 14;
      const tooltipBottom = tooltip.clientHeight + realtimeMouse.y + 14;

      if (tooltipRight >= layerRight) {
        translation.x = "calc(-100% - 1rem)";
      }
      else {
        translation.x = "1rem";
      }
      if (tooltipBottom >= layerBottom) {
        translation.y = "calc(-100% - 1rem)";
      }
      else {
        translation.y = "1rem";
      }

      setMouse(realtimeMouse);
    });
  }

  return (
    [(() => {
Portal.$$slots = {default: () => [(() => {

const _jsx$el0 = _jsx$createTransition(document.createComment(""), (() => {
const _jsx$el0 = _jsx$templ1(); // root[false]/component[true]/conditional[false]/transition[true]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

tooltip = _jsx$el0;
_jsx$trackCssProperty(_jsx$el0, "--x", () => `${mouse().x}px`);
_jsx$trackCssProperty(_jsx$el0, "--y", () => `${mouse().y}px`);
_jsx$trackCssProperty(_jsx$el0, "--pos-x", () => translation.x);
_jsx$trackCssProperty(_jsx$el0, "--pos-y", () => translation.y);
_jsx$addGlobalEvent(window._jsx$global_event_mousemove, _jsx$el0, trackMouse);
_jsx$addGlobalEvent(window._jsx$global_event_touchmove, _jsx$el0, trackMouse);
_jsx$insertChild(_jsx$el1, arguments[1]?.["default"]?.());

return _jsx$el0;
}), () => visible(), "pop");

return _jsx$el0;
})()]}
const _jsx$el0 = Portal({get $ref() { return tooltipLayer }, set $ref(_jsx$v) { tooltipLayer = _jsx$v }, to: "[data-layer=tooltips]", }, Portal.$$slots);

return _jsx$el0;
})(), (() => {
const _jsx$el0 = _jsx$templ3(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]

_jsx$observeTree(_jsx$mutObserver, _jsx$el0, true);
_jsx$addLocalEvent(_jsx$el0, "mount", addHoverListener);

return _jsx$el0;
})(), ]

  );
}
