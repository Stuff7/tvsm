import jsx, { ref, watch, watchFn } from "jsx";
import { isSafari, syncFrame } from "~/utils";

type CarouselProps<T> = {
  each: T[],
  do: (item: () => T, i: () => number, position: number) => JSX.Element,
  snap?: boolean,
  spacing?: number,
  page: number,
  ["on:change"]: (page: number) => void,
  itemsPerPage?: number,
  vertical?: boolean,
};

export default function Carousel<T>(props: CarouselProps<T>) {
  const [indices, setIndices] = ref([0, 1]);
  const [accel, setAccel] = ref(0);
  const [start, setStart] = ref(0);
  const [position, setPosition] = ref(0);
  const [spacing, setSpacing] = ref(0);

  const snapSpeed = isSafari ? 30 : 1;
  const itemsPerPage = () => props.itemsPerPage || 1;
  const snapPoint = () => singleCellSize + spacing();
  const swapPoint = () => singleCellSize * 2 + spacing() * 2 - snapOffset;

  let container!: HTMLDivElement;
  let gridCell!: HTMLElement;
  let cellSize = 0;
  let singleCellSize = 0;
  let snapOffset = 0;
  let isHolding = false;

  watchFn(() => props.each, () => {
    if (props.each.length !== indices().length) {
      const indices = [...props.each.keys()];
      prevSwap(indices);
      setIndices(indices);
    }
  });

  watch(() => setSpacing(props.spacing || 0));

  function onMount() {
    const observer = new ResizeObserver(([e]) => {
      const offset = (itemsPerPage() - 1) * spacing();
      snapOffset = itemsPerPage() > 1 ? spacing() / 2 : 0;
      const h = e.borderBoxSize[0].blockSize;
      const w = e.borderBoxSize[0].inlineSize;
      if (props.vertical) {
        singleCellSize = h + snapOffset;
        cellSize = h + offset;
        container.style.height = `${h * itemsPerPage() + offset}px`;
        container.style.width = `${w}px`;
      }
      else {
        singleCellSize = w + snapOffset;
        cellSize = w + offset;
        container.style.width = `${w * itemsPerPage() + offset}px`;
        container.style.height = `${h}px`;
      }

      setPosition(-snapPoint());
    });

    observer.observe(gridCell);
    container.addEventListener("unmount", () => observer.unobserve(gridCell));
  }

  function getPagePos(e: { pageX: number, pageY: number }) {
    if (props.vertical) {
      return e.pageY;
    }
    else {
      return e.pageX;
    }
  }

  function touchMove(e: TouchEvent) {
    e.preventDefault();
    if (isHolding) {
      scroll(getPagePos(e.touches[0]));
    }
  }

  function mouseMove(e: MouseEvent) {
    e.preventDefault();
    if (isHolding) {
      scroll(getPagePos(e));
    }
  }

  function mouseUp(e: MouseEvent) {
    if (e.button === 0) {
      accelerate();
    }
  }

  function touchStart(e: Event, pixels: number) {
    e.preventDefault();
    isHolding = true;
    setAccel(0);
    setStart(pixels);
  }

  async function accelerate() {
    if (!isHolding) { return }
    isHolding = false;

    let i = 4;
    while (accel() !== 0) {
      if (isHolding) { return }
      const acc = accel();
      const a = Math.abs(acc);
      if (a < 20) {
        i = 1;
      }
      else if (a < 40) {
        i = 2;
      }
      else if (a < 60) {
        i = 3;
      }

      if (acc < 0) {
        await syncFrame(() => {
          scroll(start() - acc - i);
        });
      }
      else if (acc > 0) {
        await syncFrame(() => {
          scroll(start() - acc + i);
        });
      }
    }

    updPage();
  }

  let prevPage: null | number = null;
  watchFn(() => props.page, async () => {
    if (prevPage == null && props.page !== 0) {
      setAccel(snapSpeed);
      const page = props.page;
      while (indices()[1] !== page || position() !== -snapPoint()) {
        await syncFrame(() => scroll(start() - accel() - 1, false));
      }

      prevPage = props.page;
      setAccel(0);
      return;
    }

    if (!container || !props.snap || accel() !== 0) {
      return;
    }

    const pos = Math.abs(position());
    if (props.page != null && prevPage != null && props.page !== prevPage && pos === snapPoint()) {
      let diff = prevPage - props.page;
      const h = props.each.length / 2;
      if (diff < -h) {
        diff += props.each.length;
      }
      else if (diff > h) {
        diff -= props.each.length;
      }

      if (diff < 0) {
        setAccel(snapSpeed);
        const page = props.page;
        while (indices()[1] !== page || position() !== -snapPoint()) {
          await syncFrame(() => scroll(start() - accel() - 1, false));
        }
      }
      else if (diff > 0) {
        setAccel(-snapSpeed);
        const page = props.page;
        while (indices()[1] !== page || position() !== -snapPoint()) {
          await syncFrame(() => scroll(start() - accel() + 1, false));
        }
      }

      prevPage = props.page;
      updPage();
      setAccel(0);
      return;
    }

    if (pos - cellSize / 4 > snapPoint()) {
      setAccel(snapSpeed);
      while (position() !== -snapPoint()) {
        await syncFrame(() => scroll(start() - accel() - 1));
      }
    }
    else if (pos > snapPoint()) {
      setAccel(-snapSpeed);
      while (position() < -snapPoint()) {
        await syncFrame(() => scroll(start() - accel() + 1));
      }
      setPosition(-snapPoint());
    }
    else if (pos < snapPoint() - cellSize / 4) {
      setAccel(-snapSpeed);
      while (position() !== -snapPoint()) {
        await syncFrame(() => scroll(start() - accel() + 1));
      }
    }
    else if (pos < snapPoint()) {
      setAccel(snapSpeed);
      while (position() > -snapPoint()) {
        await syncFrame(() => scroll(start() - accel() - 1));
      }
      setPosition(-snapPoint());
    }

    setAccel(0);
  });

  function scroll(pixels: number, updatePage = true) {
    setAccel(start() - pixels);
    setPosition(position() - accel());
    setStart(pixels);

    const pos = position();
    if (-pos >= swapPoint()) {
      setIndices.byRef(nextSwap);
      setPosition(-snapPoint());
    }
    else if (pos > -snapOffset) {
      setIndices.byRef(prevSwap);
      setPosition(-snapPoint());
    }
    else {
      return;
    }

    if (updatePage) {
      updPage();
    }
  }

  function updPage() {
    const pos = -position();
    const point = snapPoint();
    if (pos > point + cellSize / 2) {
      props["on:change"](indices()[2]);
    }
    else if (pos < point - cellSize / 2) {
      props["on:change"](indices()[0]);
    }
    else {
      props["on:change"](indices()[1]);
    }
  }

  function nextSwap(indices: number[]) {
    const first = indices[0];
    for (let i = 1; i < indices.length; i++) {
      indices[i - 1] = indices[i];
    }
    indices[indices.length - 1] = first;
  }

  function prevSwap(indices: number[]) {
    const last = indices[indices.length - 1];
    for (let i = indices.length - 1; i > 0; i--) {
      indices[i] = indices[i - 1];
    }
    indices[0] = last;
  }

  async function scrollWheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const offset = props.vertical ? -dir : dir;
    setAccel(Math.ceil(cellSize / 60 * -offset));
    for (let i = 0; i < 10; i++) {
      await syncFrame(() => scroll(start() - accel() + offset));
    }
    setAccel(0);
    updPage();
  }

  return (
    <div
      $ref={container}
      class:carousel
      class:vertical={!!props.vertical}
      var:carousel-spacing={`${spacing()}px`}
      on:mount={onMount}
      on:touchstart={e => touchStart(e, getPagePos(e.touches[0]))}
      on:mousedown={e => e.button === 0 && touchStart(e, getPagePos(e))}
      on:wheel={scrollWheel}
      win:ontouchmove={touchMove}
      win:ontouchend={accelerate}
      win:onmousemove={mouseMove}
      win:onmouseup={mouseUp}
    >
      <div class:carousel-content var:translate={`${position()}px`}>
        {...Array.from({ length: itemsPerPage() + 2 }).map((_, i) => {
          const node = props.do(
            () => props.each[indices()[i]],
            () => indices()[i],
            i,
          );
          if (i === 0) { gridCell = node }
          return node;
        })}
      </div>
    </div>
  );
}
