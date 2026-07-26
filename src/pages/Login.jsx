import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleLogin = async () => {

        setError("");

        try {

            const response = await axios.post(
                "http://localhost:5000/auth/login",
                {
                    username,
                    password
                }
            );

            if (response.data.success) {

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                navigate("/");
            }

        } catch (error) {

            setError(
                "Invalid username or password"
            );

        }
    };
    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Student Management System</h1>
                <p className="login-subtitle">
                    Admin Portal
                </p>

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

                <button onClick={handleLogin}>
                    Login
                </button>

            </div>

        </div>
    );
}

export default Login;