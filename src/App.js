import { useState, useEffect } from "react";
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

  // Data fetching
  const fetchTasks = async (token) => {
    const response = await fetch("https://todobackend-kqc1.onrender.com/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  // Auth functions
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  // Task CRUD operations
  const addTask = async (text) => {
    setLoading(true);
    const response = await fetch("https://todobackend-kqc1.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, status: "pending", priority: "medium" }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setLoading(false);
  };

  const deleteTask = async (id) => {
    await fetch(`https://todobackend-kqc1.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
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
  };

  const updateTaskPriority = async (id, newPriority) => {
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
  };

  // Task filtering
  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  // Main App Component
  const MainApp = () => (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">📋 MERN To-Do</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Add Task Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask(e.target[0].value);
              e.target[0].value = "";
            }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind?"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm"
              value={filterStatus}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm"
              value={filterPriority}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-400">📝 Start adding tasks...</p>
          ) : (
            <ul className="space-y-4">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-1 text-gray-800">{task.text}</h2>
                      <p className="text-sm text-gray-500">
  Status: {task.status} | Priority: {task.priority}
  <br />
  <span className="text-xs text-gray-400">
    Added: {new Date(task.createdAt).toLocaleString()}
  </span>
</p>

                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => updateTaskStatus(task._id, task.status)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium shadow ${
                          task.status === "pending"
                            ? "bg-yellow-300 text-yellow-800 hover:bg-yellow-400"
                            : "bg-green-300 text-green-800 hover:bg-green-400"
                        }`}
                      >
                        {task.status === "pending" ? "Mark Done" : "Mark Pending"}
                      </button>
                      <select
                        value={task.priority}
                        onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                        className="p-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2025 MERN To-Do App. All rights reserved.
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
