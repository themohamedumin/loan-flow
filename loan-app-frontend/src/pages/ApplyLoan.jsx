import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ApplyLoan.css";

function ApplyLoan() {

    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [durationMonths, setDurationMonths] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const interestRate = 3;

    const totalRepayment =
        amount && durationMonths
            ? Number(amount) +
            (Number(amount) *
                interestRate *
                Number(durationMonths)) /
            100
            : 0;


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (Number(amount) <= 0) {
            setError("Enter a valid loan amount.");
            return;
        }

        if (Number(durationMonths) <= 0) {
            setError("Enter a valid loan duration.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/loans", {
                amount: Number(amount),
                durationMonths: Number(durationMonths)
            });

            setSuccess(
                "Loan application submitted successfully!"
            );

            setAmount("");
            setDurationMonths("");

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
                "Failed to submit loan application."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="apply-page">

            {/* NAVBAR */}

            <nav className="apply-navbar">

                <div className="apply-logo">
                    LoanFlow
                </div>

                <button
                    className="apply-dashboard-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Dashboard
                </button>

            </nav>


            {/* MAIN */}

            <main className="apply-container">


                {/* HEADER */}

                <div className="apply-header">

                    <span className="apply-eyebrow">
                        LOAN APPLICATION
                    </span>

                    <h1>
                        Apply for a Loan
                    </h1>

                    <p>
                        Tell us how much you need and
                        how long you'd like to repay it.
                    </p>

                </div>


                {/* LAYOUT */}

                <div className="apply-layout">


                    {/* FORM */}

                    <div className="apply-card">

                        <form onSubmit={handleSubmit}>


                            {/* LOAN AMOUNT */}

                            <div className="apply-field">

                                <label>
                                    Loan Amount
                                </label>

                                <div className="apply-input-wrapper">

                                    <span>
                                        ₦
                                    </span>

                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        min="1"
                                        step="0.01"
                                        required
                                    />

                                </div>

                                <small>
                                    Enter the amount you'd like
                                    to borrow.
                                </small>

                            </div>


                            {/* DURATION */}

                            <div className="apply-field">

                                <label>
                                    Repayment Duration
                                </label>

                                <select
                                    value={durationMonths}
                                    onChange={(e) =>
                                        setDurationMonths(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select duration
                                    </option>

                                    <option value="3">
                                        3 months
                                    </option>

                                    <option value="6">
                                        6 months
                                    </option>

                                    <option value="9">
                                        9 months
                                    </option>

                                    <option value="12">
                                        12 months
                                    </option>

                                    <option value="18">
                                        18 months
                                    </option>

                                    <option value="24">
                                        24 months
                                    </option>

                                </select>

                                <small>
                                    Choose how long you'd like
                                    to repay the loan.
                                </small>

                            </div>


                            {/* SUMMARY */}

                            <div className="apply-summary">

                                <div className="apply-summary-title">
                                    Loan Summary
                                </div>


                                <div className="apply-summary-row">

                                    <span>
                                        Interest Rate
                                    </span>

                                    <strong>
                                        {interestRate}%
                                    </strong>

                                </div>


                                <div className="apply-summary-row">

                                    <span>
                                        Loan Amount
                                    </span>

                                    <strong>
                                        ₦
                                        {amount
                                            ? Number(amount).toLocaleString()
                                            : "0"}
                                    </strong>

                                </div>


                                <div className="apply-summary-divider" />


                                <div
                                    className={
                                        "apply-summary-row " +
                                        "apply-summary-total"
                                    }
                                >

                                    <span>
                                        Estimated Total Repayment
                                    </span>

                                    <strong>
                                        ₦
                                        {totalRepayment
                                            ? totalRepayment.toLocaleString()
                                            : "0"}
                                    </strong>

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div
                                    className={
                                        "apply-message apply-error"
                                    }
                                >
                                    {error}
                                </div>

                            )}


                            {/* SUCCESS */}

                            {success && (

                                <div className="apply-success">

                                    <div className="apply-success-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Application submitted
                                        </strong>

                                        <p>
                                            {success}
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* SUBMIT */}

                            {!success && (

                                <button
                                    type="submit"
                                    className="apply-submit-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Submit Loan Application"}
                                </button>

                            )}

                        </form>

                    </div>


                    {/* SIDE INFORMATION */}

                    <aside className="apply-info">


                        <div className="apply-info-card">

                            <div className="apply-info-icon">
                                ₦
                            </div>

                            <h3>
                                Simple & Transparent
                            </h3>

                            <p>
                                You'll see your interest rate
                                and estimated repayment amount
                                before submitting your
                                application.
                            </p>

                        </div>


                        <div className="apply-info-card">

                            <div className="apply-info-icon">
                                ✓
                            </div>

                            <h3>
                                Quick Review
                            </h3>

                            <p>
                                Once submitted, your application
                                will be reviewed by our lending
                                team.
                            </p>

                        </div>


                        <div className="apply-info-card">

                            <div className="apply-info-icon">
                                🔒
                            </div>

                            <h3>
                                Secure
                            </h3>

                            <p>
                                Your application and financial
                                information are protected by
                                LoanFlow's secure system.
                            </p>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default ApplyLoan;