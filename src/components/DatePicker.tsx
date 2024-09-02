import jsx, { reactive, ref, watchFn, watchOnly } from "jsx";
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
};

export default function DatePicker(props: DatePickerProps) {
  const [year, setYear] = ref(props.date.getFullYear());
  const month = reactive({ idx: props.date.getMonth() });

  function next() {
    month.idx = circularClamp(month.idx + 1, MONTHS);
  }

  function prev() {
    month.idx = circularClamp(month.idx - 1, MONTHS);
  }

  watchOnly([month], (v: number) => {
    if (month.idx === 11 && v === 0) {
      setYear(year() - 1);
    }
    else if (month.idx === 0 && v === 11) {
      setYear(year() + 1);
    }
  });

  return (
    <article class:date-picker>
      <header class:controls>
        <button on:click={prev}><i></i></button>
        <strong>{MONTHS[month.idx]} {year()}</strong>
        <button on:click={next}><i></i></button>
      </header>
      <nav class:week>
        <FixedFor each={DAYS} do={(day) => <span>{day()}</span>} />
      </nav>
      <Carousel snap vertical={props.vertical} spacing={40} page={month.idx} each={MONTHS} do={(_, idx, position) => {
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
              <button class:offset-days>{i()}</button>
            )} />
            <For each={days()} do={(i) => (
              <button>{i()}</button>
            )} />
            <For each={nextDays()} do={(i) => (
              <button class:offset-days>{i()}</button>
            )} />
          </section>
        );
      }} />
    </article>
  );
}

type MonthSelectorProps = {
  month: number,
};

export function MonthSelector(props: MonthSelectorProps) {
  const page = reactive({ idx: circularClamp(props.month - 2, MONTHS) });

  return (
    <div class:year-selector>
      <Carousel
        itemsPerPage={5}
        vertical
        snap
        each={MONTHS}
        page={page.idx}
        spacing={10}
        do={(month, idx, position) => {
          const selected = position === 3;

          function selectMonth() {
            page.idx = circularClamp(idx() - 2, MONTHS);
          }

          if (selected) {
            watchFn(month, () => props.month = idx());
          }

          return (
            <button class:selected={selected} on:click={selectMonth} on:touchstart={selectMonth}>{month()}</button>
          );
        }}
      />
    </div>
  );
}

type YearSelectorProps = {
  year: number,
};

export function YearSelector(props: YearSelectorProps) {
  const [years, setYears] = ref<number[]>(Array.from({ length: 7 }, (_, i) => props.year - 2 + i));
  const page = reactive({ idx: 0 });

  return (
    <div class:year-selector>
      <Carousel
        itemsPerPage={5}
        vertical
        snap
        each={years()}
        page={page.idx}
        spacing={10}
        do={(year, idx, position) => {
          const selected = position === 3;
          function selectYear() {
            page.idx = circularClamp(idx() - 2, years());
          }

          if (selected) {
            watchFn(year, () => props.year = year());
          }
          else if (position === 4) {
            watchFn(idx, () => setYears.byRef(years => years[circularClamp(idx() + 2, years)] = year() + 2));
          }
          else if (position === 2) {
            watchFn(idx, () => setYears.byRef(years => years[circularClamp(idx() - 2, years)] = year() - 2));
          }

          return (
            <button class:selected={selected} on:click={selectYear} on:touchstart={selectYear}>{year()}</button>
          );
        }}
      />
    </div>
  );
}
