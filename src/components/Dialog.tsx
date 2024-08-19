import jsx, { reactive, ref } from "jsx";
import Portal from "jsx/components/Portal";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type DialogProps = {
  $if?: boolean,
  x: number,
  y: number,
};

export default function Dialog(props: DialogProps, ...children: JSX.Element[]) {
  const cursor = reactive({ x: props.x, y: props.y });
  const cursorStart = reactive({ x: props.x, y: props.y });
  const cursorEnd = reactive({ x: props.x, y: props.y });
  const dragging = ref(false);
  const header = ref<HTMLElement | null>(null);
  const content = ref<HTMLElement | null>(null);

  function startDrag(e: MouseTouchEvent) {
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

  function findSlot(name: string): Option<HTMLElement> {
    return children.find(c => c instanceof HTMLElement && c.slot === name);
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

    const headerSlot = findSlot("header");
    if (header.value && headerSlot) {
      header.value.prepend(headerSlot);
    }

    const contentSlot = findSlot("content");
    if (content.value && contentSlot) {
      content.value.append(contentSlot);
    }
  }

  function onDestroy() {
    window.removeEventListener("touchmove", drag);
    window.removeEventListener("touchend", stopDrag);
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
  }

  return (
    <Portal to="[data-layer=modals]">
      <div
        class:dialog
        $if={props.$if}
        on:mount={onMount}
        on:unmount={onDestroy}
        style:left={`${cursor.x}px`}
        style:top={`${cursor.y}px`}
      >
        <header
          ref={header}
          class:header
          class:dragging={dragging.value}
          on:mousedown={startDrag}
          on:touchstart={startDrag}
        >
          <button on:click={() => props.$if = false}>
            <i></i>
          </button>
        </header>
        <article ref={content} class:content />
      </div>
    </Portal >
  );
}
