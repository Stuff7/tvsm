import { reactive, ref, watchFn } from "jsx";
import DatePicker from "./DatePicker";
import { formatDateFullYear, isTargetElement } from "~/utils";

type DateRangeProps = {
  start: Date,
  end: Date,
  ["on:change"]: (start: Date, end: Date) => void,
  title?: string,
};

export default function DateRange(props: DateRangeProps) {
  const open = reactive({ value: false });
  const [isSelectingStart, setIsSelectingStart] = ref(true);
  const [preset, setPreset] = ref("None");

  let insideClick = false;
  let container!: HTMLElement;

  watchFn(preset, () => {
    const p = preset();
    if (p.startsWith("past")) {
      const end = new Date;
      const start = new Date(end);

      if (p === "pastWeek") {
        start.setDate(end.getDate() - 7);
        props["on:change"](start, end);
      }
      else if (p === "pastMonth") {
        start.setMonth(end.getMonth() - 1);
        props["on:change"](start, end);
      }
      else if (p === "past6Months") {
        start.setMonth(end.getMonth() - 6);
        props["on:change"](start, end);
      }
      else if (p === "pastYear") {
        start.setFullYear(end.getFullYear() - 1);
        props["on:change"](start, end);
      }
      else if (p === "pastDecade") {
        start.setFullYear(end.getFullYear() - 10);
        props["on:change"](start, end);
      }
      else if (p === "past20Years") {
        start.setFullYear(end.getFullYear() - 20);
        props["on:change"](start, end);
      }
      else if (p === "past50Years") {
        start.setFullYear(end.getFullYear() - 50);
        props["on:change"](start, end);
      }
      else if (p === "pastCentury") {
        start.setFullYear(end.getFullYear() - 100);
        props["on:change"](start, end);
      }
    }
    else if (p.startsWith("next")) {
      const start = new Date;
      const end = new Date(start);

      if (p === "nextWeek") {
        end.setDate(start.getDate() + 7);
        props["on:change"](start, end);
      }
      else if (p === "nextMonth") {
        end.setMonth(start.getMonth() + 1);
        props["on:change"](start, end);
      }
      else if (p === "next6Months") {
        end.setMonth(start.getMonth() + 6);
        props["on:change"](start, end);
      }
      else if (p === "nextYear") {
        end.setFullYear(start.getFullYear() + 1);
        props["on:change"](start, end);
      }
      else if (p === "nextDecade") {
        end.setFullYear(start.getFullYear() + 10);
        props["on:change"](start, end);
      }
      else if (p === "next20Years") {
        end.setFullYear(start.getFullYear() + 20);
        props["on:change"](start, end);
      }
      else if (p === "next50Years") {
        end.setFullYear(start.getFullYear() + 50);
        props["on:change"](start, end);
      }
      else if (p === "nextCentury") {
        end.setFullYear(start.getFullYear() + 100);
        props["on:change"](start, end);
      }
    }
  });

  function close(this: HTMLElement, e: Event) {
    if (insideClick || (
      e.target instanceof Element && !(e.target instanceof HTMLSelectElement) &&
      isTargetElement(e.target, container)
    )) {
      insideClick = false;
      return;
    }
    open.value = false;
  }

  function updateDate(date: Date) {
    setPreset("None");
    if (isSelectingStart()) {
      props["on:change"](date, props.end);
    }
    else {
      props["on:change"](props.start, date);
    }
  }

  return (
    <article
      class:DateRange
      $ref={container}
      g:onclick={close}
      on:touchstart={() => insideClick = true}
      on:mousedown={() => insideClick = true}
    >
      <button class:g-border on:click={() => {
        open.value = true;
        setIsSelectingStart(true);
      }}>
        <i></i>
        <span>{formatDateFullYear(props.start)}</span>
      </button>
      <i></i>
      <button class:g-border on:click={() => {
        open.value = true;
        setIsSelectingStart(false);
      }}>
        <span>{formatDateFullYear(props.end)}</span>
        <i></i>
      </button>
      <section class:preset-select>
        <span>{props.title ?? "Preset"}: </span>
        <select class:g-border value={preset()} on:change={e => {
          if (e.currentTarget.value === "None") {
            props["on:change"](new Date, new Date);
          }
          setPreset(e.currentTarget.value);
        }}>
          <option value="nextCentury">Next century</option>
          <option value="next50Years">Next 50 years</option>
          <option value="next20Years">Next 20 years</option>
          <option value="nextDecade">Next decade</option>
          <option value="nextYear">Next year</option>
          <option value="next6Months">Next 6 months</option>
          <option value="nextMonth">Next month</option>
          <option value="nextWeek">Next week</option>
          <option value="None" selected>None</option>
          <option value="pastWeek">Past week</option>
          <option value="pastMonth">Past month</option>
          <option value="past6Months">Past 6 months</option>
          <option value="pastYear">Past year</option>
          <option value="pastDecade">Past decade</option>
          <option value="past20Years">Past 20 years</option>
          <option value="past50Years">Past 50 years</option>
          <option value="pastCentury">Past century</option>
        </select>
        <button $if={+props.start !== +props.end} class:g-border on:click={() => {
          setPreset("None");
          props["on:change"](new Date, new Date);
        }}>
          <i></i>
        </button>
        <section $transition:slide={open.value} class:content>
          <DatePicker
            date={isSelectingStart() ? props.start : props.end}
            on:change={updateDate}
          />
        </section>
      </section>
    </article>
  );
}
