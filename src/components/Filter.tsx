import jsx, { Fragment, reactive, ref, watchOnly } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import Portal from "jsx/components/Portal";
import { showList } from "~/storage";
import { STATUS_VALUES, TvShowPreview, Status } from "~/tvsm";
import { isAnyInputFocused } from "~/utils";
import DateRange from "./DateRange";

export const [filtered, setFiltered] = ref(new Set<number>);

type FilterProps = {
  expandedSection: HTMLElement,
  isExpanded: boolean,
};

export default function Filter(props: FilterProps) {
  let input!: HTMLInputElement;
  const filters = reactive({ name: "", network: "" });
  const [statusFilter, setStatusFilter] = ref(new Set<Status>);
  const [premieredFilter, setPremieredFilter] = ref([new Date, new Date]);

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input.blur();
    }
    else if (!isAnyInputFocused() && e.key.toUpperCase() === "F") {
      e.preventDefault();
      input.focus();
    }
  }

  watchOnly([showList, filters, statusFilter, premieredFilter], filterByName);

  function toggleStatus(status: Status) {
    return function (this: HTMLInputElement) {
      if (this.checked) {
        setStatusFilter.byRef(s => s.add(status));
      }
      else {
        setStatusFilter.byRef(s => s.delete(status));
      }
    };
  }

  function checkMatch(s: TvShowPreview) {
    return (
      (!filters.name || s.name.includes(filters.name)) &&
      (!filters.network || s.network.includes(filters.network)) &&
      (!statusFilter().size || statusFilter().has(s.status)) &&
      (!s.premiered || premieredFilter()[0].getTime() === premieredFilter()[1].getTime() ||
       (s.premiered >= premieredFilter()[0] && s.premiered <= premieredFilter()[1]))
    );
  }

  function filterByName() {
    const list = filtered();

    if (
      !filters.name && !filters.network && !statusFilter().size &&
      premieredFilter()[0].getTime() === premieredFilter()[1].getTime()) {
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
        key="name"
        win:onkeydown={keyListener}
      />
      <Portal to={props.expandedSection}>
        <Input value={filters.network} key="network" disabled={!props.isExpanded} />
        <label>
          <p>Filter by premiere</p>
          <DateRange
            start={premieredFilter()[0]}
            end={premieredFilter()[1]}
            on:change={(s, e) => setPremieredFilter([s, e])}
          />
        </label>
        <FixedFor each={STATUS_VALUES} do={(status) => (
          <label>
            <input
              type="checkbox"
              checked={statusFilter().has(status())}
              on:change={toggleStatus(status())}
              disabled={!props.isExpanded}
            />
            <em>{status()}</em>
          </label>
        )} />
      </Portal>
    </>
  );
}

type InputProps = {
  $ref?: HTMLInputElement,
  value: string,
  key: string,
  disabled?: boolean,
  "win:onkeydown"?: (e: KeyboardEvent) => void,
};

function Input(props: InputProps) {
  return (
    <label class:tv-show-filter win:onkeydown={props["win:onkeydown"]}>
      <i class:input-icn></i>
      <input
        class:delegated
        $ref={props.$ref}
        value={props.value}
        on:input={function () { props.value = this.value }}
        placeholder={`Filter by ${props.key}`}
        disabled={props.disabled}
      />
    </label>
  );
}
