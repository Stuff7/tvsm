import jsx from "jsx";
import TvShowFilter from "~/components/TvShowFilter";
import TvShowSearch from "./TvShowSearch";

export default function Header() {
  return (
    <header class:header>
      <p>TVSM</p>
      <div class:divider />
      <TvShowSearch />
      <div class:divider />
      <TvShowFilter />
    </header>
  );
}
