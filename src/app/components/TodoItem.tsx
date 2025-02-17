"use client";

import { useState } from "react";
import type { Todo } from "~/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newData: { text: string; category: string; dueDate: string; notes: string },
  ) => Promise<void>;
}

const CATEGORIES = [
  "Hass",
  "Soft Abs",
  "Game Dev",
  "Capstone",
  "Misc",
] as const;

const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0] ?? "";
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(
    formatDateForInput(todo.dueDate),
  );
  const [editNotes, setEditNotes] = useState(todo.notes ?? "");

  const handleSave = async () => {
    await onEdit(todo.id, {
      text: editText,
      category: editCategory,
      dueDate: editDueDate,
      notes: editNotes,
    });
    setIsEditing(false);
  };

  const getCategoryColor = (cat: (typeof CATEGORIES)[number]): string => {
    const colors: Record<(typeof CATEGORIES)[number], string> = {
      Hass: "bg-pink-100 text-pink-800",
      "Soft Abs": "bg-yellow-100 text-yellow-800",
      "Game Dev": "bg-pink-200 text-pink-900",
      Capstone: "bg-yellow-200 text-yellow-900",
      Misc: "bg-pink-50 text-pink-700",
    };
    return colors[cat] ?? "bg-gray-100 text-gray-800";
  };

  if (isEditing) {
    return (
      <li className="rounded-lg bg-white p-3 shadow dark:bg-pink-900">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
          />
          <div className="flex gap-2">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
            />
          </div>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Add notes..."
            className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-lg bg-white p-3 shadow dark:bg-pink-900">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 rounded"
      />
      <div className="flex-1 space-y-1">
        <span
          className={`block ${todo.completed ? "text-gray-500 line-through" : "text-pink-800 dark:text-white"}`}
        >
          {todo.text}
        </span>
        <div className="flex gap-2 text-sm">
          <span
            className={`rounded-full px-2 py-1 ${getCategoryColor(todo.category as (typeof CATEGORIES)[number])}`}
          >
            {todo.category}
          </span>
          {todo.dueDate && (
            <span className="text-pink-600 dark:text-pink-300">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
          {todo.notes && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Note: {todo.notes}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit
        </button>
      </div>
    </li>
  );
}
