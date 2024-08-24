import jsx, { ref, watchOnly } from "jsx";
import { showList } from "~/storage";
import { isAnyInputFocused } from "~/utils";

export const [filteredShows, setFilteredShows] = ref([...showList()]);

export default function Filter() {
  const [input, setInput] = ref<HTMLInputElement | null>(null);
  const [nameFilter, setNameFilter] = ref("");

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input()?.blur();
    }
    else if (!isAnyInputFocused() && e.key.toUpperCase() === "F") {
      e.preventDefault();
      input()?.focus();
    }
  }

  queueMicrotask(() => {
    document.body.addEventListener("keydown", keyListener);
  });

  function onDestroy() {
    document.body.removeEventListener("keydown", keyListener);
  }

  watchOnly([showList], filterByName);

  function filterByName() {
    const search = nameFilter();
    if (!search) {
      setFilteredShows([...showList()]);
      return;
    }

    setFilteredShows(showList().filter(s => s.name.includes(search)));
  }

  return (
    <label class:tv-show-filter on:unmount={onDestroy}>
      <i></i>
      <input
        class:delegated
        $ref={setInput}
        bind:value={[nameFilter, setNameFilter]}
        on:input={filterByName}
        placeholder="Filter shows by name"
      />
    </label>
  );
}
