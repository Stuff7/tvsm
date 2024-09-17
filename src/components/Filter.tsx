import jsx, { Fragment, ref, watchFn, watchOnly } from "jsx";
import Portal from "jsx/components/Portal";
import { setTags, showList, tags } from "~/storage";
import { STATUS_VALUES, Status, TvShow } from "~/tvsm";
import { isAnyInputFocused, isDateInRange, isNumberInRange } from "~/utils";
import DateRange from "./DateRange";
import MultiSelect from "./MultiSelect";
import { selected } from "./List";
import NumberRange from "./NumberRange";

export const [filtered, setFiltered] = ref(new Set<number>);

type FilterProps = {
  expandedSection: HTMLElement,
  isExpanded: boolean,
};

export default function Filter(props: FilterProps) {
  let input!: HTMLInputElement;
  const [nameFilter, setNameFilter] = ref("");
  const [networks, setNetworks] = ref([] as string[]);
  const [networkFilter, setNetworkFilter] = ref(new Set<string>);
  const [networksOpen, setNetworksOpen] = ref(false);
  const [statusFilter, setStatusFilter] = ref(new Set<Status>);
  const [inputTag, setInputTag] = ref("");
  const [tagFilter, setTagFilter] = ref(new Set<string>);
  const [premieredFilter, setPremieredFilter] = ref<[Date, Date]>([new Date, new Date]);
  const [prevEpFilter, setPrevEpFilter] = ref<[Date, Date]>([new Date, new Date]);
  const [nextEpFilter, setNextEpFilter] = ref<[Date, Date]>([new Date, new Date]);
  const seasonsLimit = useRangeLimits(s => s.seasons, () => props.isExpanded);
  const [minSeasons, setMinSeasons] = ref(0);
  const [maxSeasons, setMaxSeasons] = ref(10);
  const ratingLimit = useRangeLimits(s => s.rating || 0, () => props.isExpanded);
  const [minRating, setMinRating] = ref(0);
  const [maxRating, setMaxRating] = ref(10);

  watchFn(() => [showList(), networksOpen(), props.isExpanded], () => {
    if (networksOpen() && props.isExpanded) {
      setNetworks([...new Set(showList().map(s => s.network).sort())]);
    }
  });

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input.blur();
    }
    else if (!isAnyInputFocused() && e.key.toUpperCase() === "F") {
      e.preventDefault();
      input.focus();
    }
  }

  watchOnly([
    showList,
    nameFilter,
    networkFilter,
    tagFilter,
    statusFilter,
    premieredFilter,
    prevEpFilter,
    nextEpFilter,
    minSeasons,
    maxSeasons,
    minRating,
    maxRating,
  ], filterByName);

  function addTag() {
    setTags.byRef(tags => {
      for (const t of [inputTag(), ...tagFilter()]) {
        if (!t) { continue }
        if (tags[t]) {
          tags[t] = new Set([...tags[t], ...selected()]);
        }
        else {
          tags[t] = new Set(selected());
        }
      }
    });
  }

  function remTag() {
    setTags.byRef(tags => {
      const selectedTags = tagFilter();
      const selectedIds = selected();

      for (const t of selectedTags) {
        for (const id of selectedIds) {
          tags[t].delete(id);
        }

        if (!tags[t].size) {
          delete tags[t];
        }
      }
    });
  }

  function showHasTag(s: TvShow) {
    if (!tagFilter().size) {
      return true;
    }

    for (const tag of tagFilter()) {
      if (tags()[tag]?.has(s.id)) {
        return true;
      }
    }

    return false;
  }

  function checkMatch(s: TvShow) {
    return (
      (!nameFilter() || s.name.includes(nameFilter())) &&
      (!networkFilter().size || networkFilter().has(s.network)) &&
      (!statusFilter().size || statusFilter().has(s.status)) &&
      showHasTag(s) &&
      isDateInRange(s.premiered, ...premieredFilter()) &&
      isDateInRange(s.prevEp?.released, ...prevEpFilter()) &&
      isDateInRange(s.nextEp?.released, ...nextEpFilter()) &&
      isNumberInRange(s.seasons, minSeasons(), maxSeasons()) &&
      isNumberInRange(s.rating || 0, minRating(), maxRating())
    );
  }

  function filterByName() {
    const list = filtered();

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
        value={nameFilter()}
        on:change={setNameFilter}
        placeholder="Search by name"
        g:onkeydown={keyListener}
      />
      <Portal to={props.expandedSection}>
        <strong class:title>Filters</strong>
        <div class:g-divider class:g-horizontal />
        <MultiSelect
          placeholder="Network"
          options={networks()}
          on:change={setNetworkFilter}
          on:expand={setNetworksOpen}
        />
        <MultiSelect
          placeholder="Status"
          options={STATUS_VALUES}
          on:change={setStatusFilter}
        />
        <MultiSelect
          placeholder="Tags"
          options={Object.keys(tags())}
          on:change={setTagFilter}
        >
          <section class:Tag-input>
            <Input
              value={inputTag()}
              on:change={setInputTag}
              placeholder="New tag"
            />
            <button class:g-border on:click={addTag}><i>+</i></button>
            <button class:g-border on:click={remTag}><i></i></button>
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
        <label class:Filter-label>
          <span>Seasons</span>
          <NumberRange
            min={minSeasons()}
            max={maxSeasons()}
            on:min-change={setMinSeasons}
            on:max-change={setMaxSeasons}
            minLimit={seasonsLimit().min}
            maxLimit={seasonsLimit().max}
          />
        </label>
        <label class:Filter-label>
          <span>Rating</span>
          <NumberRange
            min={minRating()}
            max={maxRating()}
            on:min-change={setMinRating}
            on:max-change={setMaxRating}
            formatter={n => n.toFixed(1)}
            step={0.1}
            minLimit={ratingLimit().min}
            maxLimit={ratingLimit().max}
          />
        </label>
      </Portal>
    </>
  );
}

function useRangeLimits(getter: (s: TvShow) => number, isExpanded: () => boolean): () => { min: number, max: number } {
  const [limit, setLimit] = ref({ min: NaN, max: NaN });

  watchFn(() => [showList(), isExpanded()], () => {
    if (isExpanded()) {
      setLimit.byRef(limit => {
        const list = showList();
        for (const s of list) {
          const n = getter(s);
          if (isNaN(limit.min) || n < limit.min) {
            limit.min = n;
          }
          if (isNaN(limit.max) || n > limit.max) {
            limit.max = n;
          }
        }
      });
    }
  });

  return limit;
}

type InputProps = {
  $ref?: HTMLInputElement,
  value: string,
  "on:change": (value: string) => void,
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
        on:input={e => props["on:change"](e.currentTarget.value)}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
      <em class:placeholder>{props.placeholder}</em>
    </label>
  );
}
