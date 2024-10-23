import { reactive, ref } from "jsx";
import { showList, setShowList } from "~/storage";
import Filter from "~/components/Filter";
import Search, { addShow } from "./Search";
import { selected, setSelected } from "./List";
import Tooltip from "./Tooltip";
import Dialog from "./Dialog";
import { delayCall } from "~/utils";
import { supabase } from "~/supabase";

type HeaderProps = {
  expanded: boolean,
  ["on:expand"]: (expanded: boolean) => void,
};

export default function Header(props: HeaderProps) {
  const [rightSidebar, setRightSidebar] = ref<HTMLElement>();
  const importExportDialog = reactive({ open: false });

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

  async function updateShow() {
    if (!selected().size) { return }

    for (const s of selected()) {
      await addShow(s);
    }
  }

  let importInput!: HTMLInputElement;
  async function importShows(e: SubmitEvent) {
    e.preventDefault();
    const ids = importInput.value.split(" ");
    for (const i of ids) {
      const id = +i;
      if (isNaN(id)) { continue }
      await delayCall(async () => await addShow(id));
    }
  }

  const settingsDialog = reactive({ open: false });

  return (
    <>
      <header class:Header class:expanded={props.expanded}>
        <p class:logo>TVSM</p>
        <div class:g-divider />
        <button
          class:g-icon-btn
          on:click={() => settingsDialog.open = !settingsDialog.open}
        >
          <i></i>
          <Tooltip>
            <strong>Settings</strong>
          </Tooltip>
          <Dialog $open={settingsDialog.open} center>
            <strong slot="header">Settings</strong>
            <form slot="content" class:Settings>
              <input
                placeholder="Supabase URL"
                on:input={e => supabase.url = e.currentTarget.value}
              />
              <input
                placeholder="Supabase key"
                on:input={e => supabase.key = e.currentTarget.value}
              />
            </form>
          </Dialog>
        </button>
        <Search />
        <button
          class:g-icon-btn
          on:click={() => importExportDialog.open = !importExportDialog.open}
        >
          <i></i>
          <Tooltip>
            <strong>Import / Export</strong>
          </Tooltip>
          <Dialog $open={importExportDialog.open} center>
            <strong slot="header">Import / Export</strong>
            <form slot="content" class:ImportExport on:submit={importShows}>
              <input
                readonly
                placeholder="Select shows to export"
                $value={importExportDialog.open ? [...selected()].join(" ") : ""}
                on:click={e => e.currentTarget.select()}
              />
              <input $ref={importInput} placeholder="Import by id i.e '1 2 3'" />
              <button />
            </form>
          </Dialog>
        </button>
        <div class:g-divider />
        <button
          class:g-icon-btn
          $disabled={!selected().size}
          on:click={removeShow}
          var:button-bg="var(--color-danger)"
          var:button-bg-2="var(--color-danger-2)"
        >
          <i></i>
          <Tooltip>Delete selected shows</Tooltip>
        </button>
        <button
          class:g-icon-btn
          $disabled={!selected().size}
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
      <aside class:RightSidebar class:expanded={props.expanded} $refFn={setRightSidebar}>
        <button class:close class:g-border on:click={() => props["on:expand"](false)}>
          <i></i>
        </button>
      </aside>
    </>
  );
}
