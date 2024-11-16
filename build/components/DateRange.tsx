import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { template as _jsx$template } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { createTransition as _jsx$createTransition } from "jsx";
import { setAttribute as _jsx$setAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ31 = _jsx$template(`<article class="DateRange"><button class="g-border"><i></i><span><!></span></button><i></i><button class="g-border"><span><!></span><i></i></button><section class="preset-select"><span><!>: </span><select class="g-border"><option value="nextCentury">Next century</option><option value="next50Years">Next 50 years</option><option value="next20Years">Next 20 years</option><option value="nextDecade">Next decade</option><option value="nextYear">Next year</option><option value="next6Months">Next 6 months</option><option value="nextMonth">Next month</option><option value="nextWeek">Next week</option><option value="None" selected>None</option><option value="pastWeek">Past week</option><option value="pastMonth">Past month</option><option value="past6Months">Past 6 months</option><option value="pastYear">Past year</option><option value="pastDecade">Past decade</option><option value="past20Years">Past 20 years</option><option value="past50Years">Past 50 years</option><option value="pastCentury">Past century</option></select><!><!></section></article>`);
const _jsx$templ29 = _jsx$template(`<section class="content"><!></section>`);
const _jsx$templ27 = _jsx$template(`<button class="g-border"><i></i></button>`);

window._jsx$global_event_click = window._jsx$global_event_click || _jsx$createGlobalEvent("click");
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
    (() => {
const _jsx$el0 = _jsx$templ31(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text
const _jsx$el4 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_expression
const _jsx$el6 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_text
const _jsx$el8 = _jsx$el6.nextSibling; // jsx_element
const _jsx$el9 = _jsx$el8.firstChild; // jsx_element
const _jsx$el10 = _jsx$el9.firstChild; // jsx_expression
const _jsx$el11 = _jsx$el9.nextSibling; // jsx_element
const _jsx$el12 = _jsx$el11.firstChild; // jsx_text
const _jsx$el13 = _jsx$el8.nextSibling; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_element
const _jsx$el15 = _jsx$el14.firstChild; // jsx_expression
const _jsx$el16 = _jsx$el15.nextSibling; // jsx_text
const _jsx$el17 = _jsx$el14.nextSibling; // jsx_element
const _jsx$el18 = _jsx$el17.firstChild; // jsx_element
const _jsx$el19 = _jsx$el18.firstChild; // jsx_text
const _jsx$el20 = _jsx$el18.nextSibling; // jsx_element
const _jsx$el21 = _jsx$el20.firstChild; // jsx_text
const _jsx$el22 = _jsx$el20.nextSibling; // jsx_element
const _jsx$el23 = _jsx$el22.firstChild; // jsx_text
const _jsx$el24 = _jsx$el22.nextSibling; // jsx_element
const _jsx$el25 = _jsx$el24.firstChild; // jsx_text
const _jsx$el26 = _jsx$el24.nextSibling; // jsx_element
const _jsx$el27 = _jsx$el26.firstChild; // jsx_text
const _jsx$el28 = _jsx$el26.nextSibling; // jsx_element
const _jsx$el29 = _jsx$el28.firstChild; // jsx_text
const _jsx$el30 = _jsx$el28.nextSibling; // jsx_element
const _jsx$el31 = _jsx$el30.firstChild; // jsx_text
const _jsx$el32 = _jsx$el30.nextSibling; // jsx_element
const _jsx$el33 = _jsx$el32.firstChild; // jsx_text
const _jsx$el34 = _jsx$el32.nextSibling; // jsx_element
const _jsx$el35 = _jsx$el34.firstChild; // jsx_text
const _jsx$el36 = _jsx$el34.nextSibling; // jsx_element
const _jsx$el37 = _jsx$el36.firstChild; // jsx_text
const _jsx$el38 = _jsx$el36.nextSibling; // jsx_element
const _jsx$el39 = _jsx$el38.firstChild; // jsx_text
const _jsx$el40 = _jsx$el38.nextSibling; // jsx_element
const _jsx$el41 = _jsx$el40.firstChild; // jsx_text
const _jsx$el42 = _jsx$el40.nextSibling; // jsx_element
const _jsx$el43 = _jsx$el42.firstChild; // jsx_text
const _jsx$el44 = _jsx$el42.nextSibling; // jsx_element
const _jsx$el45 = _jsx$el44.firstChild; // jsx_text
const _jsx$el46 = _jsx$el44.nextSibling; // jsx_element
const _jsx$el47 = _jsx$el46.firstChild; // jsx_text
const _jsx$el48 = _jsx$el46.nextSibling; // jsx_element
const _jsx$el49 = _jsx$el48.firstChild; // jsx_text
const _jsx$el50 = _jsx$el48.nextSibling; // jsx_element
const _jsx$el51 = _jsx$el50.firstChild; // jsx_text
const _jsx$el52 = _jsx$el17.nextSibling; // jsx_element
const _jsx$el53 = _jsx$el52.nextSibling; // jsx_element

_jsx$trackClass(_jsx$el0, "open", () => open.value);
container = _jsx$el0;
_jsx$addGlobalEvent(window._jsx$global_event_click, _jsx$el0, close);
_jsx$addLocalEvent(_jsx$el0, "touchstart", () => insideClick = true);
_jsx$addLocalEvent(_jsx$el0, "mousedown", () => insideClick = true);
_jsx$addLocalEvent(_jsx$el1, "click", () => {
        open.value = true;
        setIsSelectingStart(true);
      });
_jsx$insertChild(_jsx$el5, () => formatDateFullYear(props.start));
_jsx$addLocalEvent(_jsx$el8, "click", () => {
        open.value = true;
        setIsSelectingStart(false);
      });
_jsx$insertChild(_jsx$el10, () => formatDateFullYear(props.end));
_jsx$insertChild(_jsx$el15, () => props.title ?? "Preset");
_jsx$setAttribute(_jsx$el17, "value", preset());
_jsx$addLocalEvent(_jsx$el17, "change", e => {
          if (e.currentTarget.value === "None") {
            props["on:change"](new Date, new Date);
          }
          setPreset(e.currentTarget.value);
        });
_jsx$conditionalRender(_jsx$el52, (() => {
const _jsx$el0 = _jsx$templ27(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text

_jsx$addLocalEvent(_jsx$el0, "click", () => {
          setPreset("None");
          props["on:change"](new Date, new Date);
        });

return _jsx$el0;
}), () => +props.start !== +props.end);
_jsx$createTransition(_jsx$el53, (() => {
const _jsx$el0 = _jsx$templ29(); // root[false]/component[false]/conditional[false]/transition[true]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

DatePicker.$$slots = {};
_jsx$insertChild(_jsx$el1, DatePicker({get date() { return isSelectingStart() ? props.start : props.end }, "on:change": updateDate, }));

return _jsx$el0;
}), () => open.value, "slide");

return _jsx$el0;
})()
  );
}
