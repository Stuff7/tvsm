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
  const dragging = ref(false);

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

    dragging.value = true;

    const pos = getCursorPosition(e);
    cursorStart.x = pos.pageX;
    cursorStart.y = pos.pageY;

    drag(e);
  }

  function drag(e: MouseTouchEvent) {
    if (!dragging.value) { return }

    const pos = getCursorPosition(e);
    cursor.x = cursorEnd.x + pos.pageX - cursorStart.x;
    cursor.y = cursorEnd.y + pos.pageY - cursorStart.y;
  }

  function stopDrag() {
    dragging.value = false;
    cursorEnd.x = cursor.x;
    cursorEnd.y = cursor.y;
  }

  function onMount() {
    window.addEventListener("touchmove", drag);
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);
  }

  function onDestroy() {
    window.removeEventListener("touchmove", drag);
    window.removeEventListener("touchend", stopDrag);
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
  }

  return (
    <Portal to="[data-layer=modals]">
      <Transition $if={!!props.$if} name="pop">
        <div
          class:dialog
          class:draggable={!!props.draggable}
          class:center={!!props.center}
          on:mount={onMount}
          on:unmount={onDestroy}
          var:x={`${cursor.x}px`}
          var:y={`${cursor.y}px`}
        >
          <header
            class:header
            class:dragging={dragging.value}
            on:mousedown={startDrag}
            on:touchstart={startDrag}
          >
            <slot name="header" />
            <button on:click={() => props.$if = false}>
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
