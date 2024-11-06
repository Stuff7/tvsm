import { ref, watchFn } from "jsx";
import FixedFor from "jsx/components/FixedFor";
import { circularClamp, syncFrame } from "~/utils";

type CarouselProps<T> = {
  $visible?: boolean,
  each: T[],
  do: (item: () => T, i: () => number, position: number) => JSX.Element,
  snap?: boolean,
  spacing?: string,
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

  let container!: HTMLDivElement;
  let gridCell!: HTMLElement;
  let cellSize = 0;
  let isHolding = false;

  const itemsPerPage = () => props.itemsPerPage || 1;
  let focusedIdx = 0;

  let spacing = 0;
  const getSpacing = () => {
    const cell = gridCell.getBoundingClientRect();
    const prev = gridCell.previousElementSibling!.getBoundingClientRect();
    let pos: keyof typeof cell;
    let size: keyof typeof cell;
    if (props.vertical) {
      pos = "y";
      size = "height";
    }
    else {
      pos = "x";
      size = "width";
    }
    spacing = cell[pos] - prev[pos] - cell[size];
  };

  watchFn(itemsPerPage, () => focusedIdx = (itemsPerPage() + 1) / 2);

  watchFn(() => props.each, () => {
    if (props.each.length !== indices().length) {
      const indices = [...props.each.keys()];
      prevSwap(indices);
      setIndices(indices);
    }
  });

  let controller = new AbortController();
  let prevPage = 0;
  watchFn(() => props.page, async () => {
    controller.abort();
    await goto(props.page, prevPage);
    prevPage = props.page;
  });

  function onMount() {
    watchFn(position, () => container.style.setProperty("--translate", `${position()}px`));
    const observer = new ResizeObserver(([e]) => {
      getSpacing();
      const offset = (itemsPerPage() - 1) * spacing;
      const h = e.borderBoxSize[0].blockSize;
      const w = e.borderBoxSize[0].inlineSize;
      if (props.vertical) {
        cellSize = h + offset;
        container.style.height = `${h * itemsPerPage() + offset}px`;
        container.style.width = `${w}px`;
      }
      else {
        cellSize = w + offset;
        container.style.width = `${w * itemsPerPage() + offset}px`;
        container.style.height = `${h}px`;
      }

      setPosition(0);
    });

    observer.observe(gridCell);
  }

  async function accelerate() {
    if (!isHolding) { return }
    isHolding = false;

    let i = 4;
    const sign = Math.sign(accel());
    while (sign < 0 ? accel() < 0 : accel() > 0) {
      if (isHolding) { return }
      const acc = Math.round(accel());
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
        await scroll(Math.round(start()) - acc - i);
      }
      else if (acc > 0) {
        await scroll(Math.round(start()) - acc + i);
      }
    }
    setAccel(0);

    await snap();
  }

  async function snap() {
    const pos = position();
    if (pos < 0) {
      for (let i = pos; i <= 0; i += 16) {
        await syncFrame(() => setPosition(i));
      }
    }
    else if (pos > 0) {
      for (let i = pos; i >= 0; i -= 16) {
        await syncFrame(() => setPosition(i));
      }
    }
    await syncFrame(() => setPosition(0));
  }

  function goto(newPage: number, curr = props.page) {
    let running = true;
    controller = new AbortController();
    controller.signal.addEventListener("abort", () => running = false);

    return setIndices.byRefAsync(async indices => {
      let f = curr - newPage;
      if (Math.abs(f) < props.each.length / 2) {
        f = -f;
      }
      f = -Math.sign(f);
      const swap = f >= 0 ? prevSwap : nextSwap;

      while (running && indices[focusedIdx] !== newPage) {
        for (let i = 0; i < 8; i++) {
          await syncFrame(() => setPosition(i * f * gridCell.clientWidth / 8));
        }
        await syncFrame(() => setPosition(0));

        if (running) { swap(indices) }
      }
    });
  }

  async function scrollWheel(e: WheelEvent) {
    const dir = props.vertical ? -Math.sign(e.deltaY) : Math.sign(e.deltaY);
    if (dir < 0) {
      const p = circularClamp(props.page + 1, props.each);
      props["on:change"](p);
    }
    else if (dir > 0) {
      const p = circularClamp(props.page - 1, props.each);
      props["on:change"](p);
    }
  }

  function scroll(pixels: number, updatePage = true) {
    return syncFrame(() => {
      const a = start() - pixels;
      setAccel(Math.abs(a) > 150 ? Math.sign(a) * 150 : a);
      setPosition(position() - accel());
      setStart(pixels);

      const pos = position();
      const nPos = props.vertical ? 0 : spacing;
      if (-pos >= cellSize / 2 + nPos) {
        setIndices.byRef(nextSwap);
        setPosition(cellSize / 2);
      }
      else if (pos > cellSize / 2 + nPos) {
        setIndices.byRef(prevSwap);
        setPosition(-cellSize / 2);
      }
      else {
        return;
      }

      if (updatePage) {
        props["on:change"](indices()[focusedIdx]);
      }
    });
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

  function touchStart(pixels: number) {
    isHolding = true;
    setAccel(0);
    setStart(pixels);
  }

  return (
    <div
      $ref={container}
      $if={props.$visible ?? true}
      class:Carousel
      class:vertical={!!props.vertical}
      style:gap={props.spacing}
      on:mount={onMount}
      on:touchstart={e => touchStart(getPagePos(e.touches[0]))}
      on:mousedown={e => e.button === 0 && touchStart(getPagePos(e))}
      on:touchmove={e => e.preventDefault()}
      on:wheel={scrollWheel}
      g:ontouchmove={touchMove}
      g:ontouchend={accelerate}
      g:onmousemove={mouseMove}
      g:onmouseup={mouseUp}
    >
      <FixedFor each={Array.from({ length: itemsPerPage() + 2 })} do={(_, i) => {
        const node = props.do(
          () => props.each[indices()[i]],
          () => indices()[i],
          i,
        );
        if (i === focusedIdx) { gridCell = node }
        return node;
      }} />
    </div>
  );
}
