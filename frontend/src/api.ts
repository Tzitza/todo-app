import type { Todo, TodoInput } from "./types";

const API_URL = "http://localhost:8080";

// Throws an Error with the backend's message when the response is not 2xx.
async function checkResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (status ${response.status})`);
  }
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  await checkResponse(response);
  return response.json();
}

export async function createTodo(input: TodoInput): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await checkResponse(response);
  return response.json();
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    }),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  await checkResponse(response);
}