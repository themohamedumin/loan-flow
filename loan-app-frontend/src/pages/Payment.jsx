import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Payment.css";

function Payment() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loan, setLoan] = useState(null);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);


    useEffect(() => {

        loadLoan();

    }, [id]);


    const loadLoan = async () => {

        try {

            const response =
                await api.get(`/loans/${id}`);

            setLoan(response.data);

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
                "Failed to load loan"
            );

        } finally {

            setLoading(false);

        }
    };


    const handlePayment = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const paymentAmount = Number(amount);


        if (!paymentAmount || paymentAmount <= 0) {

            setError(
                "Enter a valid payment amount."
            );

            return;
        }


        if (
            loan &&
            paymentAmount > loan.remainingBalance
        ) {

            setError(
                "Payment cannot be greater than the outstanding balance."
            );

            return;
        }


        try {

            setPaying(true);

            await api.put(
                `/loans/${id}/payment`,
                {
                    amount: paymentAmount
                }
            );


            setSuccess(
                "Payment successful!"
            );

            setAmount("");

            await loadLoan();


        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Payment failed"
            );

        } finally {

            setPaying(false);

        }
    };


    if (loading) {

        return (
            <div className="payment-page">

                <div className="payment-loading">
                    Loading payment details...
                </div>

            </div>
        );
    }


    if (!loan) {

        return (
            <div className="payment-page">

                <div className="payment-error-page">

                    <h1>
                        Loan Not Found
                    </h1>

                    <button
                        className="payment-back-btn"
                        onClick={() =>
                            navigate("/loans")
                        }
                    >
                        ← Back to My Loans
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="payment-page">


            {/* NAVBAR */}

            <nav className="payment-navbar">

                <div className="payment-logo">
                    LoanFlow
                </div>

                <button
                    className="payment-nav-back"
                    onClick={() =>
                        navigate(`/loans/${id}`)
                    }
                >
                    ← Back to Loan
                </button>

            </nav>


            {/* MAIN */}

            <main className="payment-container">


                {/* HEADER */}

                <div className="payment-header">

                    <span className="payment-eyebrow">
                        LOAN #{loan.id}
                    </span>

                    <h1>
                        Make a Payment
                    </h1>

                    <p>
                        Make a payment toward your
                        outstanding loan balance.
                    </p>

                </div>


                {/* LOAN SUMMARY */}

                <div className="payment-summary">


                    <div className="payment-summary-item">

                        <span>
                            Total Repayment
                        </span>

                        <strong>
                            ₦
                            {loan.totalRepayment?.toLocaleString()}
                        </strong>

                    </div>


                    <div className="payment-summary-item">

                        <span>
                            Amount Paid
                        </span>

                        <strong>
                            ₦
                            {loan.amountPaid?.toLocaleString()}
                        </strong>

                    </div>


                    <div className="payment-summary-item payment-summary-highlight">

                        <span>
                            Outstanding Balance
                        </span>

                        <strong>
                            ₦
                            {loan.remainingBalance?.toLocaleString()}
                        </strong>

                    </div>

                </div>


                {/* PAYMENT CARD */}

                <div className="payment-card">


                    {success && (

                        <div className="payment-success">
                            ✓ {success}
                        </div>

                    )}


                    {error && (

                        <div className="payment-error">
                            {error}
                        </div>

                    )}


                    {loan.remainingBalance > 0 ? (

                        <form
                            className="payment-form"
                            onSubmit={handlePayment}
                        >

                            <div className="payment-form-header">

                                <h2>
                                    Payment Amount
                                </h2>

                                <p>
                                    Enter how much you would
                                    like to pay.
                                </p>

                            </div>


                            <div className="payment-input-wrapper">

                                <span className="payment-currency">
                                    ₦
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    max={loan.remainingBalance}
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="0.00"
                                    required
                                />

                            </div>


                            <div className="payment-limit">

                                <span>
                                    Maximum payment
                                </span>

                                <strong>
                                    ₦
                                    {loan.remainingBalance?.toLocaleString()}
                                </strong>

                            </div>


                            <button
                                type="submit"
                                className="payment-submit"
                                disabled={paying}
                            >

                                {paying
                                    ? "Processing Payment..."
                                    : "Make Payment"
                                }

                            </button>


                        </form>

                    ) : (

                        <div className="payment-paid">

                            <div className="payment-paid-icon">
                                ✓
                            </div>

                            <h2>
                                Loan Fully Paid
                            </h2>

                            <p>
                                You've completely repaid this loan.
                            </p>

                            <button
                                className="payment-back-btn"
                                onClick={() =>
                                    navigate(`/loans/${id}`)
                                }
                            >
                                View Loan Details
                            </button>

                        </div>

                    )}

                </div>


                <p className="payment-security">
                    🔒 Your payment information is securely
                    processed by LoanFlow.
                </p>

            </main>

        </div>
    );
}

export default Payment;