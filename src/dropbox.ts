import { reactive, watch } from "jsx";
import { parseShowList, showList, StorageAPI, tags } from "~/storage";

const DROPBOX_LOCAL_APP_NAME = "TVSM__dropboxAppName";
const DROPBOX_LOCAL_TOKEN = "TVSM__dropboxToken";
export const dropboxApp = reactive({
  name: localStorage.getItem(DROPBOX_LOCAL_APP_NAME) || "",
  token: localStorage.getItem(DROPBOX_LOCAL_TOKEN) || "",
});

watch(() => {
  localStorage.setItem(DROPBOX_LOCAL_APP_NAME, dropboxApp.name);
  localStorage.setItem(DROPBOX_LOCAL_TOKEN, dropboxApp.token);
});

export const dropbox: StorageAPI = {
  async loadShows() {
    return parseShowList(await fetchData("showList.json"));
  },
  async loadTags() {
    return JSON.parse(await fetchData("tags.json") || "{}", (_, v) => (
      v instanceof Array ? new Set(v) : v
    ));
  },
  saveTags() {
    uploadData(JSON.stringify(tags(), (_, v) => (
      v instanceof Set ? [...v] : v
    )), "tags.json");
  },
  upsertShows() {
    uploadData(JSON.stringify(showList()), "showList.json");
  },
};

async function uploadData(data: string, path: string) {
  const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dropboxApp.token}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: `/Apps/${dropboxApp.name}/${path}`,
        mode: "overwrite",
        autorename: false,
        mute: false,
      }),
      "Content-Type": "application/octet-stream",
    },
    body: new Blob([data], { type: "application/json" }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

async function fetchData(path: string) {
  const response = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dropboxApp.token}`,
      "Dropbox-API-Arg": JSON.stringify({ path: `/Apps/${dropboxApp.name}/${path}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  return response.text();
}
