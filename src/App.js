import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  // State management
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const inputRef = useRef(null);

  // Color themes
  const theme = {
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    secondary: "#f59e0b",
    success: "#10b981",
    danger: "#ef4444",
    text: "#1e293b",
    textLight: "#64748b",
    bg: "#f8fafc",
    cardBg: "#ffffff",
    border: "#e2e8f0",
  };

  // Data fetching
  const fetchTasks = async (token) => {
    try {
      const response = await fetch("https://todobackend-kqc1.onrender.com/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks(token);
      // Focus input when token is available
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [token]);

  // Auth functions
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  // Task operations
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("https://todobackend-kqc1.onrender.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          text: newTaskText, 
          status: "pending", 
          priority: "medium" 
        }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskText("");
      // Maintain focus after adding
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`https://todobackend-kqc1.onrender.com/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      const response = await fetch(
        `https://todobackend-kqc1.onrender.com/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const updateTaskPriority = async (id, newPriority) => {
    try {
      const response = await fetch(
        `https://todobackend-kqc1.onrender.com/tasks/${id}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };

  // Task filtering
  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  // Priority colors
  const priorityColors = {
    low: "#60a5fa",
    medium: theme.primary,
    high: theme.danger,
  };

  // Main App Component
  const MainApp = () => (
    <div 
      className="min-h-screen transition-colors duration-200" 
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Navigation */}
      <nav 
        className="px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10 transition-colors duration-200"
        style={{ backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.border}` }}
      >
        <h1 className="text-2xl font-bold tracking-tight transition-colors duration-200" style={{ color: theme.primary }}>
          <span className="inline-block mr-2">📋</span> TaskFlow
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 font-semibold rounded-md shadow flex items-center gap-2 transition-colors duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: theme.danger, color: "white" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        {/* Add Task Form */}
        <div 
          className="rounded-xl shadow-lg mb-8 overflow-hidden transition-all duration-200 hover:shadow-xl"
          style={{ backgroundColor: theme.cardBg }}
        >
          <form onSubmit={addTask} className="p-6">
            <div className="flex flex-col space-y-4">
              <label htmlFor="task-input" className="text-sm font-medium transition-colors duration-200" style={{ color: theme.textLight }}>
                ADD A NEW TASK
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  ref={inputRef}
                  id="task-input"
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary,
                  }}
                  placeholder="What needs to be done?"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                  style={{ backgroundColor: loading ? theme.primaryDark : theme.primary }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="status-filter" className="block text-sm font-medium mb-1 transition-colors duration-200" style={{ color: theme.textLight }}>
              STATUS
            </label>
            <select
              id="status-filter"
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                color: theme.text,
                focusRingColor: theme.primary,
              }}
              value={filterStatus}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="priority-filter" className="block text-sm font-medium mb-1 transition-colors duration-200" style={{ color: theme.textLight }}>
              PRIORITY
            </label>
            <select
              id="priority-filter"
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                color: theme.text,
                focusRingColor: theme.primary,
              }}
              value={filterPriority}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div 
            className="text-center py-12 rounded-xl transition-all duration-200"
            style={{ backgroundColor: theme.cardBg }}
          >
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full transition-colors duration-200" style={{ backgroundColor: theme.bg }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke={theme.textLight}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1 transition-colors duration-200" style={{ color: theme.text }}>
              No tasks found
            </h3>
            <p className="text-sm transition-colors duration-200" style={{ color: theme.textLight }}>
              {tasks.length === 0 ? "Start by adding your first task" : "Try changing your filters"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: theme.cardBg }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Task Content */}
                    <div className="flex-1 flex items-start gap-3">
                      <button
                        onClick={() => updateTaskStatus(task._id, task.status)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-200 hover:scale-110 active:scale-95 ${task.status === "completed" ? "opacity-50" : ""}`}
                        style={{
                          borderColor: task.status === "completed" ? theme.success : theme.border,
                          backgroundColor: task.status === "completed" ? theme.success : "transparent",
                        }}
                      >
                        {task.status === "completed" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div className={`transition-opacity duration-200 ${task.status === "completed" ? "opacity-70" : ""}`}>
                        <h2 className={`text-lg font-medium mb-1 transition-colors duration-200 ${task.status === "completed" ? "line-through" : ""}`}>
                          {task.text}
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 rounded-full transition-colors duration-200" style={{ 
                            backgroundColor: task.status === "pending" ? `${theme.secondary}20` : `${theme.success}20`,
                            color: task.status === "pending" ? theme.secondary : theme.success,
                          }}>
                            {task.status === "pending" ? "Pending" : "Completed"}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-200" style={{ 
                            backgroundColor: `${priorityColors[task.priority]}20`,
                            color: priorityColors[task.priority],
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <select
                        value={task.priority}
                        onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                        className="p-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                        style={{
                          backgroundColor: theme.bg,
                          borderColor: theme.border,
                          color: theme.text,
                          focusRingColor: theme.primary,
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2 rounded-md flex items-center justify-center transition-colors duration-200 hover:scale-110 active:scale-95"
                        style={{ backgroundColor: `${theme.danger}10`, color: theme.danger }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-8 transition-colors duration-200" style={{ color: theme.textLight }}>
        <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );

  // Router Configuration
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
