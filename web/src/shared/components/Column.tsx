import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import type { Task } from '../../types';

type ColumnProps = {
  id: string;
  name: string;
  tasks: Task[];
  children: ReactNode;
};

// Função que gera um hash simples a partir do string id
function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Função que converte um número hash para uma cor RGB
function getColorFromHash(hash: number) {
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

function getDeterministicColor(id: string) {
  const hash = hashStringToNumber(id);
  return getColorFromHash(hash);
}

function ColumnItem({ id, name, tasks, children }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const randomColor = useMemo(() => getDeterministicColor(id), [id]);

  const tasksIds = tasks.map((task) => task.id) ?? [];

  return (
    <div className="relative flex h-full max-h-[inherit] flex-col justify-start gap-4 overflow-y-auto">
      <div className="flex items-center gap-2">
        <span
          aria-label={`Column ${name}`}
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ backgroundColor: randomColor }}
        />
        <div className="text-mediumGrey flex gap-2 overflow-hidden text-xs font-bold uppercase">
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </span>
          <span>( {tasks.length ?? 0} )</span>
        </div>
      </div>

      <SortableContext
        id={id}
        items={tasksIds}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="text-hxl text-mediumGrey hover:text-purple scrollbar-hide flex w-full flex-1 flex-col gap-3 overflow-y-auto rounded-md p-1 pb-8"
        >
          {children}
        </ul>
      </SortableContext>
    </div>
  );
}

export const Column = memo(ColumnItem);
