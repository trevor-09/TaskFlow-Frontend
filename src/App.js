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
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(false);

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

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

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

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 transition-all duration-500 ease-in-out font-[Poppins]">
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-orange-600 bg-orange-100 text-orange-700 shadow-sm"
            >
              Home
            </a>
          </li>
        </ul>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
            className="px-4 py-2 bg-black/80 text-white rounded-full shadow hover:bg-black/90 transition"
          >
            🌓
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-orange-600 drop-shadow">
          MERN To-Do App
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
          className="mb-6 flex gap-2 justify-center"
        >
          <input
            type="text"
            className="p-3 border-2 border-orange-300 rounded-xl w-2/3 shadow focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white"
            placeholder="Add a task"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Add"
            )}
          </button>
        </form>

        <div className="mb-6 flex gap-4 justify-center">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border-2 border-orange-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
            value={filterStatus}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border-2 border-orange-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
            value={filterPriority}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {filteredTasks.length === 0 && (
          <p className="text-center text-orange-400 text-lg font-medium mt-8 animate-pulse">
            📝 No tasks found. Start by adding your first one!
          </p>
        )}

        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-md border border-orange-200 hover:bg-orange-50 dark:hover:bg-gray-600 hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <span className="text-lg text-orange-800 dark:text-orange-300">{task.text}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                    ({task.status}, {task.priority})
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => updateTaskStatus(task._id, task.status)}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors duration-200 ${
                      task.status === "pending"
                        ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                        : "bg-green-400 text-green-900 hover:bg-green-500"
                    }`}
                  >
                    {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                  </button>
                  <select
                    value={task.priority}
                    onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                    className="p-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-full transition-colors duration-200 ml-2"
                    title="Delete Task"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-orange-500 text-white p-4 mt-auto text-center shadow-inner tracking-wider text-sm">
        © 2025 <span className="font-semibold">MERN To-Do App</span>. All rights reserved.
      </footer>
    </div>
  );

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
