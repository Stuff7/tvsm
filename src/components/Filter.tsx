import jsx, { ref, watchOnly } from "jsx";
import { showList } from "~/storage";
import { isAnyInputFocused } from "~/utils";

export const [filtered, setFiltered] = ref(new Set<number>);

export default function Filter() {
  let input!: HTMLInputElement;
  const [nameFilter, setNameFilter] = ref("");

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input.blur();
    }
    else if (!isAnyInputFocused() && e.key.toUpperCase() === "F") {
      e.preventDefault();
      input.focus();
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
    const list = filtered();

    if (!search) {
      if (list.size) {
        list.clear();
        setFiltered(list);
      }
      return;
    }

    let changed = false;
    showList().forEach(s => {
      const isMatch = s.name.includes(search);
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
    <label class:tv-show-filter on:unmount={onDestroy}>
      <i></i>
      <input
        class:delegated
        $ref={input}
        bind:value={[nameFilter, setNameFilter]}
        on:input={filterByName}
        placeholder="Filter shows by name"
      />
    </label>
  );
}
