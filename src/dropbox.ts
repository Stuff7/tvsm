import { reactive, ref, watch } from "jsx";
import { parseShowList, showList, StorageAPI, tags } from "~/storage";

const DROPBOX_LOCAL_APP_NAME = "TVSM__dropboxAppName";
const DROPBOX_LOCAL_TOKEN = "TVSM__dropboxToken";
const DROPBOX_LOCAL_OAUTH = "TVSM__dropboxOauth";
const DROPBOX_LOCAL_SECRET = "TVSM__dropboxSecret";
const DROPBOX_LOCAL_REFRESH = "TVSM__dropboxRefresh";
const DROPBOX_LOCAL_EXPIRATION = "TVSM__dropboxExpiration";

export const dropboxApp = reactive({
  name: localStorage.getItem(DROPBOX_LOCAL_APP_NAME) || "",
  refresh: localStorage.getItem(DROPBOX_LOCAL_REFRESH) || "",
  token: localStorage.getItem(DROPBOX_LOCAL_TOKEN) || "",
  secret: localStorage.getItem(DROPBOX_LOCAL_SECRET) || "",
  expiration: new Date(localStorage.getItem(DROPBOX_LOCAL_EXPIRATION) || Date.now()),
});
export const [dropboxOauth, setDropboxOauth] = ref(
  new URL(
    localStorage.getItem(DROPBOX_LOCAL_OAUTH) ||
    "https://www.dropbox.com/oauth2/authorize?token_access_type=offline&response_type=code",
  ),
);

setDropboxOauth.byRef(u => u.searchParams.set("redirect_uri", location.origin + location.pathname));

watch(() => localStorage.setItem(DROPBOX_LOCAL_OAUTH, dropboxOauth().href));

watch(() => {
  localStorage.setItem(DROPBOX_LOCAL_APP_NAME, dropboxApp.name);
  localStorage.setItem(DROPBOX_LOCAL_REFRESH, dropboxApp.refresh);
  localStorage.setItem(DROPBOX_LOCAL_TOKEN, dropboxApp.token);
  localStorage.setItem(DROPBOX_LOCAL_SECRET, dropboxApp.secret);
  localStorage.setItem(DROPBOX_LOCAL_EXPIRATION, dropboxApp.expiration.toISOString());
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

function getOAuthURL() {
  const clientId = dropboxOauth().searchParams.get("client_id");
  const clientSecret = dropboxApp.secret;

  if (!clientId || !clientSecret) {
    throw new Error(`Dropbox OAuth missing fields: ${clientId ? "" : "client id "
    }${clientSecret ? "" : "client secret"}`);
  }

  const url = new URL("https://api.dropboxapi.com/oauth2/token");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);

  return url;
}

type RefreshTokenResponse = {
  refresh_token: string,
  access_token: string,
  expires_in: number,
};

function setRefreshToken(data: RefreshTokenResponse) {
  dropboxApp.refresh = data.refresh_token;
  dropboxApp.token = data.access_token;
  dropboxApp.expiration = new Date(Date.now() + data.expires_in * 1000);
}

export async function fetchDropboxToken(code: string) {
  const url = getOAuthURL();
  url.searchParams.set("grant_type", "authorization_code");
  url.searchParams.set("code", code);
  url.searchParams.set("redirect_uri", dropboxOauth().searchParams.get("redirect_uri")!);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    throw new Error(`Dropbox OAuth failed: ${response.statusText}`);
  }

  setRefreshToken(await response.json());
  const self = new URL(location.href);
  self.searchParams.delete("code");
  location.href = self.href;
}

async function refreshToken() {
  const url = getOAuthURL();
  url.searchParams.set("grant_type", "refresh_token");
  url.searchParams.set("refresh_token", dropboxApp.refresh);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    throw new Error(`Dropbox OAuth refresh failed: ${response.statusText}`);
  }

  setRefreshToken(await response.json());
}

async function uploadData(data: string, path: string) {
  if (dropboxApp.expiration.getTime() - 60e3 < Date.now()) {
    await refreshToken();
  }

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
  if (dropboxApp.expiration.getTime() - 60e3 < Date.now()) {
    await refreshToken();
  }

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
