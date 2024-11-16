import { trackCssProperty as _jsx$trackCssProperty } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ3 = _jsx$template(`<div role="group" aria-label="Number range slider" class="NumberRange"><input type="range" aria-label="Minimum value" class="knob min"/><div class="progress"></div><input type="range" aria-label="Maximum value" class="knob max"/></div>`);

import { ref, watch } from "jsx";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type NumberRangeProps = {
  minLimit?: number,
  maxLimit?: number,
  step?: number,
  min: number,
  max: number,
  formatter?: (value: number) => unknown,
  "on:min-change": (min: number) => void,
  "on:max-change": (max: number) => void,
};

export default function NumberRange(props: NumberRangeProps) {
  const minLimit = () => props.minLimit ?? 0;
  const maxLimit = () => props.maxLimit ?? 100;
  const step = () => props.step ?? 1;
  const [minFocused, setMinFocused] = ref(true);
  const [minPos, setMinPos] = ref<number>();
  const [maxPos, setMaxPos] = ref<number>();

  watch(() => {
    if (props.min < minLimit()) {
      props["on:min-change"](minLimit());
    }
    if (props.max > maxLimit()) {
      props["on:max-change"](maxLimit());
    }
  });

  watch(() => setMinPos(getInputPosition(props.min)));
  watch(() => setMaxPos(getInputPosition(props.max)));

  function getInputPosition(value: number) {
    return (value - minLimit()) * 100 / (maxLimit() - minLimit());
  }

  function reposition(this: HTMLDivElement, e: MouseTouchEvent) {
    const pos = getCursorPosition(e);

    const x = pos.clientX - this.offsetLeft;
    const p = x * 100 / this.clientWidth;

    const leftDistance = Math.abs(p - minPos());
    const rightDistance = Math.abs(p - maxPos());

    setMinFocused(leftDistance < rightDistance);
  }

  function updMin(this: HTMLInputElement) {
    const value = Number(this.value);
    const max = props.max;

    if (value <= max) {
      props["on:min-change"](value);
    }
    else {
      this.value = max.toString();
      props["on:min-change"](max);
    }
  }

  function updMax(this: HTMLInputElement) {
    const value = Number(this.value);
    const min = props.min;

    if (value >= min) {
      props["on:max-change"](value);
    }
    else {
      this.value = min.toString();
      props["on:max-change"](min);
    }
  }

  return (
    (() => {
const _jsx$el0 = _jsx$templ3(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_self_closing_element

_jsx$trackCssProperty(_jsx$el0, "--NumberRange-left", () => `${minPos()}%`);
_jsx$trackCssProperty(_jsx$el0, "--NumberRange-right", () => `${100 - maxPos()}%`);
_jsx$trackAttribute(_jsx$el0, "data-min", () => props.formatter ? props.formatter(props.min) : props.min);
_jsx$trackAttribute(_jsx$el0, "data-max", () => props.formatter ? props.formatter(props.max) : props.max);
_jsx$addLocalEvent(_jsx$el0, "mousemove", reposition);
_jsx$addLocalEvent(_jsx$el0, "touchmove", reposition);
_jsx$addLocalEvent(_jsx$el0, "click", reposition);
_jsx$trackClass(_jsx$el1, "focused", () => minFocused());
_jsx$trackAttribute(_jsx$el1, "value", () => props.min);
_jsx$addLocalEvent(_jsx$el1, "input", updMin);
_jsx$addLocalEvent(_jsx$el1, "focus", () => setMinFocused(true));
_jsx$trackAttribute(_jsx$el1, "min", () => minLimit());
_jsx$trackAttribute(_jsx$el1, "max", () => maxLimit());
_jsx$trackAttribute(_jsx$el1, "step", () => step());
_jsx$trackClass(_jsx$el3, "focused", () => !minFocused());
_jsx$trackAttribute(_jsx$el3, "value", () => props.max);
_jsx$addLocalEvent(_jsx$el3, "input", updMax);
_jsx$addLocalEvent(_jsx$el3, "focus", () => setMinFocused(false));
_jsx$trackAttribute(_jsx$el3, "min", () => minLimit());
_jsx$trackAttribute(_jsx$el3, "max", () => maxLimit());
_jsx$trackAttribute(_jsx$el3, "step", () => step());

return _jsx$el0;
})()
  );
}
