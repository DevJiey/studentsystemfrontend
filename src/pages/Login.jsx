import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Student Management System</h1>

                <h2>Admin Login</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <button
                    onClick={() => {

                        if (
                            username === "admin" &&
                            password === "admin123"
                        ) {

                            localStorage.setItem(
                                "isLoggedIn",
                                "true"
                            );

                            navigate("/");

                        } else {

                            setError(
                                "Invalid username or password"
                            );

                        }

                    }}
                >
                    Login
                </button>

            </div>

        </div>
    );
}

export default Login;