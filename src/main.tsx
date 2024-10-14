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
