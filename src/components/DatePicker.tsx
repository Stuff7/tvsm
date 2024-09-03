import jsx, { ref, watchFn } from "jsx";
import Carousel from "./Carousel";
import For from "jsx/components/For";
import FixedFor from "jsx/components/FixedFor";
import { circularClamp } from "~/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  function next() {
    updMonth(circularClamp(month() + 1, MONTHS));
  }

  function prev() {
    updMonth(circularClamp(month() - 1, MONTHS));
  }

  function updMonth(v: number) {
    const prev = month();
    props.date.setMonth(v);

    if (v === 11 && prev === 0) {
      props.date.setFullYear(year() - 1);
    }
    else if (v === 0 && prev === 11) {
      props.date.setFullYear(year() + 1);
    }

    props["on:change"](props.date);
  }

  return (
    <article class:date-picker>
      <header class:controls>
        <button class:nav class:border on:click={prev}><i></i></button>
        <button class:select class:border>{MONTHS[month()]} {year()}</button>
        <button class:nav class:border on:click={next}><i></i></button>
      </header>
      <nav class:week>
        <FixedFor each={DAYS} do={(day) => <span>{day()}</span>} />
      </nav>
      <Carousel
        snap
        vertical={props.vertical}
        spacing={40}
        page={month()}
        on:change={updMonth}
        each={MONTHS}
        do={(_, idx, position) => {
          const [days, setDays] = ref<number[]>([]);
          const [prevDays, setPrevDays] = ref<number[]>([]);
          const [nextDays, setNextDays] = ref<number[]>([]);
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

          watchFn(() => [currYear(), idx()], () => {
            const length = getDaysInMonth(currYear(), idx() + 1);
            if (days().length === length) { return }

            setDays.byRef(days => {
              if (length < days.length) {
                days.length = length;
              }
              else {
                for (let i = days.length; i < length; i++) {
                  days.push(i + 1);
                }
              }
            });
          });

          watchFn(() => [currYear(), idx()], () => {
            const monthIdx = idx();
            const firstDayMonth = new Date(currYear(), monthIdx, 1).getDay() || 7;
            const daysPrevMonth = getDaysInMonth(monthIdx === 0 ? currYear() - 1 : currYear(), monthIdx);

            setPrevDays(Array.from({ length: firstDayMonth }, (_, i) => daysPrevMonth - firstDayMonth + 1 + i));
          });

          watchFn(() => [currYear(), idx()], () => {
            const dayCount = prevDays().length + days().length;
            setNextDays(Array.from({ length: 42 - dayCount }, (_, i) => i + 1));
          });

          return (
            <section class:month data-id={idx()}>
              <For each={prevDays()} do={(i) => (
                <button class:border class:offset-days>{i()}</button>
              )} />
              <For each={days()} do={(i) => (
                <button class:border>{i()}</button>
              )} />
              <For each={nextDays()} do={(i) => (
                <button class:border class:offset-days>{i()}</button>
              )} />
            </section>
          );
        }}
      />
    </article>
  );
}

type MonthSelectorProps = {
  month: number,
  ["on:change"]: (month: number) => void,
};

export function MonthSelector(props: MonthSelectorProps) {
  return (
    <div class:scroll-selector>
      <Carousel
        itemsPerPage={5}
        vertical
        snap
        each={MONTHS}
        page={circularClamp(props.month - 2, MONTHS)}
        on:change={month => props["on:change"](circularClamp(month + 2, MONTHS))}
        do={(month, idx, position) => {
          const selected = position === 3;

          function selectMonth() {
            props["on:change"](idx());
          }

          return (
            <button
              class:selected={selected}
              class:transparent
              on:click={selectMonth}
              on:touchstart={selectMonth}
            >{month()}</button>
          );
        }}
      />
    </div>
  );
}

type YearSelectorProps = {
  year: number,
  ["on:change"]: (year: number) => void,
};

export function YearSelector(props: YearSelectorProps) {
  const [years, setYears] = ref<number[]>(Array.from({ length: 7 }, genYears));
  const [page, setPage] = ref(0);
  const updYear = (idx: number) => props["on:change"](years()[circularClamp(idx + 2, years())]);

  function genYears(_: unknown, i: number) {
    return props.year - 2 + i;
  }

  watchFn(() => props.year, () => {
    const i = years().indexOf(props.year);
    if (i < 0) {
      setYears.byRef(years => years.forEach((_, i) => years[i] = genYears(_, i)));
      setPage(1);
    }
    else {
      setPage(circularClamp(years().indexOf(props.year) - 2, years()));
    }
  });

  return (
    <div class:scroll-selector>
      <Carousel
        itemsPerPage={5}
        vertical
        snap
        each={years()}
        page={page()}
        on:change={updYear}
        do={(year, idx, position) => {
          const selected = position === 3;

          function selectYear() {
            updYear(idx() - 2);
          }

          if (position === 4) {
            watchFn(idx, () => {
              setYears.byRef(years => years[circularClamp(idx() + 2, years)] = year() + 2);
            });
          }
          else if (position === 2) {
            watchFn(idx, () => {
              setYears.byRef(years => years[circularClamp(idx() - 2, years)] = year() - 2);
            });
          }

          return (
            <button
              class:selected={selected}
              class:transparent
              on:click={selectYear}
              on:touchstart={selectYear}
            >{year()}</button>
          );
        }}
      />
    </div>
  );
}
