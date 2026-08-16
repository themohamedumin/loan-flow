import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/LoanDetails.css";

function LoanDetails() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loan, setLoan] = useState(null);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadLoan();

    }, [id]);


    const loadLoan = async () => {

        try {

            setLoading(true);
            setError("");

            const loanResponse =
                await api.get(`/loans/${id}`);

            setLoan(loanResponse.data);


            const paymentResponse =
                await api.get(`/loans/${id}/payments`);

            setPayments(paymentResponse.data);

        } catch (error) {

            console.error(
                "LOAN DETAILS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
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
                "Failed to load loan"
            );

        } finally {

            setLoading(false);

        }
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":
                return "loan-details-status-approved";

            case "REJECTED":
                return "loan-details-status-rejected";

            case "PAID":
                return "loan-details-status-paid";

            default:
                return "loan-details-status-pending";
        }
    };


    if (loading) {

        return (
            <div className="loan-details-page">

                <main className="loan-details-container">

                    <div className="loan-details-loading">

                        <div className="loan-details-spinner" />

                        <p>
                            Loading loan details...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    if (error) {

        return (
            <div className="loan-details-page">

                <nav className="loan-details-navbar">

                    <div className="loan-details-logo">
                        LoanFlow
                    </div>

                </nav>


                <main className="loan-details-container">

                    <div className="loan-details-error-page">

                        <div className="loan-details-error-icon">
                            !
                        </div>

                        <h1>
                            Unable to Load Loan
                        </h1>

                        <p>
                            {error}
                        </p>

                        <button
                            className="loan-details-dark-btn"
                            onClick={() =>
                                navigate("/loans")
                            }
                        >
                            Back to My Loans
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    if (!loan) {

        return (
            <div className="loan-details-page">

                <nav className="loan-details-navbar">

                    <div className="loan-details-logo">
                        LoanFlow
                    </div>

                </nav>


                <main className="loan-details-container">

                    <div className="loan-details-error-page">

                        <h1>
                            Loan Not Found
                        </h1>

                        <p>
                            We couldn't find the loan
                            you're looking for.
                        </p>

                        <button
                            className="loan-details-dark-btn"
                            onClick={() =>
                                navigate("/loans")
                            }
                        >
                            Back to My Loans
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="loan-details-page">


            {/* NAVBAR */}

            <nav className="loan-details-navbar">

                <div className="loan-details-logo">
                    LoanFlow
                </div>


                <button
                    className="loan-details-back-btn"
                    onClick={() =>
                        navigate("/loans")
                    }
                >
                    ← Back to My Loans
                </button>

            </nav>


            {/* MAIN */}

            <main className="loan-details-container">


                {/* HEADER */}

                <div className="loan-details-header">

                    <div>

                        <span className="loan-details-eyebrow">
                            LOAN DETAILS
                        </span>

                        <h1>
                            Loan #{loan.id}
                        </h1>

                        <p>
                            View your loan information,
                            repayment progress and payment history.
                        </p>

                    </div>


                    <span
                        className={
                            `loan-details-status ${getStatusClass(
                                loan.status
                            )}`
                        }
                    >
                        {loan.status}
                    </span>

                </div>


                {/* STATUS MESSAGE */}

                {loan.status === "PENDING" && (

                    <div className="loan-details-notice loan-details-notice-pending">

                        <div className="loan-details-notice-icon">
                            ⏳
                        </div>

                        <div>

                            <strong>
                                Application under review
                            </strong>

                            <p>
                                Your loan application is
                                currently waiting for admin approval.
                            </p>

                        </div>

                    </div>

                )}


                {loan.status === "REJECTED" && (

                    <div className="loan-details-notice loan-details-notice-rejected">

                        <div className="loan-details-notice-icon">
                            !
                        </div>

                        <div>

                            <strong>
                                Loan application rejected
                            </strong>

                            <p>
                                Unfortunately, this loan
                                application was rejected.
                            </p>

                        </div>

                    </div>

                )}


                {loan.status === "PAID" && (

                    <div className="loan-details-notice loan-details-notice-paid">

                        <div className="loan-details-notice-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Loan fully paid
                            </strong>

                            <p>
                                Congratulations! You have
                                completely repaid this loan.
                            </p>

                        </div>

                    </div>

                )}


                {/* LOAN INFORMATION */}

                <section className="loan-details-card">

                    <div className="loan-details-card-header">

                        <div>

                            <span className="loan-details-card-eyebrow">
                                OVERVIEW
                            </span>

                            <h2>
                                Loan Information
                            </h2>

                        </div>

                    </div>


                    <div className="loan-details-info-grid">


                        <div className="loan-details-info-item">

                            <span>
                                Loan Amount
                            </span>

                            <strong>
                                ₦
                                {loan.amount?.toLocaleString()}
                            </strong>

                        </div>


                        <div className="loan-details-info-item">

                            <span>
                                Interest Rate
                            </span>

                            <strong>
                                {loan.interestRate}%
                            </strong>

                        </div>


                        <div className="loan-details-info-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {loan.durationMonths} months
                            </strong>

                        </div>


                        <div className="loan-details-info-item">

                            <span>
                                Total Repayment
                            </span>

                            <strong>
                                ₦
                                {loan.totalRepayment?.toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* REPAYMENT */}

                <section className="loan-details-card">

                    <div className="loan-details-card-header">

                        <div>

                            <span className="loan-details-card-eyebrow">
                                REPAYMENT
                            </span>

                            <h2>
                                Repayment Progress
                            </h2>

                        </div>

                    </div>


                    <div className="loan-details-repayment-grid">


                        <div className="loan-details-repayment-item">

                            <span>
                                Amount Paid
                            </span>

                            <strong>
                                ₦
                                {loan.amountPaid?.toLocaleString()}
                            </strong>

                        </div>


                        <div className="loan-details-repayment-item">

                            <span>
                                Outstanding Balance
                            </span>

                            <strong className="loan-details-balance">
                                ₦
                                {loan.remainingBalance?.toLocaleString()}
                            </strong>

                        </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="loan-details-progress-section">

                        <div className="loan-details-progress-header">

                            <span>
                                Repayment Progress
                            </span>

                            <strong>
                                {loan.totalRepayment > 0
                                    ? Math.min(
                                        100,
                                        Math.round(
                                            (loan.amountPaid /
                                                loan.totalRepayment) *
                                            100
                                        )
                                    )
                                    : 0
                                }%
                            </strong>

                        </div>


                        <div className="loan-details-progress-bar">

                            <div
                                className="loan-details-progress-fill"
                                style={{
                                    width: `${
                                        loan.totalRepayment > 0
                                            ? Math.min(
                                                100,
                                                (
                                                    loan.amountPaid /
                                                    loan.totalRepayment
                                                ) * 100
                                            )
                                            : 0
                                    }%`
                                }}
                            />

                        </div>

                    </div>


                    {/* PAYMENT CTA */}

                    {loan.status === "APPROVED" &&
                        loan.remainingBalance > 0 && (

                            <div className="loan-details-payment-cta">

                                <div>

                                    <strong>
                                        Ready to make a payment?
                                    </strong>

                                    <p>
                                        Make a payment toward your
                                        outstanding balance.
                                    </p>

                                </div>


                                <button
                                    className="loan-details-pay-btn"
                                    onClick={() =>
                                        navigate(
                                            `/loans/${loan.id}/payment`
                                        )
                                    }
                                >
                                    Make Payment
                                </button>

                            </div>

                        )}

                </section>


                {/* PAYMENT HISTORY */}

                <section className="loan-details-card">

                    <div className="loan-details-card-header">

                        <div>

                            <span className="loan-details-card-eyebrow">
                                TRANSACTIONS
                            </span>

                            <h2>
                                Payment History
                            </h2>

                        </div>


                        <span className="loan-details-payment-count">
                            {payments.length}{" "}
                            {payments.length === 1
                                ? "payment"
                                : "payments"}
                        </span>

                    </div>


                    {payments.length === 0 ? (

                        <div className="loan-details-empty">

                            <div className="loan-details-empty-icon">
                                ₦
                            </div>

                            <h3>
                                No payments yet
                            </h3>

                            <p>
                                Your payment history will
                                appear here once you make a payment.
                            </p>

                        </div>

                    ) : (

                        <div className="loan-details-payment-list">

                            {payments.map((payment) => (

                                <div
                                    className="loan-details-payment-row"
                                    key={payment.id}
                                >

                                    <div className="loan-details-payment-left">

                                        <div className="loan-details-payment-icon">
                                            ✓
                                        </div>

                                        <div>

                                            <strong>
                                                Payment #{payment.id}
                                            </strong>

                                            <span>
                                                {payment.paymentDate
                                                    ? new Date(
                                                        payment.paymentDate
                                                    ).toLocaleString()
                                                    : "Date unavailable"
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <strong className="loan-details-payment-amount">
                                        + ₦
                                        {payment.amount?.toLocaleString()}
                                    </strong>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}

export default LoanDetails;