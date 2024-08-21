import jsx, { computed, Fragment, reactive, ref, watchOnly } from "jsx";
import Portal from "jsx/components/Portal";
import Transition from "jsx/components/Transition";
import { getCursorPosition, MouseTouchEvent } from "~/utils";

type TooltipProps = {
  $if?: boolean,
  disableHover?: boolean,
};

const realtimeMouse = { x: 0, y: 0 };

function trackMouse(e: MouseTouchEvent) {
  const pos = getCursorPosition(e);
  realtimeMouse.x = pos.clientX;
  realtimeMouse.y = pos.clientY;
}

window.addEventListener("mousemove", trackMouse);
window.addEventListener("touchmove", trackMouse);

export default function Tooltip(props: TooltipProps) {
  const mouse = ref(realtimeMouse);
  const translation = reactive({ x: "1rem", y: "1rem" });
  const hovering = ref(false);
  const tooltip = ref<HTMLDivElement | null>(null);
  const tooltipLayer = ref<Element | null>(null);

  const visible = computed(() => {
    if (props.disableHover) {
      return props.$if;
    }

    return hovering.value && (props.$if ?? true);
  });

  watchOnly([visible], () => {
    if (visible.value) {
      trackMouse();
    }
  });

  function addHoverListener(this: HTMLElement) {
    let parent: Element;
    if (this.parentElement) {
      parent = this.parentElement;
    }
    else if (tooltipLayer.value) {
      parent = tooltipLayer.value;
    }
    else {
      parent = document.body;
    }

    function hover() {
      hovering.value = true;
    }

    function unhover() {
      hovering.value = false;
    }

    function addEvents() {
      parent.addEventListener("mouseenter", hover);
      parent.addEventListener("mouseleave", unhover);
      parent.addEventListener("touchstart", hover);
      parent.addEventListener("touchend", unhover);
      parent.removeEventListener("mount", addEvents);
    }

    if (parent.isConnected) {
      addEvents();
    }
    else {
      parent.addEventListener("mount", addEvents);
    }

    parent.addEventListener("unmount", () => {
      visible.value = hovering.value = props.$if = false;
    });

    this.remove();
  }

  function trackMouse() {
    requestAnimationFrame(() => {
      if (!tooltip.value || !tooltipLayer.value) { return }

      const layerRight = tooltipLayer.value.clientWidth;
      const layerBottom = tooltipLayer.value.clientHeight;
      const tooltipRight = tooltip.value.clientWidth + realtimeMouse.x + 14;
      const tooltipBottom = tooltip.value.clientHeight + realtimeMouse.y + 14;

      if (tooltipRight >= layerRight) {
        translation.x = "calc(-100% - 1rem)";
      }
      else {
        translation.x = "1rem";
      }
      if (tooltipBottom >= layerBottom) {
        translation.y = "calc(-100% - 1rem)";
      }
      else {
        translation.y = "1rem";
      }

      mouse.value = realtimeMouse;
    });
  }

  function onMount() {
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("touchmove", trackMouse);
  }

  function onDestroy() {
    window.removeEventListener("mousemove", trackMouse);
    window.removeEventListener("touchmove", trackMouse);
  }

  return (
    <>
      <Portal $ref={tooltipLayer.value} to="[data-layer=tooltips]">
        <Transition $if={visible.value} name="pop">
          <div
            class:tooltip
            $ref={tooltip}
            var:x={`${mouse.value.x}px`}
            var:y={`${mouse.value.y}px`}
            var:pos-x={translation.x}
            var:pos-y={translation.y}
            on:mount={onMount}
            on:unmount={onDestroy}
          >
            <slot />
          </div>
        </Transition>
      </Portal>
      <span on:mount={addHoverListener} />
    </>
  );
}
