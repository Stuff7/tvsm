import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";
import { trackClass as _jsx$trackClass } from "jsx";

const _jsx$templ19 = _jsx$template(`<section><!></section>`);
const _jsx$templ24 = _jsx$template(`<button class="g-transparent"><!></button>`);
const _jsx$templ20 = _jsx$template(`<article class="DatePicker"><header class="controls"><button class="nav g-border"><i></i></button><button class="select g-border"><span><!> <strong><!></strong></span><i></i></button><button class="nav g-border"><i></i></button></header><header class="week"><!></header><!><!></article>`);
const _jsx$templ28 = _jsx$template(`<div class="ScrollSelector"><!></div>`);
const _jsx$templ15 = _jsx$template(`<button><!></button>`);
const _jsx$templ21 = _jsx$template(`<button class="g-transparent"><!></button>`);
const _jsx$templ26 = _jsx$template(`<section><!></section>`);
const _jsx$templ9 = _jsx$template(`<span><!></span>`);
const _jsx$templ14 = _jsx$template(`<section style="grid-auto-flow:column;"><!><!></section>`);
const _jsx$templ17 = _jsx$template(`<section class="month"><!></section>`);
const _jsx$templ23 = _jsx$template(`<div class="ScrollSelector"><!></div>`);

import { reactive, ref, watchFn } from "jsx";
import Carousel from "./Carousel";
import FixedFor from "jsx/components/FixedFor";
import { circularClamp } from "~/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MONTH_LEN = 7 * 6;

function getDaysInMonth(fullYear: number, month: number) {
  return new Date(fullYear, month, 0).getDate();
}

type DatePickerProps = {
  vertical?: boolean,
  date: Date,
  ["on:change"]: (date: Date) => void,
};

