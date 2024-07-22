import jsx, { ref } from "jsx";
import SearchInput from "~/components/SearchInput";

const search = ref("");

document.body.append(
  <main>
    <SearchInput text={search.value} />
  </main>,
);
