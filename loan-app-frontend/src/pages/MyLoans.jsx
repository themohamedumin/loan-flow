import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/MyLoans.css";

function MyLoans() {

    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadLoans = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get("/loans/my-loans");

                setLoans(response.data);

            } catch (error) {

                console.error(error);

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

        loadLoans();

    }, [navigate]);


    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":
                return "loan-status-approved";

            case "REJECTED":
                return "loan-status-rejected";

            case "PAID":
                return "loan-status-paid";

            default:
                return "loan-status-pending";
        }
    };


    const formatStatus = (status) => {

        if (!status) {
            return "Pending";
        }

        return (
            status.charAt(0) +
            status.slice(1).toLowerCase()
        );
    };


    if (loading) {

        return (
            <div className="myloans-page">

                <main className="myloans-container">

                    <div className="myloans-loading">

                        <div className="myloans-spinner"></div>

                        <p>
                            Loading your loans...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="myloans-page">


            {/* NAVBAR */}

            <nav className="myloans-navbar">

                <div className="myloans-logo">
                    LoanFlow
                </div>

                <button
                    className="myloans-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </nav>


            {/* MAIN */}

            <main className="myloans-container">


                {/* HEADER */}

                <div className="myloans-header">

                    <div>

                        <span className="myloans-eyebrow">
                            LOAN MANAGEMENT
                        </span>

                        <h1>
                            My Loans
                        </h1>

                        <p>
                            View and manage your loan applications.
                        </p>

                    </div>


                    <button
                        className="myloans-new-btn"
                        onClick={() =>
                            navigate("/apply")
                        }
                    >
                        + Apply for Loan
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="myloans-error">
                        {error}
                    </div>

                )}


                {/* EMPTY STATE */}

                {loans.length === 0 ? (

                    <div className="myloans-empty">

                        <div className="myloans-empty-icon">
                            +
                        </div>

                        <h2>
                            No Loans Yet
                        </h2>

                        <p>
                            You haven't submitted any
                            loan applications yet.
                        </p>

                        <button
                            className="myloans-apply-btn"
                            onClick={() =>
                                navigate("/apply")
                            }
                        >
                            Apply for a Loan
                        </button>

                    </div>

                ) : (

                    <div className="myloans-list">

                        {loans.map((loan) => (

                            <div
                                className="loan-card"
                                key={loan.id}
                            >


                                {/* CARD HEADER */}

                                <div className="loan-card-header">

                                    <div>

                                        <span className="loan-card-eyebrow">
                                            APPLICATION
                                        </span>

                                        <h2 className="loan-card-title">
                                            Loan #{loan.id}
                                        </h2>

                                    </div>


                                    <span
                                        className={`loan-status ${getStatusClass(
                                            loan.status
                                        )}`}
                                    >
                                        {formatStatus(loan.status)}
                                    </span>

                                </div>


                                {/* LOAN INFORMATION */}

                                <div className="loan-info-grid">


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Loan Amount
                                        </span>

                                        <span className="loan-info-value">
                                            ₦
                                            {loan.amount?.toLocaleString()}
                                        </span>

                                    </div>


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Interest Rate
                                        </span>

                                        <span className="loan-info-value">
                                            {loan.interestRate}%
                                        </span>

                                    </div>


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Duration
                                        </span>

                                        <span className="loan-info-value">
                                            {loan.durationMonths} months
                                        </span>

                                    </div>


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Total Repayment
                                        </span>

                                        <span className="loan-info-value">
                                            ₦
                                            {loan.totalRepayment?.toLocaleString()}
                                        </span>

                                    </div>


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Amount Paid
                                        </span>

                                        <span className="loan-info-value">
                                            ₦
                                            {loan.amountPaid?.toLocaleString()}
                                        </span>

                                    </div>


                                    <div className="loan-info-item">

                                        <span className="loan-info-label">
                                            Monthly Repayment
                                        </span>

                                        <span className="loan-info-value">
                                            ₦
                                            {loan.monthlyRepayment?.toLocaleString()}
                                        </span>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="loan-card-footer">

                                    <div className="loan-balance">

                                        <span className="loan-balance-label">
                                            Remaining Balance
                                        </span>

                                        <span className="loan-balance-value">
                                            ₦
                                            {loan.remainingBalance?.toLocaleString()}
                                        </span>

                                    </div>


                                    <button
                                        className="loan-view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/loans/${loan.id}`
                                            )
                                        }
                                    >
                                        View Loan →
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default MyLoans;