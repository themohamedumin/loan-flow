import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.post("/auth/login", {
                    email,
                    password
                });

            const data = response.data;

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "email",
                data.email
            );

            localStorage.setItem(
                "role",
                data.role
            );


            if (data.role === "ADMIN") {

                navigate("/admin");

            } else {

                navigate("/dashboard");

            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "430px"
                }}
            >

                {/* BRAND */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >

                    <h1
                        style={{
                            margin: 0,
                            color: "#2563eb",
                            fontSize: "32px"
                        }}
                    >
                        LoanFlow
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "8px"
                        }}
                    >
                        Simple, secure lending.
                    </p>

                </div>


                {/* LOGIN CARD */}

                <div
                    style={{
                        background: "white",
                        padding: "35px",
                        borderRadius: "14px",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "8px"
                        }}
                    >
                        Welcome back
                    </h2>

                    <p
                        style={{
                            color: "#6b7280",
                            marginBottom: "28px"
                        }}
                    >
                        Log in to access your account.
                    </p>


                    <form onSubmit={handleLogin}>

                        {/* EMAIL */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px 14px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* PASSWORD */}

                        <div
                            style={{
                                marginBottom: "22px"
                            }}
                        >

                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px 14px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div
                                style={{
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    padding: "12px 14px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    fontSize: "14px"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#2563eb",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading
                                    ? 0.7
                                    : 1
                            }}
                        >

                            {loading
                                ? "Logging in..."
                                : "Log In"}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "25px",
                            paddingTop: "20px",
                            borderTop:
                                "1px solid #e5e7eb"
                        }}
                    >

                        <span
                            style={{
                                color: "#6b7280",
                                fontSize: "14px"
                            }}
                        >
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            style={{
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                fontWeight: "600",
                                marginLeft: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Create one
                        </button>

                    </div>

                </div>


                <p
                    style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: "12px",
                        marginTop: "20px"
                    }}
                >
                    © 2026 LoanFlow. All rights reserved.
                </p>

            </div>

        </div>
    );
}

export default Login;