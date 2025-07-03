import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const API_URL = "https://todobackend-kqc1.onrender.com/tasks";

const theme = {
  primary: "#6366f1",
  danger: "#ef4444",
  success: "#10b981",
  secondary: "#f59e0b",
  bg: "#f8fafc",
  cardBg: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  border: "#e2e8f0"
};

const Login = ({ setToken }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    // Implement actual login logic here
    setToken("mock-token");
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundColor: theme.bg
    }}>
      <form onSubmit={handleLogin} style={{ 
        backgroundColor: theme.cardBg, 
        padding: "2rem", 
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ color: theme.primary, textAlign: "center" }}>Login</h2>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            border: `1px solid ${theme.border}`,
            borderRadius: "4px"
          }}
        />
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            border: `1px solid ${theme.border}`,
            borderRadius: "4px"
          }}
        />
        <button 
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: theme.primary,
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const Signup = () => {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundColor: theme.bg
    }}>
      <div style={{ 
        backgroundColor: theme.cardBg, 
        padding: "2rem", 
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ color: theme.primary, textAlign: "center" }}>Sign Up</h2>
        {/* Signup form implementation would go here */}
      </div>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: "all", priority: "all" });
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState({ main: false, tasks: {} });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, main: true }));
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  const handleTask = async (method, id, body) => {
    try {
      setLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [id]: true } }));
      const url = id ? `${API_URL}/${id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: body && JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Operation failed");
      return await res.json();
    } finally {
      setLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [id]: false } }));
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = await handleTask("POST", null, {
      text: newTask,
      status: "pending",
      priority: "medium"
    });
    if (task) {
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const deleteTask = async (id) => {
    await handleTask("DELETE", id);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const updateTask = async (id, updates) => {
    const updated = await handleTask("PATCH", id, updates);
    if (updated) setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  const filteredTasks = tasks.filter(task => 
    (filter.status === "all" || task.status === filter.status) &&
    (filter.priority === "all" || task.priority === filter.priority)
  );

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : 
          <Login setToken={t => { setToken(t); localStorage.setItem("token", t); }} />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={token ? (
          <div style={{ backgroundColor: theme.bg, minHeight: "100vh", color: theme.text }}>
            <header style={{ 
              backgroundColor: theme.cardBg, 
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${theme.border}`
            }}>
              <h1 style={{ color: theme.primary, margin: 0 }}>TaskFlow</h1>
              <button onClick={logout} style={{ 
                backgroundColor: theme.danger, 
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px"
              }}>
                Logout
              </button>
            </header>

            <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
              <form onSubmit={addTask} style={{ marginBottom: "2rem", display: "flex" }}>
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New task"
                  style={{ 
                    flex: 1,
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    marginRight: "0.5rem"
                  }}
                />
                <button 
                  type="submit" 
                  disabled={loading.main}
                  style={{
                    backgroundColor: theme.primary,
                    color: "white",
                    padding: "0 1.5rem",
                    border: "none",
                    borderRadius: "4px"
                  }}
                >
                  {loading.main ? "Adding..." : "Add"}
                </button>
              </form>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <select 
                  value={filter.status} 
                  onChange={(e) => setFilter({...filter, status: e.target.value })}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px"
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filter.priority}
                  onChange={(e) => setFilter({...filter, priority: e.target.value })}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px"
                  }}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {filteredTasks.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "2rem",
                  backgroundColor: theme.cardBg,
                  borderRadius: "8px"
                }}>
                  <p style={{ color: theme.textLight }}>No tasks found</p>
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {filteredTasks.map(task => (
                    <li key={task._id} style={{ 
                      backgroundColor: theme.cardBg,
                      marginBottom: "0.5rem",
                      padding: "1rem",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <input
                            type="checkbox"
                            checked={task.status === "completed"}
                            onChange={() => updateTask(task._id, { 
                              status: task.status === "pending" ? "completed" : "pending" 
                            })}
                          />
                          <span style={{ 
                            textDecoration: task.status === "completed" ? "line-through" : "none",
                            opacity: task.status === "completed" ? 0.7 : 1
                          }}>
                            {task.text}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <select
                            value={task.priority}
                            onChange={(e) => updateTask(task._id, { priority: e.target.value })}
                            disabled={loading.tasks[task._id]}
                            style={{
                              padding: "0.25rem",
                              border: `1px solid ${theme.border}`,
                              borderRadius: "4px"
                            }}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <button 
                            onClick={() => deleteTask(task._id)}
                            disabled={loading.tasks[task._id]}
                            style={{
                              backgroundColor: theme.danger,
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "0 0.5rem"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </main>
          </div>
        ) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App; // This is the crucial default export
