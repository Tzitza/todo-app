import { useState } from "react";
import type { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  function startEditing() {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(true);
  }

  async function handleSave() {
    if (editTitle.trim() === "") return;

    const success = await onUpdate({
      ...todo,
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    if (success) {
      setIsEditing(false);
    }
  }

  async function handleToggle() {
    await onUpdate({ ...todo, completed: !todo.completed });
  }

  if (isEditing) {
    return (
      <li className="todo-item">
        <div className="edit-fields">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input type="checkbox" checked={todo.completed} onChange={handleToggle} />
      <div className="todo-content">
        <span className="todo-title">{todo.title}</span>
        {todo.description && (
          <span className="todo-description">{todo.description}</span>
        )}
      </div>
      <span className="badge">{todo.completed ? "completed" : "pending"}</span>
      <div className="actions">
        <button className="btn" onClick={startEditing}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;