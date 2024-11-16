

import { Ref, ref, watchOnly } from "jsx";

export default function useSelection([selected, setSelected]: Ref<Set<number>>, list: Ref<{ id: number }[]>[0]) {
  const originalSelection = new Set<number>;
  const [isAreaSelecting, setIsAreaSelecting] = ref(false);
  const [areaStart, setAreaStart] = ref(0);
  const [areaEnd, setAreaEnd] = ref(0);

  function mountSelect() {
    window.addEventListener("mouseup", endAreaSelect);
  }

  function destroySelect() {
    window.removeEventListener("mouseup", endAreaSelect);
  }

  function selectIdx(idx: number) {
    return function() {
      const id = list()[idx].id;
      setSelected.byRef(selected => {
        if (selected.has(id)) {
          selected.delete(id);
        }
        else {
          selected.add(id);
        }
      });
    };
  }

  function selectAll(e: Event, filtered?: Set<number>) {
    e.preventDefault();
    setSelected.byRef(selected => {
      if (selected.size === list().length) {
        selected.clear();
      }
      else if (filtered) {
        if (list().every(s => selected.has(s.id) || filtered.has(s.id))) {
          selected.clear();
        }
        else {
          list().forEach(s => {
            if (!filtered.has(s.id)) {
              selected.add(s.id);
            }
          });
        }
      }
      else {
        list().forEach(s => selected.add(s.id));
      }
    });
  }

  function startAreaSelect(idx: number) {
    originalSelection.clear();
    selected().forEach(s => originalSelection.add(s));
    setAreaStart(idx);
    setIsAreaSelecting(true);
  }

  function doAreaSelect(idx: number) {
    if (isAreaSelecting()) {
      setAreaEnd(idx);
    }
  }

  function endAreaSelect() {
    originalSelection.clear();
    setIsAreaSelecting(false);
  }

  watchOnly([areaEnd], () => {
    if (!isAreaSelecting()) { return }

    const selectedArea = new Set(originalSelection);

    let start = areaStart();
    let end = areaEnd();

    if (start > end) {
      [start, end] = [end, start];
    }

    for (let i = start; i <= end; i++) {
      const id = list()[i].id;
      if (selectedArea.has(id)) {
        selectedArea.delete(id);
      }
      else {
        selectedArea.add(id);
      }
    }

    setSelected(selectedArea);
  });

  return {
    mountSelect,
    destroySelect,
    selectIdx,
    selectAll,
    isAreaSelecting,
    startAreaSelect,
    doAreaSelect,
  };
}
