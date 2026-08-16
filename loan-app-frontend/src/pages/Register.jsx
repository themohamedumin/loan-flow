import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        setLoading(true);


        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });


            setSuccess(
                "Account created successfully!"
            );


            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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
                        Create your account and get started.
                    </p>

                </div>


                {/* REGISTER CARD */}

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
                        Create an account
                    </h2>

                    <p
                        style={{
                            color: "#6b7280",
                            marginBottom: "28px"
                        }}
                    >
                        Fill in your details to create your account.
                    </p>


                    <form onSubmit={handleRegister}>

                        {/* NAME */}

                        <div
                            style={{
                                marginBottom: "18px"
                            }}
                        >

                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px 14px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                }}
                            />

                        </div>


                        {/* EMAIL */}

                        <div
                            style={{
                                marginBottom: "18px"
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
                                    setEmail(e.target.value)
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
                                    fontSize: "15px"
                                }}
                            />

                        </div>


                        {/* PASSWORD */}

                        <div
                            style={{
                                marginBottom: "18px"
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
                                    setPassword(e.target.value)
                                }
                                placeholder="Create a password"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px 14px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                }}
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

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
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px 14px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px"
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


                        {/* SUCCESS */}

                        {success && (

                            <div
                                style={{
                                    background: "#dcfce7",
                                    color: "#166534",
                                    padding: "12px 14px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    fontSize: "14px"
                                }}
                            >
                                {success}
                            </div>

                        )}


                        {/* REGISTER BUTTON */}

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
                                ? "Creating account..."
                                : "Create Account"}

                        </button>

                    </form>


                    {/* LOGIN LINK */}

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
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
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
                            Log in
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

export default Register;