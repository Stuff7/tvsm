import { reactive } from "jsx";
import Dialog from "./Dialog";
import Tooltip from "./Tooltip";
import { supabase } from "~/supabase";
import { setStorageOption, STORAGE_BROWSER, STORAGE_POSTGREST, storageOption, StorageOption } from "~/storage";

export default function Settings() {
  const open = reactive({ value: false });

  function updateStorageOption(e: Event) {
    if (e.target instanceof HTMLInputElement && e.target.name === "storage") {
      setStorageOption(e.target.value as StorageOption);
    }
  }

  return (
    <button
      class:g-icon-btn
      on:click={() => open.value = !open.value}
    >
      <i></i>
      <Tooltip>
        <strong>Settings</strong>
      </Tooltip>
      <Dialog $open={open.value} center>
        <strong slot="header">Settings</strong>
        <fieldset slot="content" class:Settings on:change={updateStorageOption}>
          <legend>Select an storage option</legend>
          <label>
            <input
              type="radio"
              value="postgrest"
              name="storage"
              checked={storageOption() === STORAGE_POSTGREST}
            />
            <span>Postgrest</span>
          </label>
          <div $if={storageOption() === STORAGE_POSTGREST} class:g-rows style:gap="var(--spacing-md)">
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={supabase.url}
                on:input={e => supabase.url = e.currentTarget.value}
              />
              <em class:placeholder>Supabase URL</em>
            </label>
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={supabase.key}
                on:input={e => supabase.key = e.currentTarget.value}
              />
              <em class:placeholder>Supabase Key</em>
            </label>
          </div>
          <label>
            <input
              type="radio"
              value="browser"
              name="storage"
              checked={storageOption() === STORAGE_BROWSER}
            />
            <span>Browser</span>
          </label>
        </fieldset>
      </Dialog>
    </button>
  );
}
