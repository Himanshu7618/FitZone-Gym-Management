
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:7000/api/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReports(response.data.reports);
      } catch (error) {
        console.error("Reports Error:", error);
        setError(
          error.response?.data?.message || "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const revenueData = reports?.monthlyRevenue?.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
  })) || [];

  const membersData = reports?.monthlyMembers?.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    members: item.total,
  })) || [];
  const membershipData = reports?.membershipStatus?.map((item) => ({
    name: item._id,
    value: item.total,
  })) || [];

  const COLORS = ["#10b981", "#ef4444"];
  const attendanceData = reports?.monthlyAttendance?.map((item) => ({
  month: `${item._id.month}/${item._id.year}`,
  attendance: item.total,
})) || [];

  if (loading) {
    return <div className="p-6 text-center text-indigo-600">Loading Reports...</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (!reports) return null;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="mt-2 text-gray-500">
          Monitor your gym performance and business growth.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl bg-linear-to-r from-indigo-500 to-blue-600 p-5 text-white shadow-lg">
          <p className="text-sm text-indigo-100">Total Members</p>
          <h2 className="mt-2 text-3xl font-bold">
            {reports.totalMembers}
          </h2>
        </div>

        <div className="rounded-xl bg-linear-to-r from-emerald-500 to-green-600 p-5 text-white shadow-lg">
          <p className="text-sm text-green-100">Total Revenue</p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹{reports.totalRevenue?.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl bg-linear-to-r from-purple-500 to-violet-600 p-5 text-white shadow-lg">
          <p className="text-sm text-purple-100">Paid Payments</p>
          <h2 className="mt-2 text-3xl font-bold">
            {reports.paymentStatus?.find(
              (item) => item._id === "paid"
            )?.total || 0}
          </h2>
        </div>

      </div>

      {/* Monthly Revenue Chart */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="revenue"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Monthly Members Chart */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Monthly New Members
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={membersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="members"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Membership Status Chart */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Membership Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={membershipData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {membershipData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Monthly Attendance Chart */}
<div className="rounded-xl bg-white p-6 shadow-md">
  <h2 className="mb-5 text-xl font-bold text-gray-800">
    Monthly Attendance
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={attendanceData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar
        dataKey="attendance"
        fill="#f59e0b"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

    </div>
  );
};

export default Reports;
