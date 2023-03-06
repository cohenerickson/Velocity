import { Transformer, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";

export default function ConstrainDragAxis(): JSX.Element {
  // We have to use any on this because solid-dnd doesn't have proper typings
  const [, { onDragStart, onDragEnd, addTransformer, removeTransformer }] =
    useDragDropContext() as any;

  const transformer: Transformer = {
    id: "constrain-y-axis",
    order: 100,
    callback: (transform) => ({ ...transform, y: 0 })
  };

  // We have to use any on this because solid-dnd doesn't have proper typings
  onDragStart(({ draggable }: any) => {
    addTransformer("draggables", draggable.id, transformer);
  });

  // We have to use any on this because solid-dnd doesn't have proper typings
  onDragEnd(({ draggable }: any) => {
    removeTransformer("draggables", draggable.id, transformer.id);
  });

  return <></>;
}
