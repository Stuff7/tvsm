import jsx, { reactive, ref, watchFn, watchOnly } from "jsx";
import Carousel from "./Carousel";
import For from "jsx/components/For";
import FixedFor from "jsx/components/FixedFor";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(fullYear: number, month: number) {
  return new Date(fullYear, month, 0).getDate();
}

export default function DatePicker() {
  const [year, setYear] = ref(new Date().getFullYear());
  const month = reactive({ idx: 0 });

  function next() {
    const n = month.idx + 1;
    month.idx = n === MONTHS.length ? 0 : n;
  }

  function prev() {
    const n = month.idx - 1;
    month.idx = n < 0 ? MONTHS.length - 1 : n;
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
      <Carousel snap spacing={40} page={month.idx} each={MONTHS} do={(_, idx, position) => {
        const [days, setDays] = ref<number[]>([]);
        const [prevDays, setPrevDays] = ref<number[]>([]);
        const [nextDays, setNextDays] = ref<number[]>([]);
        const [currYear, setCurrYear] = ref(0);

        watchFn(() => [idx(), year()], () => {
          const pos = position();
          const i = idx();
          const y = year();

          if (pos === 0 && i === 11) {
            setCurrYear(y - 1);
          }
          else if (pos === 2 && i === 0) {
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

          setPrevDays(Array.from({ length: firstDayMonth }).map((_, i) => daysPrevMonth - firstDayMonth + 1 + i));
        });

        watchFn(() => [currYear(), idx()], () => {
          const dayCount = prevDays().length + days().length;
          setNextDays(Array.from({ length: 42 - dayCount }).map((_, i) => i + 1));
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
