import jsx, { ref, watchFn } from "jsx";
import For from "jsx/components/For";
import Transition from "jsx/components/Transition";
import { isTargetElement } from "~/utils";

type MultiSelectProps<T extends string> = {
  placeholder?: string,
  options: T[],
  ["on:change"]: (selected: Set<T>) => void,
};

export default function MultiSelect<T extends string>(props: MultiSelectProps<T>) {
  const [expanded, setExpanded] = ref(false);
  const [selected, setSelected] = ref(new Set<T>);

  let button!: HTMLButtonElement;
  let content!: HTMLElement;

  watchFn(selected, () => props["on:change"](selected()));

  function close(e: Event) {
    if (!(e.target instanceof HTMLElement && (
      e.target.dataset.item != null ||
      isTargetElement(e.target, button)
    ))) {
      setExpanded(false);
    }
  }

  function toggle(e: Event) {
    if (e.target instanceof HTMLElement && e.target.dataset.item == null && !isTargetElement(e.target, content)) {
      setExpanded(!expanded());
    }
  }

  function select(value: T) {
    return function(this: HTMLInputElement) {
      setSelected.byRef(selected => {
        if (this.checked) {
          selected.add(value);
        }
        else {
          selected.delete(value);
        }
      });
    };
  }

  return (
    <button
      $ref={button}
      class:MultiSelect
      class:g-border
      class:expanded={expanded()}
      on:click={toggle}
      g:onclick={close}
      g:ontouchstart={close}
    >
      <section class:items>
        <For each={props.options} do={txt => (
          <button
            data-item
            on:click={() => setSelected.byRef(selected => selected.delete(txt()))}
            class:hidden={!selected().has(txt())}
          >{txt()}</button>
        )} />
        <span $if={selected().size === 0}>
          {props.placeholder ?? ""}
        </span>
      </section>
      <i class:chevron></i>
      <Transition $if={expanded()} name="slide">
        <article
          $ref={content}
          class:content
        >
          <slot />
          <section class:items>
            <For each={props.options} do={txt => (
              <label>
                <input type="checkbox" checked={selected().has(txt())} on:change={select(txt())} />
                <span>{txt()}</span>
              </label>
            )} />
          </section>
        </article>
      </Transition>
    </button>
  );
}
