/* eslint-disable no-unused-labels */
import { reactive } from "jsx";
import Dialog from "./Dialog";
import Portal from "jsx/components/Portal";

type DebugProps<T> = {
  data: T,
  "on:change"?: (data: T) => void,
  title?: string,
  x?: number,
  y?: number,
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
            class:Debug-button
            $if={!visible.value}
            on:click={() => visible.value = !visible.value}
            style:left={props.x != null ? `${props.x}px` : 0}
            style:top={props.y != null ? `${props.y}px` : 0}
          >{title()}</button>
        </Portal>
        <Dialog $open={visible.value} draggable x={props.x} y={props.y}>
          <label slot="header">
            {title()}
          </label>
          <pre
            slot="content"
            class:Debug-content
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
