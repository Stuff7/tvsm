import jsx, { Fragment, ref } from "jsx";
import { showList, setShowList } from "~/storage";
import Filter from "~/components/Filter";
import Search, { addShow } from "./Search";
import { selected, setSelected } from "./List";
import Tooltip from "./Tooltip";

type HeaderProps = {
  expanded: boolean,
  ["on:expand"]: (expanded: boolean) => void,
};

export default function Header(props: HeaderProps) {
  const [rightSidebar, setRightSidebar] = ref<HTMLElement>();

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
    <>
      <header class:Header class:expanded={props.expanded}>
        <p class:logo>TVSM</p>
        <div class:g-divider />
        <Search />
        <div class:g-divider />
        <button
          class:g-icon-btn
          disabled={!selected().size}
          on:click={removeShow}
          var:button-bg="var(--color-danger)"
          var:button-bg-2="var(--color-danger-2)"
        >
          <i></i>
          <Tooltip>Delete selected shows</Tooltip>
        </button>
        <button
          class:g-icon-btn
          disabled={!selected().size}
          on:click={updateShow}
          var:button-bg="var(--color-ok)"
          var:button-bg-2="var(--color-ok-2)"
        >
          <i></i>
          <Tooltip>Update selected shows</Tooltip>
        </button>
        <div class:g-divider />
        <Filter expandedSection={rightSidebar()} isExpanded={props.expanded} />
        <div class:g-divider />
        <button class:g-icon-btn on:click={(e) => {
          e.currentTarget.focus();
          props["on:expand"](!props.expanded);
        }}>
          <Tooltip>More filtering options</Tooltip>
          <i></i>
        </button>
      </header>
      <aside class:RightSidebar class:expanded={props.expanded} $ref={setRightSidebar}>
        <button class:close class:g-border on:click={() => props["on:expand"](false)}>
          <i></i>
        </button>
      </aside>
    </>
  );
}
