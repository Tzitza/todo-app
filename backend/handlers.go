package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// TodoHandler holds the dependencies needed by the HTTP handlers.
type TodoHandler struct {
	db *pgxpool.Pool
}

// NewTodoHandler creates a TodoHandler that uses the given connection pool.
func NewTodoHandler(db *pgxpool.Pool) *TodoHandler {
	return &TodoHandler{db: db}
}

// GetTodos returns all tasks, ordered by ID.
func (h *TodoHandler) GetTodos(c *gin.Context) {
	rows, err := h.db.Query(c.Request.Context(),
		"SELECT id, title, description, completed FROM todos ORDER BY id")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch todos"})
		return
	}
	defer rows.Close()

	todos := []Todo{}
	for rows.Next() {
		var t Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Completed); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read todo"})
			return
		}
		todos = append(todos, t)
	}
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read todos"})
		return
	}

	c.JSON(http.StatusOK, todos)
}

// CreateTodo adds a new task and returns it with its generated ID.
func (h *TodoHandler) CreateTodo(c *gin.Context) {
	var input CreateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title is required"})
		return
	}

	var t Todo
	err := h.db.QueryRow(c.Request.Context(),
		`INSERT INTO todos (title, description)
		 VALUES ($1, $2)
		 RETURNING id, title, description, completed`,
		input.Title, input.Description,
	).Scan(&t.ID, &t.Title, &t.Description, &t.Completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create todo"})
		return
	}

	c.JSON(http.StatusCreated, t)
}

// UpdateTodo replaces the title, description and completed status of a task.
func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input UpdateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title is required"})
		return
	}

	var t Todo
	err = h.db.QueryRow(c.Request.Context(),
		`UPDATE todos
		 SET title = $1, description = $2, completed = $3
		 WHERE id = $4
		 RETURNING id, title, description, completed`,
		input.Title, input.Description, input.Completed, id,
	).Scan(&t.ID, &t.Title, &t.Description, &t.Completed)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update todo"})
		return
	}

	c.JSON(http.StatusOK, t)
}

// DeleteTodo removes a task by ID.
func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	result, err := h.db.Exec(c.Request.Context(),
		"DELETE FROM todos WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete todo"})
		return
	}
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		return
	}

	c.Status(http.StatusNoContent)
}