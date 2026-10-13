import { useState } from "react";
import type { FormEvent } from "react";

interface TodoFormProps {
  onAdd: (title: string, description: string) => Promise<boolean>;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim() === "") return;

    const success = await onAdd(title.trim(), description.trim());
    if (success) {
      setTitle("");
      setDescription("");
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        Add
      </button>
    </form>
  );
}

export default TodoForm;