export default function DatePicker(props: DatePickerProps) {
  const year = () => props.date.getFullYear();
  const month = () => props.date.getMonth();
  const [monthYearSelectorVisible, setMonthYearSelectorVisible] = ref(false);

  function next() {
    updMonth(circularClamp(month() + 1, MONTHS));
  }

  function prev() {
    updMonth(circularClamp(month() - 1, MONTHS));
  }

  function setByRef(fn: (date: Date) => void) {
    fn(props.date);
    props["on:change"](props.date);
  }

  function updMonth(v: number) {
    const prev = month();
    props.date.setMonth(v);
    props.date.setDate(1);

    if (v === 11 && prev === 0) {
      props.date.setFullYear(year() - 1);
    }
    else if (v === 0 && prev === 11) {
      props.date.setFullYear(year() + 1);
    }

    props["on:change"](props.date);
  }

  return (
    (() => {
const _jsx$el0 = _jsx$templ20(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_text
const _jsx$el5 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_expression
const _jsx$el8 = _jsx$el7.nextSibling; // jsx_text
const _jsx$el9 = _jsx$el8.nextSibling; // jsx_element
const _jsx$el10 = _jsx$el9.firstChild; // jsx_expression
const _jsx$el11 = _jsx$el6.nextSibling; // jsx_element
const _jsx$el12 = _jsx$el11.firstChild; // jsx_text
const _jsx$el13 = _jsx$el5.nextSibling; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_element
const _jsx$el15 = _jsx$el14.firstChild; // jsx_text
const _jsx$el16 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el17 = _jsx$el16.firstChild; // jsx_self_closing_element
const _jsx$el18 = _jsx$el16.nextSibling; // jsx_element
const _jsx$el19 = _jsx$el18.nextSibling; // jsx_element

_jsx$addLocalEvent(_jsx$el2, "click", prev);
_jsx$trackClass(_jsx$el5, "selecting", () => monthYearSelectorVisible());
_jsx$addLocalEvent(_jsx$el5, "click", () => setMonthYearSelectorVisible(!monthYearSelectorVisible()));
_jsx$insertChild(_jsx$el7, () => MONTHS[month()]);
_jsx$insertChild(_jsx$el10, () => year());
_jsx$addLocalEvent(_jsx$el13, "click", next);
FixedFor.$$slots = {};
_jsx$insertChild(_jsx$el17, FixedFor({get each() { return DAYS.map(d => d.slice(0, 2)) }, do: (day) => (() => {
const _jsx$el0 = _jsx$templ9(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$insertChild(_jsx$el1, () => day());

return _jsx$el0;
})(), }));
_jsx$conditionalRender(_jsx$el18, (() => {
const _jsx$el0 = _jsx$templ14(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_self_closing_element

YearSelector.$$slots = {};
_jsx$insertChild(_jsx$el1, YearSelector({get year() { return props.date.getFullYear() }, "on:change": year => setByRef(date => {
            date.setDate(1);
            date.setFullYear(year);
          }), }));
MonthSelector.$$slots = {};
_jsx$insertChild(_jsx$el2, MonthSelector({get month() { return props.date.getMonth() }, "on:change": month => setByRef(date => {
            date.setDate(1);
            date.setMonth(month);
          }), }));

return _jsx$el0;
}), () => monthYearSelectorVisible());
_jsx$conditionalRender(_jsx$el19, (() => {
const _jsx$el0 = _jsx$templ19(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

Carousel.$$slots = {};
_jsx$insertChild(_jsx$el1, Carousel({snap: true, get vertical() { return props.vertical }, spacing: "40px", get page() { return month() }, "on:change": updMonth, get each() { return MONTHS }, do: (_, idx, position) => {
            const monthOffset = reactive({ curr: 0, next: 0 });
            const [days, setDays] = ref<number[]>(Array.from({ length: MONTH_LEN }));
            const [currYear, setCurrYear] = ref(0);

            watchFn(() => [idx(), year()], () => {
              const i = idx();
              const y = year();

              if (position === 0 && i === 11) {
                setCurrYear(y - 1);
              }
              else if (position === 2 && i === 0) {
                setCurrYear(y + 1);
              }
              else {
                setCurrYear(y);
              }
            });

            function setPrevDays(days: number[]) {
              const monthIdx = idx();
              monthOffset.curr = new Date(currYear(), monthIdx, 1).getDay() || 7;
              const daysPrevMonth = getDaysInMonth(monthIdx === 0 ? currYear() - 1 : currYear(), monthIdx);

              for (let i = 0; i < monthOffset.curr; i++) {
                days[i] = daysPrevMonth - monthOffset.curr + 1 + i;
              }
            }

            watchFn(() => [currYear(), idx()], () => {
              const len = getDaysInMonth(currYear(), idx() + 1);
              if (days().length === len) { return }

              setDays.byRef(days => {
                setPrevDays(days);
                monthOffset.next = monthOffset.curr + len;

                for (let i = monthOffset.curr; i < monthOffset.next; i++) {
                  days[i] = i - monthOffset.curr + 1;
                }

                setNextDays(days);
              });
            });

            function setNextDays(days: number[]) {
              for (let i = monthOffset.next; i < MONTH_LEN; i++) {
                days[i] = i - monthOffset.next + 1;
              }
            }

            function selectDay(pos: number) {
              setByRef(date => {
                if (pos < monthOffset.curr) {
                  date.setMonth(date.getMonth() - 1);
                }
                else if (pos >= monthOffset.next) {
                  date.setMonth(date.getMonth() + 1);
                }
                date.setDate(days()[pos]);
              });
            }

            const isOffsetDay = (pos: number) => pos < monthOffset.curr || pos >= monthOffset.next;

            const isSelected = (pos: number) => (
              !isOffsetDay(pos) && props.date.getMonth() === idx() && props.date.getDate() === days()[pos]
            );

            return (
              (() => {
const _jsx$el0 = _jsx$templ17(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

_jsx$trackAttribute(_jsx$el0, "data-id", () => idx());
FixedFor.$$slots = {};
_jsx$insertChild(_jsx$el1, FixedFor({get each() { return days() }, do: (i, pos) => (
                  (() => {
const _jsx$el0 = _jsx$templ15(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$trackClass(_jsx$el0, "g-border", () => !isSelected(pos));
_jsx$trackClass(_jsx$el0, "offset-days", () => isOffsetDay(pos));
_jsx$trackClass(_jsx$el0, "weekend", () => pos % 7 === 0 || pos % 7 === 6);
_jsx$addLocalEvent(_jsx$el0, "click", () => selectDay(pos));
_jsx$trackAttribute(_jsx$el0, "tabindex", () => position === 1 ? 0 : -1);
_jsx$insertChild(_jsx$el1, () => i());

return _jsx$el0;
})()
                ), }));

return _jsx$el0;
})()
            );
          }, }));

return _jsx$el0;
}), () => !monthYearSelectorVisible());

return _jsx$el0;
})()
  );
}

type MonthSelectorProps = {
  month: number,
  ["on:change"]: (month: number) => void,
};

export function MonthSelector(props: MonthSelectorProps) {
  return (
    (() => {
const _jsx$el0 = _jsx$templ23(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

Carousel.$$slots = {};
_jsx$insertChild(_jsx$el1, Carousel({itemsPerPage: 5, vertical: true, snap: true, get each() { return MONTHS }, get page() { return props.month }, "on:change": props["on:change"], do: (month, idx, position) => {
          const selected = position === 3;

          function selectMonth() {
            props["on:change"](idx());
          }

          return (
            (() => {
const _jsx$el0 = _jsx$templ21(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$trackClass(_jsx$el0, "selected", () => selected);
_jsx$addLocalEvent(_jsx$el0, "click", selectMonth);
_jsx$insertChild(_jsx$el1, () => month());

return _jsx$el0;
})()
          );
        }, }));

return _jsx$el0;
})()
  );
}

type YearSelectorProps = {
  year: number,
  ["on:change"]: (year: number) => void,
};

export function YearSelector(props: YearSelectorProps) {
  const [yearPeriods, setYearPeriods] = ref([0, 0, 0]);
  const [page, setPage] = ref(1);
  const [selected, setSelected] = ref(2);

  watchFn(() => props.year, () => {
    setYearPeriods.byRef(periods => {
      const idx = page();
      const pos = props.year % 5;
      const period = props.year - pos + 2;
      periods[idx] = period;
      periods[circularClamp(idx - 1, periods)] = period - 5;
      periods[circularClamp(idx + 1, periods)] = period + 5;
      setSelected(pos);
    });
  });

  let firstRun = true;
  watchFn(page, () => {
    if (!firstRun) {
      setSelected(2);
      props["on:change"](yearPeriods()[page()]);
    }
    else {
      firstRun = false;
    }
  });

  return (
    (() => {
const _jsx$el0 = _jsx$templ28(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

Carousel.$$slots = {};
_jsx$insertChild(_jsx$el1, Carousel({vertical: true, snap: true, get each() { return yearPeriods() }, get page() { return page() }, "on:change": setPage, do: (period) => {
          const [years, setYears] = ref<number[]>(Array.from({ length: 5 }));

          watchFn(period, () => {
            setYears.byRef(years => {
              years.forEach((_, i) => years[i] = period() - 2 + i);
            });
          });

          return (
            (() => {
const _jsx$el0 = _jsx$templ26(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element

FixedFor.$$slots = {};
_jsx$insertChild(_jsx$el1, FixedFor({get each() { return years() }, do: (year, i) => (
                (() => {
const _jsx$el0 = _jsx$templ24(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$trackClass(_jsx$el0, "selected", () => selected() === i);
_jsx$addLocalEvent(_jsx$el0, "click", () => props["on:change"](year()));
_jsx$insertChild(_jsx$el1, () => year());

return _jsx$el0;
})()
              ), }));

return _jsx$el0;
})()
          );
        }, }));

return _jsx$el0;
})()
  );
}
