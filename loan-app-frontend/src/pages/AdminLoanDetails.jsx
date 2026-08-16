import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Admin.css";

function AdminLoanDetails() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loan, setLoan] = useState(null);
    const [payments, setPayments] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);


    // ==========================================
    // LOAD LOAN DETAILS
    // ==========================================

    useEffect(() => {

        loadLoan();

    }, [id]);


    const loadLoan = async () => {

        try {

            setLoading(true);
            setError("");

            // Get loan
            const loanResponse =
                await api.get(`/loans/${id}`);

            setLoan(loanResponse.data);


            // Get payment history
            const paymentResponse =
                await api.get(`/loans/${id}/payments`);

            setPayments(paymentResponse.data);

        } catch (error) {

            console.error(
                "ADMIN LOAN DETAILS ERROR:",
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
                "Failed to load loan details"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // APPROVE LOAN
    // ==========================================

    const approveLoan = async () => {

        try {

            setActionLoading(true);
            setError("");

            await api.put(
                `/loans/${id}/approve`
            );

            await loadLoan();

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

            setActionLoading(false);

        }
    };


    // ==========================================
    // REJECT LOAN
    // ==========================================

    const rejectLoan = async () => {

        try {

            setActionLoading(true);
            setError("");

            await api.put(
                `/loans/${id}/reject`
            );

            await loadLoan();

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

            setActionLoading(false);

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
                            Loading loan...
                        </h3>

                        <p>
                            Please wait while we load
                            the loan details.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !loan) {

        return (
            <div className="admin-page">

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


                <main className="admin-container">

                    <div className="admin-error">
                        {error}
                    </div>


                    <button
                        className="admin-btn admin-btn-dark"
                        onClick={() =>
                            navigate("/admin/loans")
                        }
                    >
                        ← Back to Loans
                    </button>

                </main>

            </div>
        );
    }


    // ==========================================
    // LOAN NOT FOUND
    // ==========================================

    if (!loan) {

        return (
            <div className="admin-page">

                <main className="admin-container">

                    <div className="admin-empty">

                        <h3>
                            Loan Not Found
                        </h3>

                        <p>
                            The requested loan could not
                            be found.
                        </p>

                        <button
                            className="admin-btn admin-btn-dark"
                            onClick={() =>
                                navigate("/admin/loans")
                            }
                        >
                            ← Back to Loans
                        </button>

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
                            Loan #{loan.id}
                        </h1>

                        <p>
                            Complete loan application
                            details.
                        </p>

                    </div>


                    <button
                        className="admin-btn admin-btn-dark"
                        onClick={() =>
                            navigate("/admin/loans")
                        }
                    >
                        ← Back to Loans
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
                    LOAN STATUS
                ========================================== */}

                <div className="admin-card">

                    <div className="admin-card-header">

                        <h2>
                            Loan Status
                        </h2>


                        <span
                            className={`admin-status ${getStatusClass(
                                loan.status
                            )}`}
                        >
                            {loan.status}
                        </span>

                    </div>


                    {loan.status === "PENDING" && (

                        <div
                            className="admin-actions"
                            style={{
                                padding: "20px 24px"
                            }}
                        >

                            <button
                                className="admin-btn admin-btn-success"
                                disabled={actionLoading}
                                onClick={approveLoan}
                            >

                                {actionLoading
                                    ? "Processing..."
                                    : "Approve Loan"}

                            </button>


                            <button
                                className="admin-btn admin-btn-danger"
                                disabled={actionLoading}
                                onClick={rejectLoan}
                            >
                                Reject Loan
                            </button>

                        </div>

                    )}

                </div>


                {/* ==========================================
                    BORROWER INFORMATION
                ========================================== */}

                <div className="admin-card">

                    <div className="admin-card-header">

                        <h2>
                            Borrower Information
                        </h2>

                    </div>


                    <div className="admin-financial-grid">

                        <div className="admin-financial-item">

                            <span>
                                Name
                            </span>

                            <strong>
                                {loan.borrower?.name ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {loan.borrower?.email ||
                                    "N/A"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    LOAN INFORMATION
                ========================================== */}

                <div className="admin-card">

                    <div className="admin-card-header">

                        <h2>
                            Loan Information
                        </h2>

                    </div>


                    <div className="admin-financial-grid">


                        <div className="admin-financial-item">

                            <span>
                                Loan Amount
                            </span>

                            <strong>
                                ₦
                                {(
                                    loan.amount || 0
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Interest Rate
                            </span>

                            <strong>
                                {loan.interestRate ?? 0}%
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {loan.durationMonths ?? 0}
                                {" "}
                                months
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Total Repayment
                            </span>

                            <strong>
                                ₦
                                {(
                                    loan.totalRepayment || 0
                                ).toLocaleString()}
                            </strong>

                        </div>


                        <div className="admin-financial-item">

                            <span>
                                Monthly Repayment
                            </span>

                            <strong>
                                ₦
                                {(
                                    loan.monthlyRepayment || 0
                                ).toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    REPAYMENT SUMMARY
                ========================================== */}

                <div className="admin-card">

                    <div className="admin-card-header">

                        <h2>
                            Repayment Summary
                        </h2>

                    </div>


                    <div className="admin-financial-grid">


                        <div className="admin-financial-item">

                            <span>
                                Amount Paid
                            </span>

                            <strong>
                                ₦
                                {(
                                    loan.amountPaid || 0
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
                                    loan.remainingBalance || 0
                                ).toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    PAYMENT HISTORY
                ========================================== */}

                <div className="admin-card">

                    <div className="admin-card-header">

                        <h2>
                            Payment History
                        </h2>


                        <span>
                            {payments.length} payment
                            {payments.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {payments.length === 0 ? (

                        <div className="admin-empty">

                            <h3>
                                No Payments Yet
                            </h3>

                            <p>
                                This borrower has not made
                                any payments on this loan.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {payments.map(
                                    (payment) => (

                                        <tr
                                            key={payment.id}
                                        >

                                            <td>
                                                Payment #
                                                {payment.id}
                                            </td>


                                            <td>

                                                <strong>
                                                    ₦
                                                    {(
                                                        payment.amount ||
                                                        0
                                                    ).toLocaleString()}
                                                </strong>

                                            </td>


                                            <td>

                                                {payment.paymentDate
                                                    ? new Date(
                                                        payment.paymentDate
                                                    ).toLocaleString()
                                                    : "N/A"}

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


            </main>

        </div>
    );
}

export default AdminLoanDetails;