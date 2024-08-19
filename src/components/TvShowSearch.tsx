import jsx, { Fragment, reactive, ref } from "jsx";
import * as Storage from "~/storage";
import { findShowByID, TvShowPreview } from "~/tvsm";
import { isAnyInputFocused } from "~/utils";
import Dialog from "./Dialog";

export default function TvShowSearch() {
  const visible = ref(true);
  const text = ref("");
  const shows = reactive<TvShowPreview[]>([]);
  const selectedIdx = ref(0);
  const focused = ref(false);
  const input = ref<HTMLInputElement | null>(null);

  function keyListener(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIdx.value = (selectedIdx.value + 1) % shows.length;
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIdx.value = selectedIdx.value === 0 ? shows.length - 1 : selectedIdx.value - 1;
    }
    else if (e.key === "Enter") {
      addShow(shows[selectedIdx.value].id);
    }
    else if (e.key === "Escape") {
      input.value?.blur();
    }
    else if (!isAnyInputFocused() && e.key === "/") {
      e.preventDefault();
      visible.value = true;
      input.value?.focus();
    }
  }

  async function addShow(id: number) {
    const show = await findShowByID(id);

    if (!show) {
      console.warn("Show with id", id, "not found");
      return;
    }

    Storage.local.insert(show);
  }

  queueMicrotask(() => {
    document.body.addEventListener("keydown", keyListener);
  });

  return (
    <>
      <button class:add-show on:click={() => visible.value = !visible.value}>
        <i></i>
        <div class:divider />
        <strong>Add Show <em>[/]</em></strong>
      </button>
      <Dialog
        $if={visible.value}
        x={600}
        y={400}
      >
        <label class:show-search slot="header">
          <i></i>
          <input
            ref={input}
            value={text.value}
            on:focus={() => focused.value = true}
            on:blur={() => focused.value = false}
            placeholder="Search shows"
          />
        </label>
        <div slot="content">
          Hello <strong>LOL</strong>
        </div>
      </Dialog>
    </>
  );
}
