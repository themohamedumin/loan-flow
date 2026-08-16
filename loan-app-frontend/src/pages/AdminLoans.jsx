import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Admin.css";

function AdminLoans() {

    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);


    useEffect(() => {

        loadLoans();

    }, []);


    // ==========================================
    // LOAD ALL LOANS
    // ==========================================

    const loadLoans = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/loans");

            setLoans(response.data);

        } catch (error) {

            console.error(
                "ADMIN LOANS ERROR:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("email");
                localStorage.removeItem("role");

                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load loans"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // APPROVE LOAN
    // ==========================================

    const approveLoan = async (id) => {

        try {

            setActionLoading(id);
            setError("");

            await api.put(
                `/loans/${id}/approve`
            );

            await loadLoans();

        } catch (error) {

            console.error(
                "APPROVE LOAN ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to approve loan"
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ==========================================
    // REJECT LOAN
    // ==========================================

    const rejectLoan = async (id) => {

        try {

            setActionLoading(id);
            setError("");

            await api.put(
                `/loans/${id}/reject`
            );

            await loadLoans();

        } catch (error) {

            console.error(
                "REJECT LOAN ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to reject loan"
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":
                return "status-approved";

            case "REJECTED":
                return "status-rejected";

            case "PAID":
                return "status-paid";

            case "PENDING":
            default:
                return "status-pending";
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-page">

                <nav className="admin-navbar">

                    <h2 className="admin-logo">
                        LoanFlow Admin
                    </h2>

                </nav>


                <main className="admin-container">

                    <div className="admin-empty">

                        <h3>
                            Loading loans...
                        </h3>

                        <p>
                            Please wait while we load
                            the loan applications.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="admin-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <nav className="admin-navbar">

                <h2 className="admin-logo">
                    LoanFlow Admin
                </h2>


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


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="admin-container">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="admin-header">

                    <div>

                        <h1>
                            All Loans
                        </h1>

                        <p>
                            View and manage all loan
                            applications.
                        </p>

                    </div>


                    <button
                        className="admin-btn admin-btn-dark"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>


                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (

                    <div className="admin-error">

                        <strong>
                            Something went wrong
                        </strong>

                        <span>
                            {" "}
                            {error}
                        </span>

                    </div>

                )}


                {/* ==========================================
                    LOAN TABLE
                ========================================== */}

                <div className="admin-card">


                    <div className="admin-card-header">

                        <div>

                            <h2>
                                Loan Applications
                            </h2>

                            <p>
                                {loans.length} total{" "}
                                {loans.length === 1
                                    ? "loan"
                                    : "loans"}
                            </p>

                        </div>

                    </div>


                    {loans.length === 0 ? (

                        <div className="admin-empty">

                            <h3>
                                No Loans Found
                            </h3>

                            <p>
                                There are currently no
                                loan applications.
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
                                        Interest
                                    </th>

                                    <th>
                                        Duration
                                    </th>

                                    <th>
                                        Repayment
                                    </th>

                                    <th>
                                        Balance
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

                                    <tr
                                        key={loan.id}
                                    >


                                        {/* LOAN */}

                                        <td>

                                            <button
                                                className="admin-btn admin-btn-primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/loans/${loan.id}`
                                                    )
                                                }
                                            >
                                                #{loan.id}
                                            </button>

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


                                        {/* INTEREST */}

                                        <td>

                                            {loan.interestRate ?? 0}%

                                        </td>


                                        {/* DURATION */}

                                        <td>

                                            {loan.durationMonths ?? 0}
                                            {" "}
                                            months

                                        </td>


                                        {/* REPAYMENT */}

                                        <td>

                                            ₦
                                            {(
                                                loan.totalRepayment || 0
                                            ).toLocaleString()}

                                        </td>


                                        {/* BALANCE */}

                                        <td>

                                            ₦
                                            {(
                                                loan.remainingBalance || 0
                                            ).toLocaleString()}

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`admin-status ${getStatusClass(
                                                    loan.status
                                                )}`}
                                            >
                                                {loan.status}
                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            {loan.status === "PENDING" ? (

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

                                            ) : (

                                                <span>
                                                    —
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default AdminLoans;