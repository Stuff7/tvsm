import jsx from "jsx";
import TvShowFilter from "~/components/TvShowFilter";

export default function Header() {
  return (
    <header class:header>
      <p>TVSM</p>
      <div />
      <TvShowFilter />
    </header>
  );
}
