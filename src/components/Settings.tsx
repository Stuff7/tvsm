import { reactive } from "jsx";
import Dialog from "./Dialog";
import Tooltip from "./Tooltip";
import { supabase } from "~/supabase";
import {
  setStorageOption,
  STORAGE_BROWSER,
  STORAGE_DROPBOX,
  STORAGE_POSTGREST,
  storageOption,
  StorageOption,
} from "~/storage";
import { dropboxApp, dropboxOauth, setDropboxOauth } from "~/dropbox";

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
          <label class:option>
            <input
              type="radio"
              value="postgrest"
              name="storage"
              checked={storageOption() === STORAGE_POSTGREST}
            />
            <span>Postgrest</span>
          </label>
          <div $if={storageOption() === STORAGE_POSTGREST} class:g-rows style:gap="var(--spacing-md)">
            <a
              class:g-btn
              href={location.pathname.endsWith("/") ? "queries/init.sql" : `${location.pathname}/queries/init.sql`}
            >
              Download queries
              <Tooltip>
                <em>You'll need to run these queries in your database</em>
              </Tooltip>
            </a>
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={supabase.url}
                placeholder="URL"
                on:input={e => supabase.url = e.currentTarget.value}
              />
              <em class:placeholder>URL</em>
            </label>
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={supabase.key}
                placeholder="Key"
                on:input={e => supabase.key = e.currentTarget.value}
              />
              <em class:placeholder>Key</em>
            </label>
          </div>
          <label class:option>
            <input
              type="radio"
              value="dropbox"
              name="storage"
              checked={storageOption() === STORAGE_DROPBOX}
            />
            <span>Dropbox</span>
          </label>
          <div $if={storageOption() === STORAGE_DROPBOX} class:g-rows style:gap="var(--spacing-md)">
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={dropboxApp.name}
                placeholder="App name"
                on:input={e => dropboxApp.name = e.currentTarget.value}
              />
              <em class:placeholder>App name</em>
            </label>
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={dropboxApp.secret}
                placeholder="App secret"
                on:input={e => dropboxApp.secret = e.currentTarget.value}
              />
              <em class:placeholder>App secret</em>
            </label>
            <label class:Input>
              <i class:input-icn></i>
              <input
                class:g-delegated
                value={dropboxOauth().searchParams.get("client_id")}
                placeholder="App Key"
                on:input={e => setDropboxOauth.byRef(u => u.searchParams.set("client_id", e.currentTarget.value))}
              />
              <em class:placeholder>App Key</em>
            </label>
            <a class:g-btn $href={dropboxOauth().href}>Connect</a>
          </div>
          <label class:option>
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
