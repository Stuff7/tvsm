import jsx from "jsx";
import { showList } from "~/storage";
import Filter from "~/components/Filter";
import Search, { addShow } from "./Search";
import { selected } from "./List";
import Tooltip from "./Tooltip";

export default function Header() {
  function removeShow() {
    if (!selected.value.size) { return }

    selected.value.forEach(id => {
      selected.value.delete(id);
      const idx = showList.findIndex(s => s.id === id);
      if (idx !== -1) {
        showList.splice(idx, 1);
      }
    });

    // eslint-disable-next-line no-self-assign
    selected.value = selected.value;
  }

  function updateShow() {
    if (!selected.value.size) { return }

    selected.value.forEach(addShow);

    // eslint-disable-next-line no-self-assign
    selected.value = selected.value;
  }

  return (
    <header class:header>
      <p>TVSM</p>
      <div class:divider />
      <Search />
      <div class:divider />
      <button
        class:icon-btn
        disabled={!selected.value.size}
        on:click={removeShow}
        var:button-bg="var(--color-danger)"
        var:button-bg-2="var(--color-danger-2)"
      >
        <i></i>
        <Tooltip>Delete selected shows</Tooltip>
      </button>
      <button
        class:icon-btn
        disabled={!selected.value.size}
        on:click={updateShow}
        var:button-bg="var(--color-ok)"
        var:button-bg-2="var(--color-ok-2)"
      >
        <i></i>
        <Tooltip>Update selected shows</Tooltip>
      </button>
      <div class:divider />
      <Filter />
    </header>
  );
}
