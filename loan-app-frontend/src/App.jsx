import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyLoans from "./pages/MyLoans";
import ApplyLoan from "./pages/ApplyLoan";
import LoanDetails from "./pages/LoanDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoans from "./pages/AdminLoans";
import AdminLoanDetails from "./pages/AdminLoanDetails";
import Register from "./pages/Register";
import Payment from "./pages/Payment";

function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/loans"
                    element={<MyLoans />}
                />
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/apply"
                    element={<ApplyLoan />}
                />

                <Route
                    path="/loans/:id"
                    element={<LoanDetails />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />


                <Route
                    path="/admin/loans"
                    element={<AdminLoans />}
                />

                <Route
                    path="/admin/loans/:id"
                    element={<AdminLoanDetails />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/loans/:id/payment"
                    element={<Payment />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;