import { ref } from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";

const [isRightSidebarExpanded, setIsRightSidebarExpanded] = ref(false);

document.body.append(<div data-layer="modals" />, <div data-layer="tooltips" />);
document.body.prepend(
  <main>
    <Header expanded={isRightSidebarExpanded()} on:expand={setIsRightSidebarExpanded} />
    <List expanded={isRightSidebarExpanded()} />
  </main>,
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
