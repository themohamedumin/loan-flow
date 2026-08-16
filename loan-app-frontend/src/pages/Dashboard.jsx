import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadDashboard = async () => {

            try {

                const response =
                    await api.get("/loans/dashboard");

                setDashboard(response.data);

            } catch (error) {

                console.error("DASHBOARD ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    `Dashboard failed (${error.response?.status || "unknown error"})`
                );
            }
        };

        loadDashboard();

    }, [navigate]);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };


    if (error) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb"
                }}
            >

                <div
                    style={{
                        background: "white",
                        padding: "40px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        textAlign: "center"
                    }}
                >

                    <h1>Dashboard Error</h1>

                    <p
                        style={{
                            color: "#dc2626",
                            margin: "15px 0"
                        }}
                    >
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>

                </div>

            </div>
        );
    }


    if (!dashboard) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb"
                }}
            >

                <h2>
                    Loading dashboard...
                </h2>

            </div>
        );
    }


    const email =
        localStorage.getItem("email");


    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb"
            }}
        >

            {/* NAVBAR */}

            <nav
                style={{
                    background: "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                    padding: "18px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        color: "#2563eb"
                    }}
                >
                    LoanFlow
                </h2>


                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >

                    <span>
                        {email}
                    </span>

                    <button
                        onClick={logout}
                        style={{
                            background: "#111827"
                        }}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN CONTENT */}

            <main
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "40px 20px"
                }}
            >

                {/* WELCOME */}

                <div
                    style={{
                        marginBottom: "30px"
                    }}
                >

                    <h1
                        style={{
                            fontSize: "32px",
                            marginBottom: "8px"
                        }}
                    >
                        Welcome back 👋
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "16px"
                        }}
                    >
                        Here's an overview of your loans.
                    </p>

                </div>


                {/* LOAN STATISTICS */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "20px",
                        marginBottom: "30px"
                    }}
                >

                    {/* TOTAL */}

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "8px"
                            }}
                        >
                            Total Loans
                        </p>

                        <h2>
                            {dashboard.totalLoans}
                        </h2>

                    </div>


                    {/* PENDING */}

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "8px"
                            }}
                        >
                            Pending
                        </p>

                        <h2>
                            {dashboard.pendingLoans}
                        </h2>

                    </div>


                    {/* APPROVED */}

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "8px"
                            }}
                        >
                            Approved
                        </p>

                        <h2>
                            {dashboard.approvedLoans}
                        </h2>

                    </div>


                    {/* PAID */}

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "8px"
                            }}
                        >
                            Paid
                        </p>

                        <h2>
                            {dashboard.paidLoans}
                        </h2>

                    </div>

                </div>


                {/* FINANCIAL SUMMARY */}

                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.05)",
                        marginBottom: "30px"
                    }}
                >

                    <h2>
                        Financial Summary
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "20px",
                            marginTop: "20px"
                        }}
                    >

                        <div>

                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Total Borrowed
                            </p>

                            <h2>
                                ₦
                                {dashboard.totalBorrowed?.toLocaleString()}
                            </h2>

                        </div>


                        <div>

                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Total Paid
                            </p>

                            <h2>
                                ₦
                                {dashboard.totalPaid?.toLocaleString()}
                            </h2>

                        </div>


                        <div>

                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Outstanding
                            </p>

                            <h2>
                                ₦
                                {dashboard.totalOutstanding?.toLocaleString()}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        onClick={() => navigate("/loans")}
                    >
                        My Loans
                    </button>

                    <button
                        onClick={() => navigate("/apply")}
                        style={{
                            background: "#111827"
                        }}
                    >
                        Apply for Loan
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;