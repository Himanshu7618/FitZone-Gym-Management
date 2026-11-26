import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:7000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-cyan-400 font-semibold">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-950 text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-cyan-400 font-bold tracking-widest mb-2">
            FITZONE DASHBOARD
          </p>

          <h1 className="text-4xl md:text-5xl font-black">
            Welcome,{" "}
            <span className="text-cyan-400">
              {user.name}
            </span>
          </h1>

          <p className="text-zinc-500 mt-3">
            Manage your fitness journey from here.
          </p>
        </div>


        {/* User Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Profile */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
            <p className="text-zinc-500 text-sm mb-3">
              PROFILE
            </p>

            <h2 className="text-2xl font-bold mb-4">
              {user.name}
            </h2>

            <p className="text-zinc-400 mb-2">
              📧 {user.email}
            </p>

            <p className="text-zinc-400">
              👤 Role:{" "}
              <span className="text-cyan-400 capitalize">
                {user.role || "Member"}
              </span>
            </p>
          </div>


          {/* Membership */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
            <p className="text-zinc-500 text-sm mb-3">
              MEMBERSHIP
            </p>

            <h2 className="text-2xl font-bold mb-4">
              No Active Plan
            </h2>

            <p className="text-zinc-400 mb-5">
              You haven't selected a membership plan yet.
            </p>

            <button
              onClick={() => navigate("/membership-plans")}
              className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-cyan-300 transition"
            >
              Choose Membership
            </button>
          </div>


          {/* Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
            <p className="text-zinc-500 text-sm mb-3">
              ACCOUNT STATUS
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>

              <span className="text-xl font-bold text-green-400">
                Active
              </span>
            </div>

            <p className="text-zinc-500">
              Your FitZone account is active.
            </p>
          </div>

        </div>


        {/* Quick Actions */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/membership-plans")}
              className="border border-zinc-700 px-6 py-3 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              View Membership Plans
            </button>

            <button
              onClick={() => navigate("/")}
              className="border border-zinc-700 px-6 py-3 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;