import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Save admin information
            localStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            // Tell App.jsx that login was successful
            onLogin(data.admin);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="login-icon">
                        🎓
                    </div>

                    <h1>
                        Student Management
                    </h1>

                    <p>
                        Admin Login
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <div className="login-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>

                    <div className="login-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <div className="login-footer">
                    <p>
                        Admin access only
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Login;