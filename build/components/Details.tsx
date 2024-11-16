import { template as _jsx$template } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";
import { addLocalEvent as _jsx$addLocalEvent } from "jsx";
import { setAttribute as _jsx$setAttribute } from "jsx";
import { trackAttribute as _jsx$trackAttribute } from "jsx";

const _jsx$templ24 = _jsx$template(`<div class="Details"><img class="img"/><strong>Summary</strong><em class="summary"><!></em><label class="season"><strong>Season</strong><select class="g-border"><!></select><em>(<!> episodes)</em></label><div class="episodes"><!></div></div>`);
const _jsx$templ21 = _jsx$template(`<section class="episode"><img/><p><strong><!></strong> <!> <em><!></em></p><em class="summary"><!></em><span class="rating"><strong><i></i> <!></strong> <em>/ 10</em></span></section>`);
const _jsx$templ7 = _jsx$template(`<option><!></option>`);
const _jsx$templ2 = _jsx$template(`<p class="Details-title"><strong><!></strong> <em>(<!> episodes)</em></p>`);

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
    (() => {
Dialog.$$slots = {header: (() => {
const _jsx$el0 = _jsx$templ2(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_element
const _jsx$el2 = _jsx$el1.firstChild; // jsx_expression
const _jsx$el3 = _jsx$el1.nextSibling; // jsx_text
const _jsx$el4 = _jsx$el3.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_text
const _jsx$el6 = _jsx$el5.nextSibling; // jsx_expression
const _jsx$el7 = _jsx$el6.nextSibling; // jsx_text

_jsx$insertChild(_jsx$el2, () => props.show.name);
_jsx$insertChild(_jsx$el6, () => props.show.episodes.length);

return _jsx$el0;
}), content: (() => {
const _jsx$el0 = _jsx$templ24(); // root[false]/component[true]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_text
const _jsx$el4 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el5 = _jsx$el4.firstChild; // jsx_expression
const _jsx$el6 = _jsx$el4.nextSibling; // jsx_element
const _jsx$el7 = _jsx$el6.firstChild; // jsx_element
const _jsx$el8 = _jsx$el7.firstChild; // jsx_text
const _jsx$el9 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el10 = _jsx$el9.firstChild; // jsx_self_closing_element
const _jsx$el11 = _jsx$el9.nextSibling; // jsx_element
const _jsx$el12 = _jsx$el11.firstChild; // jsx_text
const _jsx$el13 = _jsx$el12.nextSibling; // jsx_expression
const _jsx$el14 = _jsx$el13.nextSibling; // jsx_text
const _jsx$el15 = _jsx$el6.nextSibling; // jsx_element
const _jsx$el16 = _jsx$el15.firstChild; // jsx_self_closing_element

_jsx$trackAttribute(_jsx$el1, "src", () => props.show.image?.original);
_jsx$insertChild(_jsx$el5, () => props.show.summary);
_jsx$trackAttribute(_jsx$el9, "value", () => season());
_jsx$addLocalEvent(_jsx$el9, "change", e => setSeason(+e.currentTarget.value));
For.$$slots = {};
_jsx$insertChild(_jsx$el10, For({get each() { return seasons() }, do: (_, i) => (
              (() => {
const _jsx$el0 = _jsx$templ7(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_expression

_jsx$setAttribute(_jsx$el0, "value", i + 1);
_jsx$insertChild(_jsx$el1, () => i + 1);

return _jsx$el0;
})()
            ), }));
_jsx$insertChild(_jsx$el13, () => episodes().length);
For.$$slots = {};
_jsx$insertChild(_jsx$el16, For({get each() { return episodes() }, do: ep => (
            (() => {
const _jsx$el0 = _jsx$templ21(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_element
const _jsx$el3 = _jsx$el2.firstChild; // jsx_element
const _jsx$el4 = _jsx$el3.firstChild; // jsx_expression
const _jsx$el5 = _jsx$el3.nextSibling; // jsx_text
const _jsx$el6 = _jsx$el5.nextSibling; // jsx_expression
const _jsx$el7 = _jsx$el6.nextSibling; // jsx_text
const _jsx$el8 = _jsx$el7.nextSibling; // jsx_element
const _jsx$el9 = _jsx$el8.firstChild; // jsx_expression
const _jsx$el10 = _jsx$el2.nextSibling; // jsx_element
const _jsx$el11 = _jsx$el10.firstChild; // jsx_expression
const _jsx$el12 = _jsx$el10.nextSibling; // jsx_element
const _jsx$el13 = _jsx$el12.firstChild; // jsx_element
const _jsx$el14 = _jsx$el13.firstChild; // jsx_element
const _jsx$el15 = _jsx$el14.firstChild; // jsx_text
const _jsx$el16 = _jsx$el14.nextSibling; // jsx_text
const _jsx$el17 = _jsx$el16.nextSibling; // jsx_expression
const _jsx$el18 = _jsx$el13.nextSibling; // jsx_text
const _jsx$el19 = _jsx$el18.nextSibling; // jsx_element
const _jsx$el20 = _jsx$el19.firstChild; // jsx_text

_jsx$trackAttribute(_jsx$el1, "src", () => ep().image.medium);
_jsx$insertChild(_jsx$el4, () => formatEp(ep()));
_jsx$insertChild(_jsx$el6, () => ep().name);
_jsx$insertChild(_jsx$el9, () => formatDate(ep().released));
_jsx$insertChild(_jsx$el11, () => ep().summary);
_jsx$insertChild(_jsx$el17, () => ep().rating?.toFixed(1));

return _jsx$el0;
})()
          ), }));

return _jsx$el0;
}), }
const _jsx$el0 = Dialog({get $open() { return props.$open }, set $open(_jsx$v) { props.$open = _jsx$v }, center: true, }, Dialog.$$slots);

return _jsx$el0;
})()
  );
}
