import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Admin.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);


    useEffect(() => {

        loadDashboard();
        loadPendingLoans();

    }, []);


    const loadDashboard = async () => {

        try {

            const response =
                await api.get("/loans/admin/dashboard");

            setDashboard(response.data);

        } catch (error) {

            console.error("ADMIN DASHBOARD ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );
        }
    };


    const loadPendingLoans = async () => {

        try {

            const response =
                await api.get("/loans/admin/pending");

            setLoans(response.data);

        } catch (error) {

            console.error("PENDING LOANS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load pending loans"
            );
        }
    };


    const approveLoan = async (id) => {

        try {

            setActionLoading(id);

            await api.put(`/loans/${id}/approve`);

            await loadDashboard();
            await loadPendingLoans();

        } catch (error) {

            console.error("APPROVE ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to approve loan"
            );

        } finally {

            setActionLoading(null);

        }
    };


    const rejectLoan = async (id) => {

        try {

            setActionLoading(id);

            await api.put(`/loans/${id}/reject`);

            await loadDashboard();
            await loadPendingLoans();

        } catch (error) {

            console.error("REJECT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to reject loan"
            );

        } finally {

            setActionLoading(null);

        }
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };


    if (!dashboard) {

        return (
            <div className="admin-page">

                <nav className="admin-navbar">

                    <h2 className="admin-logo">
                        LoanFlow Admin
                    </h2>

                </nav>

                <main className="admin-container">

                    <div className="admin-loading">

                        <div className="admin-spinner"></div>

                        <h2>
                            Loading dashboard...
                        </h2>

                        <p>
                            Please wait while we load your
                            lending data.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="admin-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="admin-navbar">

                <div className="admin-navbar-left">

                    <h2 className="admin-logo">
                        LoanFlow
                    </h2>

                    <span className="admin-badge">
                        ADMIN
                    </span>

                </div>


                <div className="admin-navbar-right">

                    <span className="admin-user">

                        {localStorage.getItem("email")}

                    </span>


                    <button
                        className="admin-btn admin-btn-dark"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-container">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="admin-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Monitor your lending activity
                            and manage loan applications.
                        </p>

                    </div>


                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={() =>
                            navigate("/admin/loans")
                        }
                    >
                        View All Loans
                    </button>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="admin-error">

                        <strong>
                            Something went wrong
                        </strong>

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() => setError("")}
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =========================
                    LOAN STATISTICS
                ========================= */}

                <section>

                    <div className="admin-section-title">

                        <h2>
                            Loan Overview
                        </h2>

                    </div>


                    <div className="admin-stats">


                        {/* TOTAL */}

                        <div className="admin-stat-card">

                            <div>

                                <div className="admin-stat-label">
                                    Total Loans
                                </div>

                                <div className="admin-stat-value">
                                    {dashboard.totalLoans}
                                </div>

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="admin-stat-card">


                            <div>

                                <div className="admin-stat-label">
                                    Pending
                                </div>

                                <div className="admin-stat-value">
                                    {dashboard.pendingLoans}
                                </div>

                            </div>

                        </div>


                        {/* APPROVED */}

                        <div className="admin-stat-card">



                            <div>

                                <div className="admin-stat-label">
                                    Approved
                                </div>

                                <div className="admin-stat-value">
                                    {dashboard.approvedLoans}
                                </div>

                            </div>

                        </div>


                        {/* PAID */}

                        <div className="admin-stat-card">



                            <div>

                                <div className="admin-stat-label">
                                    Paid
                                </div>

                                <div className="admin-stat-value">
                                    {dashboard.paidLoans}
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    FINANCIAL SUMMARY
                ========================= */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                Financial Summary
                            </h2>

                            <p>
                                Overall lending performance
                            </p>

                        </div>

                    </div>


                    <div className="admin-financial-grid">


                        <div className="admin-financial-item">

                            <span>
                                Total Amount Loaned
                            </span>

                            <strong>
                                ₦
                                {(
                                    dashboard.totalAmountLoaned || 0
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Total Amount Repaid
                            </span>

                            <strong>
                                ₦
                                {(
                                    dashboard.totalAmountRepaid || 0
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Outstanding Balance
                            </span>

                            <strong>
                                ₦
                                {(
                                    dashboard.totalOutstanding || 0
                                ).toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    PENDING APPLICATIONS
                ========================= */}

                <section className="admin-card">


                    <div className="admin-card-header">

                        <div>

                            <h2>
                                Pending Applications
                            </h2>

                            <p>
                                Loans waiting for your review
                            </p>

                        </div>


                        <span className="admin-pending-count">

                            {loans.length} pending

                        </span>

                    </div>


                    {loans.length === 0 ? (

                        <div className="admin-empty">

                            <div className="admin-empty-icon">
                                ✓
                            </div>

                            <h3>
                                All caught up
                            </h3>

                            <p>
                                There are no pending loan
                                applications right now.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        Loan
                                    </th>

                                    <th>
                                        Borrower
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Duration
                                    </th>

                                    <th>
                                        Interest
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {loans.map((loan) => (

                                    <tr key={loan.id}>


                                        {/* LOAN ID */}

                                        <td>

                                            <strong>
                                                #{loan.id}
                                            </strong>

                                        </td>


                                        {/* BORROWER */}

                                        <td>

                                            <strong>
                                                {loan.borrower?.name ||
                                                    "Unknown"}
                                            </strong>

                                            <br />

                                            <small>
                                                {loan.borrower?.email ||
                                                    "No email"}
                                            </small>

                                        </td>


                                        {/* AMOUNT */}

                                        <td>

                                            <strong>
                                                ₦
                                                {(
                                                    loan.amount || 0
                                                ).toLocaleString()}
                                            </strong>

                                        </td>


                                        {/* DURATION */}

                                        <td>

                                            {loan.durationMonths}
                                            {" "}
                                            months

                                        </td>


                                        {/* INTEREST */}

                                        <td>

                                            {loan.interestRate}%

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                                <span className="admin-status status-pending">

                                                    PENDING

                                                </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="admin-actions">


                                                <button
                                                    className="admin-btn admin-btn-success"
                                                    disabled={
                                                        actionLoading ===
                                                        loan.id
                                                    }
                                                    onClick={() =>
                                                        approveLoan(
                                                            loan.id
                                                        )
                                                    }
                                                >

                                                    {actionLoading ===
                                                    loan.id
                                                        ? "Processing..."
                                                        : "Approve"}

                                                </button>


                                                <button
                                                    className="admin-btn admin-btn-danger"
                                                    disabled={
                                                        actionLoading ===
                                                        loan.id
                                                    }
                                                    onClick={() =>
                                                        rejectLoan(
                                                            loan.id
                                                        )
                                                    }
                                                >

                                                    Reject

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}

export default AdminDashboard;