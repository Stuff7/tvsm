import { conditionalRender as _jsx$conditionalRender } from "jsx";
import { template as _jsx$template } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { setAttribute as _jsx$setAttribute } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";

const _jsx$templ3 = _jsx$template(`<strong>Settings</strong>`);
const _jsx$templ19 = _jsx$template(`<div class="g-rows" style="gap:var(--spacing-md);"><a class="g-btn">Download queries<!></a><label class="Input"><i class="input-icn"></i><input placeholder="URL" class="g-delegated"/><em class="placeholder">URL</em></label><label class="Input"><i class="input-icn"></i><input placeholder="Key" class="g-delegated"/><em class="placeholder">Key</em></label></div>`);
const _jsx$templ1 = _jsx$template(`<strong>Settings</strong>`);
const _jsx$templ42 = _jsx$template(`<button class="g-icon-btn"><i></i><!><!></button>`);
const _jsx$templ8 = _jsx$template(`<em>You'll need to run these queries in your database</em>`);
const _jsx$templ36 = _jsx$template(`<div class="g-rows" style="gap:var(--spacing-md);"><label class="Input"><i class="input-icn"></i><input placeholder="App name" class="g-delegated"/><em class="placeholder">App name</em></label><label class="Input"><i class="input-icn"></i><input placeholder="App secret" class="g-delegated"/><em class="placeholder">App secret</em></label><label class="Input"><i class="input-icn"></i><input placeholder="App Key" class="g-delegated"/><em class="placeholder">App Key</em></label><a class="g-btn">Connect</a></div>`);
const _jsx$templ40 = _jsx$template(`<fieldset class="Settings"><legend>Select an storage option</legend><label class="option"><input type="radio" value="postgrest" name="storage"/><span>Postgrest</span></label><!><label class="option"><input type="radio" value="dropbox" name="storage"/><span>Dropbox</span></label><!><label class="option"><input type="radio" value="browser" name="storage"/><span>Browser</span></label></fieldset>`);

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
    (() => {
const _jsx$el0 = _jsx$templ42(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_element

_jsx$addLocalEvent(_jsx$el0, "click", () => open.value = !open.value);
Tooltip.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ1(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el3, Tooltip({}, Tooltip.$$slots));
Dialog.$$slots = {header: (() => {
const _jsx$el0 = _jsx$templ3(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
}), content: (() => {
const _jsx$el0 = _jsx$templ40(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_self_closing_element
const _jsx$el5 = _jsx$el4.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_text
const _jsx$el7 = _jsx$el3.nextSibling; // jsx_element
const _jsx$el8 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el9 = _jsx$el8.firstChild; // jsx_self_closing_element
const _jsx$el10 = _jsx$el9.nextSibling; // jsx_element
const _jsx$el11 = _jsx$el10.firstChild; // jsx_text
const _jsx$el12 = _jsx$el8.nextSibling; // jsx_element
const _jsx$el13 = _jsx$el12.nextSibling; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_self_closing_element
const _jsx$el15 = _jsx$el14.nextSibling; // jsx_element
const _jsx$el16 = _jsx$el15.firstChild; // jsx_text

_jsx$addLocalEvent(_jsx$el0, "change", updateStorageOption);
_jsx$setAttribute(_jsx$el4, "checked", storageOption() === STORAGE_POSTGREST);
_jsx$conditionalRender(_jsx$el7, (() => {
const _jsx$el0 = _jsx$templ19(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_text
const _jsx$el3 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el4 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_text
const _jsx$el7 = _jsx$el5.nextSibling; // jsx_self_closing_element
const _jsx$el8 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el9 = _jsx$el8.firstChild; // jsx_text
const _jsx$el10 = _jsx$el4.nextSibling; // jsx_element
const _jsx$el11 = _jsx$el10.firstChild; // jsx_element
const _jsx$el12 = _jsx$el11.firstChild; // jsx_text
const _jsx$el13 = _jsx$el11.nextSibling; // jsx_self_closing_element
const _jsx$el14 = _jsx$el13.nextSibling; // jsx_element
const _jsx$el15 = _jsx$el14.firstChild; // jsx_text

_jsx$setAttribute(_jsx$el1, "href", location.pathname.endsWith("/") ? "queries/init.sql" : `${location.pathname}/queries/init.sql`);
Tooltip.$$slots = {default: () => [(() => {
const _jsx$el0 = _jsx$templ8(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_text


return _jsx$el0;
})()]};
_jsx$insertChild(_jsx$el3, Tooltip({}, Tooltip.$$slots));
_jsx$setAttribute(_jsx$el7, "value", supabase.url);
_jsx$addLocalEvent(_jsx$el7, "input", e => supabase.url = e.currentTarget.value);
_jsx$setAttribute(_jsx$el13, "value", supabase.key);
_jsx$addLocalEvent(_jsx$el13, "input", e => supabase.key = e.currentTarget.value);

return _jsx$el0;
}), () => storageOption() === STORAGE_POSTGREST);
_jsx$setAttribute(_jsx$el9, "checked", storageOption() === STORAGE_DROPBOX);
_jsx$conditionalRender(_jsx$el12, (() => {
const _jsx$el0 = _jsx$templ36(); // root[false]/component[false]/conditional[true]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text
const _jsx$el4 = _jsx$el2.nextSibling; // jsx_self_closing_element
const _jsx$el5 = _jsx$el4.nextSibling; // jsx_element
const _jsx$el6 = _jsx$el5.firstChild; // jsx_text
const _jsx$el7 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el8 = _jsx$el7.firstChild; // jsx_element
const _jsx$el9 = _jsx$el8.firstChild; // jsx_text
const _jsx$el10 = _jsx$el8.nextSibling; // jsx_self_closing_element
const _jsx$el11 = _jsx$el10.nextSibling; // jsx_element
const _jsx$el12 = _jsx$el11.firstChild; // jsx_text
const _jsx$el13 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_element
const _jsx$el15 = _jsx$el14.firstChild; // jsx_text
const _jsx$el16 = _jsx$el14.nextSibling; // jsx_self_closing_element
const _jsx$el17 = _jsx$el16.nextSibling; // jsx_element
const _jsx$el18 = _jsx$el17.firstChild; // jsx_text
const _jsx$el19 = _jsx$el13.nextSibling; // jsx_element
const _jsx$el20 = _jsx$el19.firstChild; // jsx_text

_jsx$setAttribute(_jsx$el4, "value", dropboxApp.name);
_jsx$addLocalEvent(_jsx$el4, "input", e => dropboxApp.name = e.currentTarget.value);
_jsx$setAttribute(_jsx$el10, "value", dropboxApp.secret);
_jsx$addLocalEvent(_jsx$el10, "input", e => dropboxApp.secret = e.currentTarget.value);
_jsx$setAttribute(_jsx$el16, "value", dropboxOauth().searchParams.get("client_id"));
_jsx$addLocalEvent(_jsx$el16, "input", e => setDropboxOauth.byRef(u => u.searchParams.set("client_id", e.currentTarget.value)));
_jsx$trackAttribute(_jsx$el19, "href", () => dropboxOauth().href);

return _jsx$el0;
}), () => storageOption() === STORAGE_DROPBOX);
_jsx$setAttribute(_jsx$el14, "checked", storageOption() === STORAGE_BROWSER);

return _jsx$el0;
}), };
_jsx$insertChild(_jsx$el4, Dialog({get $open() { return open.value }, set $open(_jsx$v) { open.value = _jsx$v }, center: true, }, Dialog.$$slots));

return _jsx$el0;
})()
  );
}
