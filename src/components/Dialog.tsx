import jsx, { reactive, ref } from "jsx";
import Portal from "jsx/components/Portal";
import Transition from "jsx/components/Transition";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type DialogProps = {
  $if?: boolean,
  x?: number,
  y?: number,
  draggable?: boolean,
  center?: boolean,
};

export default function Dialog(props: DialogProps) {
  const cursor = reactive({ x: props.x || 0, y: props.y || 0 });
  const cursorStart = reactive({ x: cursor.x, y: cursor.y });
  const cursorEnd = reactive({ x: cursor.x, y: cursor.y });
  const [dragging, setDragging] = ref(false);

  function startDrag(e: MouseTouchEvent) {
    if (!props.draggable) {
      return;
    }

    if (!(
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    )) {
      e.preventDefault();
    }

    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    setDragging(true);

    const pos = getCursorPosition(e);
    cursorStart.x = pos.pageX;
    cursorStart.y = pos.pageY;

    drag(e);
  }

  function drag(e: MouseTouchEvent) {
    if (!dragging()) { return }

    const pos = getCursorPosition(e);
    cursor.x = cursorEnd.x + pos.pageX - cursorStart.x;
    cursor.y = cursorEnd.y + pos.pageY - cursorStart.y;
  }

  function stopDrag() {
    setDragging(false);
    cursorEnd.x = cursor.x;
    cursorEnd.y = cursor.y;
  }

  return (
    <Portal to="[data-layer=modals]">
      <Transition $if={!!props.$if} name="pop">
        <div
          class:dialog
          class:draggable={!!props.draggable}
          class:center={!!props.center}
          win:ontouchmove={drag}
          win:ontouchend={stopDrag}
          win:onmousemove={drag}
          win:onmouseup={stopDrag}
          var:x={`${cursor.x}px`}
          var:y={`${cursor.y}px`}
        >
          <header
            class:header
            class:dragging={dragging()}
            on:mousedown={startDrag}
            on:touchstart={startDrag}
          >
            <slot name="header" />
            <button class:close-btn on:click={() => props.$if = false}>
              <i></i>
            </button>
          </header>
          <article class:content>
            <slot name="content" />
          </article>
          <slot />
        </div>
      </Transition>
    </Portal >
  );
}
