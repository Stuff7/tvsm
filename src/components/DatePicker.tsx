import jsx, { reactive, ref, watch, watchOnly } from "jsx";
import Carousel from "./Carousel";
import For from "jsx/components/For";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

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
      <header style:display="flex" style:justify-content="space-between">
        <button on:click={prev}>{"<"}</button>
        <strong>{MONTHS[month.idx]} {year()}</strong>
        <button on:click={next}>{">"}</button>
      </header>
      <Carousel snap spacing={80} page={month.idx} each={MONTHS} do={(_, idx) => {
        const [days, setDays] = ref<number[]>([]);
        watch(() => setDays(Array.from({ length: getDaysInMonth(year(), idx() + 1) }).map((_, i) => i + 1)));

        return (
          <section class:month data-id={idx()}>
            <For each={days()} do={(i) => (
              <button>{i()}</button>
            )} />
          </section>
        );
      }} />
    </article>
  );
}
