/* eslint-disable no-unused-labels */
import jsx, { Fragment, reactive } from "jsx";
import Dialog from "./Dialog";
import Portal from "jsx/components/Portal";

type DebugProps<T> = {
  data: T,
  "on:change"?: (data: T) => void,
  title?: string,
};

export default function Debug<T>(props: DebugProps<T>) {
  DEV: {
    const visible = reactive({ value: false });
    const title = () => props.title ?? "Debug";

    const updData = (strData: string) => {
      try {
        props["on:change"]?.(JSON.parse(strData));
      }
      catch (_e) {
        return;
      }
    };

    return (
      <>
        <Portal to="[data-layer=modals]">
          <button
            class:debug-button
            $if={!visible.value}
            on:click={() => visible.value = !visible.value}
          >{title()}</button>
        </Portal>
        <Dialog $if={visible.value} draggable>
          <label slot="header" class:show-search>
            {title()}
          </label>
          <pre
            slot="content"
            class:debug-content
            contenteditable
            spellcheck={false}
            on:input={[e => updData(e.currentTarget.innerHTML), { once: true }]}
          >
            {JSON.stringify(props.data, null, 2)}
          </pre>
        </Dialog>
      </>
    );
  }
}
