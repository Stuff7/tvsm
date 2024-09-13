import jsx, { Fragment, reactive, ref, watchOnly } from "jsx";
import Portal from "jsx/components/Portal";
import { showList } from "~/storage";
import { STATUS_VALUES, Status, TvShow } from "~/tvsm";
import { isAnyInputFocused } from "~/utils";
import DateRange from "./DateRange";
import MultiSelect from "./MultiSelect";

export const [filtered, setFiltered] = ref(new Set<number>);

type FilterProps = {
  expandedSection: HTMLElement,
  isExpanded: boolean,
};

export default function Filter(props: FilterProps) {
  let input!: HTMLInputElement;
  const filters = reactive({ name: "", network: "" });
  const [statusFilter, setStatusFilter] = ref(new Set<Status>);
  const [premieredFilter, setPremieredFilter] = ref<[Date, Date]>([new Date, new Date]);
  const [prevEpFilter, setPrevEpFilter] = ref<[Date, Date]>([new Date, new Date]);
  const [nextEpFilter, setNextEpFilter] = ref<[Date, Date]>([new Date, new Date]);

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input.blur();
    }
    else if (!isAnyInputFocused() && e.key.toUpperCase() === "F") {
      e.preventDefault();
      input.focus();
    }
  }

  watchOnly([showList, filters, statusFilter, premieredFilter, prevEpFilter, nextEpFilter], filterByName);

  function isDateInRange(d: Option<Date>, s: Date, e: Date) {
    return !d || +s === +e || (d >= s && d <= e);
  }

  function checkMatch(s: TvShow) {
    return (
      (!filters.name || s.name.includes(filters.name)) &&
      (!filters.network || s.network.includes(filters.network)) &&
      (!statusFilter().size || statusFilter().has(s.status)) &&
      isDateInRange(s.premiered, ...premieredFilter()) &&
      isDateInRange(s.prevEp?.released, ...prevEpFilter()) &&
      isDateInRange(s.nextEp?.released, ...nextEpFilter())
    );
  }

  function areFiltersEmpty() {
    return (
      !filters.name && !filters.network && !statusFilter().size &&
      +premieredFilter()[0] === +premieredFilter()[1] &&
      +prevEpFilter()[0] === +prevEpFilter()[1] &&
      +nextEpFilter()[0] === +nextEpFilter()[1]
    );
  }

  function filterByName() {
    const list = filtered();

    if (areFiltersEmpty()) {
      if (list.size) {
        list.clear();
        setFiltered(list);
      }
      return;
    }

    let changed = false;
    showList().forEach(s => {
      const isMatch = checkMatch(s);
      if (isMatch && list.has(s.id)) {
        list.delete(s.id);
        changed = true;
      }
      else if(!isMatch && !list.has(s.id)) {
        list.add(s.id);
        changed = true;
      }
    });

    if (changed) {
      setFiltered(list);
    }
  }

  return (
    <>
      <Input
        $ref={input}
        value={filters.name}
        placeholder="Search by name"
        g:onkeydown={keyListener}
      />
      <Portal to={props.expandedSection}>
        <strong class:title>Filters</strong>
        <div class:g-divider class:g-horizontal />
        <Input value={filters.network} placeholder="Network" disabled={!props.isExpanded} />
        <MultiSelect
          placeholder="Status"
          options={STATUS_VALUES}
          on:change={setStatusFilter}
        />
        <MultiSelect
          placeholder="Tags"
          options={STATUS_VALUES}
          on:change={setStatusFilter}
        >
          <section class:Tag-input>
            <Input value={filters.name} placeholder="Add tag" />
            <button>Add</button>
          </section>
        </MultiSelect>
        <DateRange
          title="Premiered"
          start={premieredFilter()[0]}
          end={premieredFilter()[1]}
          on:change={(s, e) => setPremieredFilter([s, e])}
        />
        <DateRange
          title="Prev Ep"
          start={prevEpFilter()[0]}
          end={prevEpFilter()[1]}
          on:change={(s, e) => setPrevEpFilter([s, e])}
        />
        <DateRange
          title="Next Ep"
          start={nextEpFilter()[0]}
          end={nextEpFilter()[1]}
          on:change={(s, e) => setNextEpFilter([s, e])}
        />
      </Portal>
    </>
  );
}

type InputProps = {
  $ref?: HTMLInputElement,
  value: string,
  placeholder?: string,
  disabled?: boolean,
  "g:onkeydown"?: (e: KeyboardEvent) => void,
};

function Input(props: InputProps) {
  return (
    <label class:Input g:onkeydown={props["g:onkeydown"]}>
      <i class:input-icn></i>
      <input
        class:g-delegated
        $ref={props.$ref}
        value={props.value}
        on:input={function () { props.value = this.value }}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
      <em class:placeholder>{props.placeholder}</em>
    </label>
  );
}
