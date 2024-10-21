import { Episode, TvShow } from "~/tvsm";
import Dialog from "./Dialog";
import { ref, watch } from "jsx";
import For from "jsx/components/For";
import { formatDate, formatEp } from "~/utils";

type DetailsProps = {
  $open: boolean,
  show: TvShow,
};

export default function Details(props: DetailsProps) {
  const [season, setSeason] = ref(1);
  const [episodes, setEpisodes] = ref([] as Episode[]);
  const [seasons, setSeasons] = ref([] as Episode[]);

  watch(() => {
    if (props.$open) {
      setEpisodes(props.show.episodes.filter(e => e.season === season()));
    }
  });

  watch(() => {
    if (props.$open && seasons().length !== props.show.seasons) {
      setSeasons(Array.from({ length: props.show.seasons }));
      setSeason(1);
    }
  });

  return (
    <Dialog $open={props.$open} center>
      <p slot="header" class:Details-title>
        <strong>{props.show.name}</strong> <em>({props.show.episodes.length} episodes)</em>
      </p>
      <div slot="content" class:Details>
        <img class:img $src={props.show.image?.original} />
        <strong>Summary</strong>
        <em class:summary>{props.show.summary}</em>
        <label class:season>
          <strong>Season</strong>
          <select class:g-border $value={season()} on:change={e => setSeason(+e.currentTarget.value)}>
            <For each={seasons()} do={(_, i) => (
              <option value={i + 1}>{i + 1}</option>
            )} />
          </select>
          <em>({episodes().length} episodes)</em>
        </label>
        <div class:episodes>
          <For each={episodes()} do={ep => (
            <section class:episode>
              <img $src={ep().image.medium} />
              <p><strong>{formatEp(ep())}</strong> {ep().name} <em>{formatDate(ep().released)}</em></p>
              <em class:summary>{ep().summary}</em>
              <span class:rating>
                <strong><i></i> {ep().rating?.toFixed(1)}</strong> <em>/ 10</em>
              </span>
            </section>
          )} />
        </div>
      </div>
    </Dialog>
  );
}
