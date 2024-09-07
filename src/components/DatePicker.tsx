import jsx, { reactive, ref, watchFn } from "jsx";
import Carousel from "./Carousel";
import FixedFor from "jsx/components/FixedFor";
import { circularClamp, formatDateFullYear } from "~/utils";

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
    <article class:date-picker>
      <header class:controls>
        <button class:nav class:border on:click={prev}><i></i></button>
        <button
          class:select
          class:border
          class:selecting={monthYearSelectorVisible()}
          on:click={() => setMonthYearSelectorVisible(!monthYearSelectorVisible())}
        >
          <span>{MONTHS[month()]} <strong>{year()}</strong></span>
          <i></i>
        </button>
        <button class:nav class:border on:click={next}><i></i></button>
      </header>
      <header class:week>
        <FixedFor each={DAYS.map(d => d.slice(0, 2))} do={(day) => <span>{day()}</span>} />
      </header>
      <section $if={monthYearSelectorVisible()} style:grid-auto-flow="column">
        <YearSelector
          year={props.date.getFullYear()}
          on:change={year => setByRef(date => {
            date.setDate(1);
            date.setFullYear(year);
          })}
        />
        <MonthSelector
          month={props.date.getMonth()}
          on:change={month => setByRef(date => {
            date.setDate(1);
            date.setMonth(month);
          })}
        />
      </section>
      <section $if={!monthYearSelectorVisible()}>
        <Carousel
          snap
          vertical={props.vertical}
          spacing="40px"
          page={month()}
          on:change={updMonth}
          each={MONTHS}
          do={(_, idx, position) => {
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
              <section class:month data-id={idx()}>
                <FixedFor each={days()} do={(i, pos) => (
                  <button
                    class:border={!isSelected(pos)}
                    class:offset-days={isOffsetDay(pos)}
                    class:weekend={pos % 7 === 0 || pos % 7 === 6}
                    on:click={() => selectDay(pos)}
                    tabindex={position === 1 ? 0 : -1}
                  >{i()}</button>
                )} />
              </section>
            );
          }}
        />
      </section>
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
        page={props.month}
        on:change={props["on:change"]}
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
    <div class:scroll-selector>
      <Carousel
        vertical
        snap
        each={yearPeriods()}
        page={page()}
        on:change={setPage}
        do={(period) => {
          const [years, setYears] = ref<number[]>(Array.from({ length: 5 }));

          watchFn(period, () => {
            setYears.byRef(years => {
              years.forEach((_, i) => years[i] = period() - 2 + i);
            });
          });

          return (
            <section>
              <FixedFor each={years()} do={(year, i) => (
                <button
                  class:selected={selected() === i}
                  class:transparent
                  on:click={() => props["on:change"](year())}
                >
                  {year()}
                </button>
              )} />
            </section>
          );
        }}
      />
    </div>
  );
}
