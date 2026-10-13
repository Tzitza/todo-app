import { useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./api";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import type { Todo } from "./types";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleAdd(title: string, description: string): Promise<boolean> {
    try {
      const created = await createTodo({ title, description });
      setTodos((current) => [...current, created]);
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }

  async function handleUpdate(todo: Todo): Promise<boolean> {
    try {
      const updated = await updateTodo(todo);
      setTodos((current) => current.map((t) => (t.id === updated.id ? updated : t)));
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }

  async function handleDelete(id: number): Promise<void> {
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TodoForm onAdd={handleAdd} />
      {error && <p className="error">Error: {error}</p>}
      {todos.length === 0 ? (
        <p className="empty">No tasks yet.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;