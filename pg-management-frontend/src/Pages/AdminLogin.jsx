import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";
import api from "../Services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", {
        username,
        password,
      });

      sessionStorage.setItem("adminToken", response.data.token);
      sessionStorage.setItem("adminUsername", response.data.username);

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-section">
      <div className="admin-login-card">
        <div className="login-icon"><LockKeyhole size={32} /></div>
        <span className="eyebrow">ADMINISTRATION</span>
        <h1>Admin Login</h1>
        <p>Sign in to manage rooms, enquiries and food trials.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={login} className="form-grid single-column">
          <label>
            Username
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn-primary" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}