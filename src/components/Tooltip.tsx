import jsx, { Fragment, reactive, ref, watch, watchOnly } from "jsx";
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
  const [mouse, setMouse] = ref(realtimeMouse);
  const translation = reactive({ x: "1rem", y: "1rem" });
  const [hovering, setHovering] = ref(false);
  const [tooltip, setTooltip] = ref<HTMLDivElement | null>(null);
  const [tooltipLayer, setTooltipLayer] = ref<Element | null>(null);
  const [visible, setVisible] = ref(false);

  watch(() => {
    if (props.disableHover) {
      setVisible(props.$if || false);
      return;
    }

    setVisible(hovering() && (props.$if ?? true));
  });

  watchOnly([visible], () => {
    if (visible()) {
      trackMouse();
    }
  });

  function addHoverListener(this: HTMLElement) {
    let parent: Element;
    if (this.parentElement) {
      parent = this.parentElement;
    }
    else if (tooltipLayer()) {
      parent = tooltipLayer()!;
    }
    else {
      parent = document.body;
    }

    function hover() {
      setHovering(true);
    }

    function unhover() {
      setHovering(false);
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
      setHovering(false);
      setVisible(false);
    });

    this.remove();
  }

  function trackMouse() {
    requestAnimationFrame(() => {
      const tooltipElem = tooltip();
      const tooltipLayerElem = tooltipLayer();
      if (!tooltipElem || !tooltipLayerElem) { return }

      const layerRight = tooltipLayerElem.clientWidth;
      const layerBottom = tooltipLayerElem.clientHeight;
      const tooltipRight = tooltipElem.clientWidth + realtimeMouse.x + 14;
      const tooltipBottom = tooltipElem.clientHeight + realtimeMouse.y + 14;

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

      setMouse(realtimeMouse);
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
      <Portal $ref={setTooltipLayer} to="[data-layer=tooltips]">
        <Transition $if={visible()} name="pop">
          <div
            class:tooltip
            $ref={setTooltip}
            var:x={`${mouse().x}px`}
            var:y={`${mouse().y}px`}
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
