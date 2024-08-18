import jsx, { reactive, ref, watchOnly } from "jsx";
import { showList } from "~/storage";

export const filteredShows = reactive([...showList]);

export default function TvShowFilter() {
  const focused = ref(false);
  const input = ref<HTMLInputElement | null>(null);
  const nameFilter = ref("");

  function keyListener(e: KeyboardEvent) {
    if (e.key === "Escape") {
      input.value?.blur();
    }
    else if (!focused.value && e.key.toUpperCase() === "F") {
      input.value?.focus();
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
    filteredShows.length = showList.length;
    showList.forEach((s, i) => filteredShows[i] = s);

    if (!nameFilter.value) { return }

    for (let i = filteredShows.length - 1; i >= 0; i--) {
      if (!filteredShows[i].name.includes(nameFilter.value)) {
        filteredShows.splice(i, 1);
      }
    }
  }

  return (
    <label class:tv-show-filter on:unmount={onDestroy}>
      <i></i>
      <input
        ref={input}
        bind:value={nameFilter}
        on:input={filterByName}
        on:focus={() => focused.value = true}
        on:blur={() => focused.value = false}
        placeholder="Filter shows by name"
      />
    </label>
  );
}
