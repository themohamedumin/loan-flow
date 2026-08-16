import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function BorrowerDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await api.get("/loans/dashboard");

                setDashboard(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);


    const formatMoney = (amount) => {

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 2
        }).format(amount || 0);
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };


    if (loading) {

        return (
            <div className="dashboard-page">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }


    if (error) {

        return (
            <div className="dashboard-page">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }


    return (
        <div className="dashboard-page">

            {/* HEADER */}

            <header className="dashboard-header">

                <div>
                    <h1>Borrower Dashboard</h1>

                    <p>
                        Manage your loans and payments
                    </p>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            {/* MONEY CARDS */}

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <span>Total Borrowed</span>

                    <strong>
                        {formatMoney(
                            dashboard.totalBorrowed
                        )}
                    </strong>

                </div>


                <div className="dashboard-card">

                    <span>Total Paid</span>

                    <strong>
                        {formatMoney(
                            dashboard.totalPaid
                        )}
                    </strong>

                </div>


                <div className="dashboard-card">

                    <span>Outstanding</span>

                    <strong>
                        {formatMoney(
                            dashboard.totalOutstanding
                        )}
                    </strong>

                </div>


                <div className="dashboard-card">

                    <span>Total Loans</span>

                    <strong>
                        {dashboard.totalLoans}
                    </strong>

                </div>

            </div>


            {/* LOAN STATUS */}

            <div className="dashboard-section">

                <h2>Loan Overview</h2>

                <div className="status-grid">

                    <div className="status-card pending">

                        <span>Pending</span>

                        <strong>
                            {dashboard.pendingLoans}
                        </strong>

                    </div>


                    <div className="status-card approved">

                        <span>Approved</span>

                        <strong>
                            {dashboard.approvedLoans}
                        </strong>

                    </div>


                    <div className="status-card rejected">

                        <span>Rejected</span>

                        <strong>
                            {dashboard.rejectedLoans}
                        </strong>

                    </div>


                    <div className="status-card paid">

                        <span>Paid</span>

                        <strong>
                            {dashboard.paidLoans}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ACTIONS */}

            <div className="dashboard-section">

                <h2>Quick Actions</h2>

                <div className="quick-actions">

                    <button
                        onClick={() =>
                            navigate("/borrower/loans")
                        }
                    >
                        View My Loans
                    </button>


                    <button
                        onClick={() =>
                            navigate("/borrower/apply")
                        }
                    >
                        Apply for Loan
                    </button>

                </div>

            </div>

        </div>
    );
}

export default BorrowerDashboard;