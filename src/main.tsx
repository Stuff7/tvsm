import { ref } from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";
import { getShowById, insertShow, supabase } from "./supabase";
import { showList } from "./storage";

let insertId!: HTMLInputElement;
let getId!: HTMLInputElement;
const [isRightSidebarExpanded, setIsRightSidebarExpanded] = ref(false);
const [err, setErr] = ref("");

function insertDb(e: SubmitEvent) {
  e.preventDefault();
  insertShow(showList()[+insertId.value || 0])
    .then(async (r) => {
      if (r.ok) {
        console.log(r);
      }
      else {
        const e = await r.json();
        if (e?.message) {
          throw e.message;
        }
        else {
          throw e;
        }
      }
    })
    .catch(e => {
      setErr(`${e}`);
      console.error(e);
    });
}

function getDb(e: SubmitEvent) {
  e.preventDefault();
  getShowById(+getId.value || 0)
    .then(async (r) => {
      if (r.ok) {
        console.log(await r.json());
      }
      else {
        const e = await r.json();
        if (e?.message) {
          throw e.message;
        }
        else {
          throw e;
        }
      }
    })
    .catch(e => {
      setErr(`${e}`);
      console.error(e);
    });
}

document.body.append(<div data-layer="modals" />, <div data-layer="tooltips" />);
document.body.prepend(
  <main>
    <Header expanded={isRightSidebarExpanded()} on:expand={setIsRightSidebarExpanded} />
    <List expanded={isRightSidebarExpanded()} />
  </main>,
  <div $if={!!(supabase.key && supabase.url)}>
    <form on:submit={insertDb}>
      <input $ref={insertId} placeholder="Insert show in supabase" />
      <pre>{err()}</pre>
      <button style:display="none" />
    </form>
    <form on:submit={getDb}>
      <input $ref={getId} placeholder="Get show from supabase" />
      <pre>{err()}</pre>
      <button style:display="none" />
    </form>
  </div>,
);
