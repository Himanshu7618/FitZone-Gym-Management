import { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const endpoint =
                    role === "admin"
                        ? "https://fitzone-gym-management-gyax.onrender.com/api/payments/all-history"
                        : "https://fitzone-gym-management-gyax.onrender.com/api/payments/my-history";

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPayments(response.data.payments);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Unable to fetch payments"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [role, token]);

    if (loading) {
        return <div className="p-6 text-center">Loading payments...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                Payment History
            </h1>

            {payments.length === 0 ? (
                <div className="rounded-xl bg-white p-6 text-center shadow">
                    No payment history found.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow">
                    <table className="w-full min-w-900px text-left text-gray-800">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-4">Member</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Payment ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        <p className="font-medium">
                                            {payment.user?.name || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {payment.user?.email || ""}
                                        </p>
                                    </td>

                                    <td className="p-4">
                                        {payment.plan?.name || "N/A"}
                                    </td>

                                    <td className="p-4 font-semibold">
                                        ₹{payment.plan?.price || 0}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {payment.paymentMethod}
                                    </td>

                                    <td className="p-4 text-sm">
                                        {payment.paymentId || "N/A"}
                                    </td>

                                    <td className="p-4">
                                        {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {payment.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;