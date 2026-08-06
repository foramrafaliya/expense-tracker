const express = require("express");
const router = express.Router();

// In-memory storage (simple, no DB needed for this demo)
let expenses = [
  { id: 1, title: "Groceries", amount: 450, category: "Food" },
  { id: 2, title: "Bus Pass", amount: 120, category: "Travel" },
  { id: 3, title: "Bus Pass", amount: 120, category: "Travel" },
];
let nextId = 3;

// GET all expenses
router.get("/", (req, res) => {
  res.json(expenses);
});

// POST a new expense
router.post("/", (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: "title and amount are required" });
  }
  const newExpense = { id: nextId++, title, amount, category: category || "Other" };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// DELETE an expense
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  expenses = expenses.filter((e) => e.id !== id);
  res.json({ message: "Deleted", id });
});

module.exports = router;
