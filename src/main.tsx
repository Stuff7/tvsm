import jsx, { ref } from "jsx";
import TvShowList from "./components/TvShowList";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";

const search = ref("");

document.body.append(
  <main>
    <SearchInput text={search.value} />
    <Header />
    <TvShowList />
  </main>,
);
