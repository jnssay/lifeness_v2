"use client";

import type { Todo } from "~/types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newData: { text: string; category: string; dueDate: string; notes: string },
  ) => Promise<void>;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps): JSX.Element {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
