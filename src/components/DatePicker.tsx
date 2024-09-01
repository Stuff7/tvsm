import jsx, { reactive, ref, watch } from "jsx";
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

    if (n === MONTHS.length) {
      month.idx = 0;
      setYear(year() + 1);
    }
    else {
      month.idx = n;
    }
  }

  function prev() {
    const n = month.idx - 1;

    if (n < 0) {
      month.idx = MONTHS.length - 1;
      setYear(year() - 1);
    }
    else {
      month.idx = n;
    }
  }

  return (
    <div class:date-picker>
      <div style:display="flex" style:justify-content="space-between">
        <button on:click={prev}>{"<"}</button>
        <span>{MONTHS[month.idx]} {year()}</span>
        <button on:click={next}>{">"}</button>
      </div>
      <Carousel snap spacing={80} page={month.idx} each={MONTHS} do={(_, idx) => {
        const [days, setDays] = ref<number[]>([]);
        watch(() => setDays(Array.from({ length: getDaysInMonth(year(), idx() + 1) }).map((_, i) => i + 1)));

        return (
          <section class:month data-id={idx()}>
            <For each={days()} do={(i) => (
              <span>{i()}</span>
            )} />
          </section>
        );
      }} />
    </div>
  );
}
