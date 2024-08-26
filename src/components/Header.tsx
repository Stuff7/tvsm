import jsx, { ref } from "jsx";
import { showList, setShowList } from "~/storage";
import Filter from "~/components/Filter";
import Search, { addShow } from "./Search";
import { selected, setSelected } from "./List";
import Tooltip from "./Tooltip";

export default function Header() {
  const [expandedSection, setExpandedSection] = ref<HTMLElement>();
  const [expanded, setExpanded] = ref(false);

  function removeShow() {
    if (!selected().size) { return }

    setSelected.byRef(selected => {
      selected.forEach(id => {
        selected.delete(id);
        const idx = showList().findIndex(s => s.id === id);
        if (idx !== -1) {
          setShowList.byRef(list => list.splice(idx, 1));
        }
      });
    });
  }

  function updateShow() {
    if (!selected().size) { return }

    selected().forEach(addShow);
  }

  return (
    <header class:tvsm-header class:expanded={expanded()}>
      <p>TVSM</p>
      <div class:divider />
      <Search />
      <div class:divider />
      <button
        class:icon-btn
        disabled={!selected().size}
        on:click={removeShow}
        var:button-bg="var(--color-danger)"
        var:button-bg-2="var(--color-danger-2)"
      >
        <i></i>
        <Tooltip>Delete selected shows</Tooltip>
      </button>
      <button
        class:icon-btn
        disabled={!selected().size}
        on:click={updateShow}
        var:button-bg="var(--color-ok)"
        var:button-bg-2="var(--color-ok-2)"
      >
        <i></i>
        <Tooltip>Update selected shows</Tooltip>
      </button>
      <div class:divider />
      <Filter expandedSection={expandedSection()} isExpanded={expanded()} />
      <div class:divider />
      <button class:icon-btn on:click={() => setExpanded(!expanded())}>
        <Tooltip>More filtering options</Tooltip>
        <i></i>
      </button>
      <section class:extra-content $ref={setExpandedSection} />
    </header>
  );
}
