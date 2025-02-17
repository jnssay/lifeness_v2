"use client";

import { useState, type FormEvent } from "react";

interface AddTodoFormProps {
  onAdd: (text: string, category: string, dueDate: string) => Promise<void>;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps): JSX.Element {
  const [newTodo, setNewTodo] = useState("");
  const [category, setCategory] = useState("HASS");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await onAdd(newTodo.trim(), category, dueDate);
    setNewTodo("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Add
        </button>
      </div>
      <div className="flex gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
        >
          <option value="Hass">Hass</option>
          <option value="Soft Abs">Soft Abs</option>
          <option value="Game Dev">Game Dev</option>
          <option value="Capstone">Capstone</option>
          <option value="Misc">Misc</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-800 dark:text-white"
        />
      </div>
    </form>
  );
}
