import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [error, setError] = useState(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });

      const data = await response.json();
      setTodos([...todos, data.todo]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  // Start editing a todo
  const startEditing = (id, currentTitle) => {
    setEditingTodoId(id);
    setEditingTitle(currentTitle);
  };

  // Save the edited todo
  const saveTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle }),
      });

      const data = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? data.todo : todo)));
      setEditingTodoId(null);
      setEditingTitle('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <h1>Todo App</h1>

      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingTodoId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveTodo(todo.id)}>Save</button>
                <button onClick={() => setEditingTodoId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="todo-item">
                <span>{todo.title}</span>
                <div className="todo-buttons">
                  <button onClick={() => startEditing(todo.id, todo.title)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
