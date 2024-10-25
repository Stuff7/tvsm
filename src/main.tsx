import { ref } from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";
import { db, insertShows, supabase } from "./supabase";
import { showList } from "./storage";

let insertId!: HTMLInputElement;
const [isRightSidebarExpanded, setIsRightSidebarExpanded] = ref(false);
const [err, setErr] = ref("");

function insertDb(e: SubmitEvent) {
  e.preventDefault();
  db.insertShow(showList()[+insertId.value || 0]);
}

function getDb() {
  db.loadShows()
    .then(async (r) => {
      console.log(r);
    })
    .catch(e => {
      setErr(`${e}`);
      console.error(e);
    });
}

function getTags() {
  db.loadTags().then(console.log);
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
    <div>
      <button on:click={getDb}>Get all shows</button>
      <button on:click={() => insertShows(showList().slice(0, 2))}>Save shows</button>
      <button on:click={getTags}>Get all tags</button>
      <button on:click={db.saveTags}>Save tags</button>
      <pre>{err()}</pre>
    </div>
  </div>,
);

// import jsx, { ref } from "jsx";
// import NumberRange from "./components/NumberRange";
//
// const [min, setMin] = ref(20);
// const [max, setMax] = ref(80);
//
// document.body.append(<div data-layer="modals" />, <div data-layer="tooltips" />);
// document.body.prepend(
//   <main
//     style:grid-template-columns="1fr"
//     style:grid-template-rows="auto"
//     style:padding="200px"
//   >
//     <NumberRange
//       min={min()}
//       max={max()}
//       formatter={(n) => `${n}%`}
//       on:min-change={setMin}
//       on:max-change={setMax}
//     />
//     <p>MIN: {min()} MAX: {max()}</p>
//   </main>,
// );
