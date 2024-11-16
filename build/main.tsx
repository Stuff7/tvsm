import { template as _jsx$template } from "jsx";
import { insertChild as _jsx$insertChild } from "jsx";

const _jsx$templ0 = _jsx$template(`<div data-layer="modals"></div>`);
const _jsx$templ1 = _jsx$template(`<div data-layer="tooltips"></div>`);
const _jsx$templ4 = _jsx$template(`<main><!><!></main>`);

import { ref } from "jsx";
import List from "~/components/List";
import Header from "~/components/Header";

const [isRightSidebarExpanded, setIsRightSidebarExpanded] = ref(false);

document.body.append((() => {
const _jsx$el0 = _jsx$templ0(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]


return _jsx$el0;
})(), (() => {
const _jsx$el0 = _jsx$templ1(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]


return _jsx$el0;
})());
document.body.prepend(
  (() => {
const _jsx$el0 = _jsx$templ4(); // root[true]/component[false]/conditional[false]/transition[false]/template-child[false]
const _jsx$el1 = _jsx$el0.firstChild; // jsx_self_closing_element
const _jsx$el2 = _jsx$el1.nextSibling; // jsx_self_closing_element

Header.$$slots = {};
_jsx$insertChild(_jsx$el1, Header({get expanded() { return isRightSidebarExpanded() }, "on:expand": setIsRightSidebarExpanded, }));
List.$$slots = {};
_jsx$insertChild(_jsx$el2, List({get expanded() { return isRightSidebarExpanded() }, }));

return _jsx$el0;
})(),
);
