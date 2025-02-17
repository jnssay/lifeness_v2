"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AddTodoForm } from "./components/AddTodoForm";
import { TodoList } from "./components/TodoList";
import type { Todo } from "~/types/todo";
import Timetable from "./components/Timetable";

const CATEGORIES = [
  "All",
  "Hass",
  "Soft Abs",
  "Game Dev",
  "Capstone",
  "Misc",
] as const;

// Helper to format a date for input (YYYY-MM-DD)

export default function Home(): JSX.Element {
  const utils = api.useUtils();
  const todosQuery = api.todo.getAll.useQuery();
  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });
  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });
  const editTodo = api.todo.edit.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const handleAddTodo = async (
    text: string,
    category: string,
    dueDate: string,
  ): Promise<void> => {
    try {
      await createTodo.mutateAsync({
        text,
        category,
        dueDate: dueDate || null,
      });
    } catch (error) {
      console.error("Failed to create todo", error);
    }
  };

  const handleToggle = (id: string): void => {
    toggleTodo.mutate({ id });
  };

  const handleDelete = (id: string): void => {
    deleteTodo.mutate({ id });
  };

  const handleEdit = async (
    id: string,
    newData: { text: string; category: string; dueDate: string; notes: string },
  ): Promise<void> => {
    try {
      await editTodo.mutateAsync({
        id,
        text: newData.text,
        category: newData.category,
        dueDate: newData.dueDate || null,
        notes: newData.notes || null,
      });
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("All");

  // Sort todos by due date, keeping those without a due date at the end
  const todosData: Todo[] = todosQuery.data
    ? todosQuery.data.slice().sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      })
    : [];

  // Filter todos by selected category
  const filteredTodos =
    selectedCategory === "All"
      ? todosData
      : todosData.filter((todo) => todo.category === selectedCategory);

  return (
    <div className="mx-auto flex w-full flex-col gap-4 rounded-lg p-8 shadow-lg">
      <div className="flex flex-row">
        <div className="flex flex-col space-y-2 pr-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded px-4 py-2 text-left ${
                selectedCategory === category
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="w-3/4">
          <AddTodoForm onAdd={handleAddTodo} />

          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
          {todosQuery.isLoading && (
            <div className="text-center text-pink-500">Loading...</div>
          )}
        </div>
      </div>

      <Timetable />
    </div>
  );
}
