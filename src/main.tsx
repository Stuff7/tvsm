import jsx from "jsx";
import TvShowList from "./components/TvShowList";
import Header from "./components/Header";

document.body.append(<div data-layer="modals" />);
document.body.prepend(
  <main>
    <Header />
    <TvShowList />
  </main>,
);
