import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [version, setVersion] = useState("");

  const fetchExpenses = () => {
    fetch(`${API_URL}/api/expenses`)
      .then((res) => res.json())
      .then(setExpenses)
      .catch((err) => console.error("Failed to fetch expenses", err));
  };

  const fetchHealth = () => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion("unreachable"));
  };

  useEffect(() => {
    fetchExpenses();
    fetchHealth();
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount: Number(amount), category }),
    });
    setTitle("");
    setAmount("");
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`${API_URL}/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="container">
      <header>
        <h1>💰 Expense Tracker 2</h1>
        <span className="version-badge">Backend: {version}</span>
      </header>

      <form onSubmit={addExpense} className="expense-form">
        <input
          type="text"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="total">Total Spent: ₹{total}</div>

      <ul className="expense-list">
        {expenses.map((exp) => (
          <li key={exp.id}>
            <span className="exp-title">{exp.title}</span>
            <span className="exp-category">{exp.category}</span>
            <span className="exp-amount">₹{exp.amount}</span>
            <button className="delete-btn" onClick={() => deleteExpense(exp.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
