import jsx, { Fragment, ref, watchFn } from "jsx";
import For from "jsx/components/For";
import Portal from "jsx/components/Portal";
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
  const [x, setX] = ref(0);
  const [y, setY] = ref(0);

  let button!: HTMLButtonElement;
  let content!: HTMLElement;

  watchFn(selected, () => props["on:change"](selected()));

  function onMount() {
    const observer = new ResizeObserver(([e]) => {
      if (e.target === content && expanded()) {
        button.style.width = `${e.borderBoxSize[0].inlineSize}px`;
      }
      if (e.target === button) {
        reposition();
      }
    });
    observer.observe(content);
    observer.observe(button);
  }

  function reposition() {
    const r = button?.getBoundingClientRect();
    if (!r) { return }
    setX(r.x);
    setY(r.y + r.height);
  }

  watchFn(expanded, reposition);

  function close(e: Event) {
    if (!(e.target instanceof HTMLElement && (
      e.target.dataset.item != null ||
      isTargetElement(e.target, button) ||
      isTargetElement(e.target, content)
    ))) {
      setExpanded(false);
    }
  }

  function toggle(e: Event) {
    if (e.target instanceof HTMLElement && e.target.dataset.item == null) {
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
    <>
      <button
        $ref={button}
        class:multi-select
        class:border
        class:expanded={expanded()}
        on:mount={onMount}
        on:click={toggle}
        win:onclick={close}
        win:ontouchstart={close}
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
      </button>
      <Portal to="[data-layer=modals]">
        <Transition $if={expanded()} name="pop">
          <article
            $ref={content}
            class:multi-select-content
            style:left={`${x()}px`}
            style:top={`${y()}px`}
          >
            <For each={props.options} do={txt => (
              <label>
                <input type="checkbox" checked={selected().has(txt())} on:change={select(txt())} />
                <span>{txt()}</span>
              </label>
            )} />
          </article>
        </Transition>
      </Portal>
    </>
  );
}
