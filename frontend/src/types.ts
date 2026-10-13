export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface TodoInput {
  title: string;
  description: string;
}