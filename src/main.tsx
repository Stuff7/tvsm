import jsx from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";

document.body.append(<div data-layer="modals" />, <div data-layer="tooltips" />);
document.body.prepend(
  <main>
    <Header />
    <List />
  </main>,
);
