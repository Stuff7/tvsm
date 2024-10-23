import { ref } from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";
import { insertShow, supabase } from "./supabase";
import { showList } from "./storage";

let testId!: HTMLInputElement;
const [isRightSidebarExpanded, setIsRightSidebarExpanded] = ref(false);
const [err, setErr] = ref("");

function testSupabase(e: SubmitEvent) {
  e.preventDefault();
  insertShow(showList()[+testId.value || 0])
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

document.body.append(<div data-layer="modals" />, <div data-layer="tooltips" />);
document.body.prepend(
  <main>
    <Header expanded={isRightSidebarExpanded()} on:expand={setIsRightSidebarExpanded} />
    <List expanded={isRightSidebarExpanded()} />
  </main>,
  <form $if={!!(supabase.key && supabase.url)} on:submit={testSupabase}>
    <input $ref={testId} placeholder="Insert show in supabase" />
    <pre>{err()}</pre>
    <button style:display="none" />
  </form>,
);
