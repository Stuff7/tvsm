import { createGlobalEvent as _jsx$createGlobalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { template as _jsx$template } from "jsx";
import { addGlobalEvent as _jsx$addGlobalEvent } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { setAttribute as _jsx$setAttribute } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";

const _jsx$templ26 = _jsx$template(`<label class="Input"><i class="input-icn"></i><input class="g-delegated"/><em class="placeholder"><!></em></label>`);
const _jsx$templ20 = _jsx$template(`<label class="Filter-label"><span>Rating</span><!></label>`);
const _jsx$templ2 = _jsx$template(`<div class="g-divider g-horizontal"></div>`);
const _jsx$templ10 = _jsx$template(`<section class="Tag-input"><!><button class="g-border"><i>+</i></button><button class="g-border"><i></i></button></section>`);
const _jsx$templ1 = _jsx$template(`<strong class="title">Filters</strong>`);
const _jsx$templ17 = _jsx$template(`<label class="Filter-label"><span>Seasons</span><!></label>`);

window._jsx$global_event_keydown = window._jsx$global_event_keydown || _jsx$createGlobalEvent("keydown");
import { ref, watchFn, watchOnly } from "jsx";
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

  let lastMax = seasonsLimit().max;
  watchFn(seasonsLimit, () => {
    if (lastMax !== seasonsLimit().max) {
      lastMax = seasonsLimit().max;
      setMaxSeasons(seasonsLimit().max);
    }
  });

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
    [(() => {
Input.$$slots = {}
const _jsx$el0 = Input({get $ref() { return input }, set $ref(_jsx$v) { input = _jsx$v }, get value() { return nameFilter() }, "on:change": setNameFilter, placeholder: "Search by name", "g:onkeydown": keyListener, });

return _jsx$el0;
})(), (() => {
Portal.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ1(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[true]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
})(),(() => {
const _jsx$el0 = _jsx$templ2(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]


return _jsx$el0;
})(),(() => {
MultiSelect.$$slots = {}
const _jsx$el0 = MultiSelect({placeholder: "Network", get options() { return networks() }, "on:change": setNetworkFilter, "on:expand": setNetworksOpen, });

return _jsx$el0;
})(),(() => {
MultiSelect.$$slots = {}
const _jsx$el0 = MultiSelect({placeholder: "Status", get options() { return STATUS_VALUES }, "on:change": setStatusFilter, });

return _jsx$el0;
})(),(() => {
MultiSelect.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ10(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_text
const _jsx$el5 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_text

Input.$$slots = {};
_jsx$insertChild(_jsx$el1, Input({get value() { return inputTag() }, "on:change": setInputTag, placeholder: "New tag", }));
_jsx$addLocalEvent(_jsx$el2, "click", addTag);
_jsx$addLocalEvent(_jsx$el5, "click", remTag);

return _jsx$el0;
})()]}
const _jsx$el0 = MultiSelect({placeholder: "Tags", get options() { return Object.keys(tags()) }, "on:change": setTagFilter, }, MultiSelect.$$slots);

return _jsx$el0;
})(),(() => {
DateRange.$$slots = {}
const _jsx$el0 = DateRange({title: "Premiered", get start() { return premieredFilter()[0] }, get end() { return premieredFilter()[1] }, "on:change": (s, e) => setPremieredFilter([s, e]), });

return _jsx$el0;
})(),(() => {
DateRange.$$slots = {}
const _jsx$el0 = DateRange({title: "Prev Ep", get start() { return prevEpFilter()[0] }, get end() { return prevEpFilter()[1] }, "on:change": (s, e) => setPrevEpFilter([s, e]), });

return _jsx$el0;
})(),(() => {
DateRange.$$slots = {}
const _jsx$el0 = DateRange({title: "Next Ep", get start() { return nextEpFilter()[0] }, get end() { return nextEpFilter()[1] }, "on:change": (s, e) => setNextEpFilter([s, e]), });

return _jsx$el0;
})(),(() => {
const _jsx$el0 = _jsx$templ17(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element

NumberRange.$$slots = {};
_jsx$insertChild(_jsx$el3, NumberRange({get min() { return minSeasons() }, get max() { return maxSeasons() }, "on:min-change": setMinSeasons, "on:max-change": setMaxSeasons, get minLimit() { return seasonsLimit().min }, get maxLimit() { return seasonsLimit().max }, }));

return _jsx$el0;
})(),(() => {
const _jsx$el0 = _jsx$templ20(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element

NumberRange.$$slots = {};
_jsx$insertChild(_jsx$el3, NumberRange({get min() { return minRating() }, get max() { return maxRating() }, "on:min-change": setMinRating, "on:max-change": setMaxRating, formatter: n => n.toFixed(1), step: 0.1, get minLimit() { return ratingLimit().min }, get maxLimit() { return ratingLimit().max }, }));

return _jsx$el0;
})()]}
const _jsx$el0 = Portal({get to() { return props.expandedSection }, }, Portal.$$slots);

return _jsx$el0;
})(), ]

  );
}

function useRangeLimits(getter: (s: TvShow) => number, isExpanded: () => boolean): () => { min: number, max: number } {
  const [limit, setLimit] = ref({ min: NaN, max: NaN });

  watchFn(() => [showList(), isExpanded()], () => {
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
    (() => {
const _jsx$el0 = _jsx$templ26(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_self_closing_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_expression

_jsx$addGlobalEvent(window._jsx$global_event_keydown, _jsx$el0, props["g:onkeydown"]);
props.$ref = _jsx$el3;
_jsx$setAttribute(_jsx$el3, "value", props.value);
_jsx$addLocalEvent(_jsx$el3, "input", e => props["on:change"](e.currentTarget.value));
_jsx$trackAttribute(_jsx$el3, "placeholder", () => props.placeholder);
_jsx$trackAttribute(_jsx$el3, "disabled", () => props.disabled);
_jsx$insertChild(_jsx$el5, () => props.placeholder);

return _jsx$el0;
})()
  );
}
