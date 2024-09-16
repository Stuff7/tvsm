import jsx, { ref, watch, watchFn } from "jsx";
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
    <div
      class:NumberRange
      role="group"
      aria-label="Number range slider"
      var:NumberRange-left={`${minPos()}%`}
      var:NumberRange-right={`${100 - maxPos()}%`}
      data-min={props.formatter ? props.formatter(props.min) : props.min}
      data-max={props.formatter ? props.formatter(props.max) : props.max}
      on:mousemove={reposition}
      on:touchmove={reposition}
      on:touchstart={reposition}
    >
      <input
        type="range"
        class:knob
        class:min
        class:focused={minFocused()}
        value={props.min}
        on:input={updMin}
        on:focus={() => setMinFocused(true)}
        min={minLimit()}
        max={maxLimit()}
        step={step()}
        aria-label="Minimum value"
      />
      <progress class:progress max={100} value={0} aria-disabled />
      <input
        type="range"
        class:knob
        class:max
        class:focused={!minFocused()}
        value={props.max}
        on:input={updMax}
        on:focus={() => setMinFocused(false)}
        min={minLimit()}
        max={maxLimit()}
        step={step()}
        aria-label="Maximum value"
      />
    </div>
  );
}
