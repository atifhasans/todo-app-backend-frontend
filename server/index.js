import express from "express";
import cors from "cors"

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

const todos = [];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/todos", (req, res) => {
  res.json({
    message: "All todos",
    todos,
  });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));
  
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  res.json({
    message: "Todo found",
    todo,
  });
});

app.post("/todos", (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo = {
    id: Date.now(),
    title,
  };
  
  todos.push(newTodo);

  res.status(201).json({
    message: "Todo added successfully",
    todo: newTodo,
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required for update" });
  }

  todos[todoIndex].title = title;

  res.json({
    message: "Todo updated successfully",
    todo: todos[todoIndex],
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const deletedTodo = todos.splice(todoIndex, 1);

  res.json({
    message: "Todo deleted successfully",
    todo: deletedTodo[0],
  });
});

app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
