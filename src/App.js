import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const API_URL = "https://todobackend-kqc1.onrender.com/tasks";

// Updated theme with better contrast
const theme = {
  primary: "#6366f1",
  danger: "#dc2626",  // Darker red for better visibility
  success: "#059669",  // Darker green
  secondary: "#d97706", // Darker amber
  bg: "#f3f4f6",      // Light gray background
  cardBg: "#ffffff",   // White cards
  text: "#111827",     // Almost black for text
  textLight: "#4b5563", // Dark gray
  border: "#d1d5db"    // Light gray border
};

function App() {
  // ... [previous state declarations remain the same] ...

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : 
          <Login setToken={t => { setToken(t); localStorage.setItem("token", t); }} />} />
        <Route path="/" element={token ? (
          // Main container with dark text on light background
          <div style={{ 
            backgroundColor: theme.bg, 
            minHeight: "100vh",
            color: theme.text  // Added text color here
          }}>
            {/* Header with contrast */}
            <header style={{ 
              backgroundColor: theme.cardBg, 
              padding: "1rem",
              borderBottom: `1px solid ${theme.border}`,
              color: theme.text
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

            <main style={{ 
              maxWidth: "800px", 
              margin: "0 auto", 
              padding: "2rem 1rem",
              color: theme.text  // Ensure text color
            }}>
              {/* Form with proper contrast */}
              <form onSubmit={addTask} style={{ marginBottom: "2rem" }}>
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New task"
                  style={{ 
                    width: "70%", 
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    color: theme.text  // Dark text
                  }}
                />
                <button 
                  type="submit" 
                  disabled={loading.main}
                  style={{
                    backgroundColor: theme.primary,
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    marginLeft: "0.5rem",
                    border: "none",
                    borderRadius: "4px"
                  }}
                >
                  {loading.main ? "Adding..." : "Add Task"}
                </button>
              </form>

              {/* Task list items with contrast */}
              {filteredTasks.length === 0 ? (
                <p style={{ color: theme.textLight }}>No tasks found</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {filteredTasks.map(task => (
                    <li key={task._id} style={{ 
                      backgroundColor: theme.cardBg,
                      color: theme.text,  // Explicit text color
                      marginBottom: "0.5rem",
                      padding: "1rem",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}>
                      {/* ... [rest of task item code] ... */}
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
}

// Updated Login component with better contrast
function Login({ setToken }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text  // Dark text
    }}>
      <form onSubmit={handleLogin} style={{
        backgroundColor: theme.cardBg,
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ 
          color: theme.primary,
          marginTop: 0,
          textAlign: "center"
        }}>Login</h2>
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
}
