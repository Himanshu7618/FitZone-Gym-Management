import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MembershipPlans from "./pages/MembershipPlans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProgressTracking from "./pages/ProgressTracking";
import WorkoutTracking from "./pages/WorkoutTracking";
import DietPlans from "./pages/DietPlans";
import Reports from "./pages/Reports";
import Attendance from "./pages/Attendance";
import MyAttendance from "./pages/MyAttendance";
import Trainers from "./pages/Trainers";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentHistory from "./pages/PaymentHistory";
import DashboardLayout from "./components/DashboardLayout";
function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(34,211,238,0.12),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 min-h-[calc(100vh-80px)] flex items-center">

          <div className="max-w-3xl">
            <p className="text-cyan-400 font-bold tracking-[0.35em] mb-5">
              WELCOME TO FITZONE
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-7">
              BUILD YOUR
              <br />
              <span className="text-cyan-400">STRONGEST</span>
              <br />
              SELF.
            </h1>

            <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-7 mb-9">
              Train harder. Get stronger. Become better.
              FitZone gives you the right environment, expert guidance
              and membership plans to reach your fitness goals.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/membership-plans"
                className="bg-cyan-400 text-black px-7 py-3.5 rounded-xl font-bold hover:bg-cyan-300 transition duration-300"
              >
                View Membership Plans
              </Link>

              <a
                href="#services"
                className="border border-zinc-700 px-7 py-3.5 rounded-xl font-bold hover:border-cyan-400 hover:text-cyan-400 transition duration-300"
              >
                Explore FitZone
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">
              500+
            </h2>
            <p className="text-zinc-500 mt-2">Active Members</p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">
              10+
            </h2>
            <p className="text-zinc-500 mt-2">Expert Trainers</p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">
              20+
            </h2>
            <p className="text-zinc-500 mt-2">Fitness Programs</p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-cyan-400">
              5+
            </h2>
            <p className="text-zinc-500 mt-2">Years Experience</p>
          </div>

        </div>
      </section>


      {/* SERVICES */}
      <section
        id="services"
        className="py-24 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-cyan-400 font-bold tracking-[0.3em] mb-3">
              WHAT WE OFFER
            </p>

            <h2 className="text-4xl md:text-5xl font-black">
              TRAIN. <span className="text-cyan-400">TRANSFORM.</span>
            </h2>

            <p className="text-zinc-500 max-w-2xl mx-auto mt-5">
              Everything you need to improve your strength, fitness and
              overall performance.
            </p>
          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-400 transition duration-300">
              <div className="text-4xl mb-6">🏋️</div>

              <h3 className="text-2xl font-bold mb-3">
                Strength Training
              </h3>

              <p className="text-zinc-500 leading-7">
                Build muscle, increase strength and improve your physical
                performance with structured workouts.
              </p>
            </div>


            {/* Card 2 */}
            <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-400 transition duration-300">
              <div className="text-4xl mb-6">🔥</div>

              <h3 className="text-2xl font-bold mb-3">
                Weight Loss
              </h3>

              <p className="text-zinc-500 leading-7">
                Follow effective training programs designed to help you
                burn fat and achieve your fitness goals.
              </p>
            </div>


            {/* Card 3 */}
            <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-400 transition duration-300">
              <div className="text-4xl mb-6">⚡</div>

              <h3 className="text-2xl font-bold mb-3">
                Personal Training
              </h3>

              <p className="text-zinc-500 leading-7">
                Get personalized guidance from experienced trainers and
                stay consistent with your fitness journey.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* MEMBERSHIP CTA */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto">

          <div className="bg-cyan-400 rounded-3xl px-8 md:px-16 py-14 text-black flex flex-col md:flex-row items-center justify-between gap-8">

            <div>
              <p className="font-bold tracking-widest mb-3">
                START TODAY
              </p>

              <h2 className="text-3xl md:text-5xl font-black">
                Ready to transform yourself?
              </h2>

              <p className="mt-4 text-black/70 max-w-xl">
                Choose a membership plan that fits your goals and start
                your fitness journey with FitZone.
              </p>
            </div>

            <Link
              to="/membership-plans"
              className="shrink-0 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition"
            >
              Join FitZone →
            </Link>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">

          <p className="font-bold tracking-widest">
            FIT<span className="text-cyan-400">ZONE</span>
          </p>

          <p className="text-zinc-600 text-sm">
            © 2026 FitZone. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}

const DashboardPage = ({ children, allowedRoles }) => {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};


function App() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserRole("");
        return;
      }

      try {
        const response = await axios.get(
          "https://fitzone-gym-management-gyax.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserRole(response.data.user.role);
      } catch (error) {
        console.error("Role fetch error:", error);
        setUserRole("");
      }
    };

    fetchUserRole();
  }, []);

  return (
    <BrowserRouter>

      {/* NAVBAR */}
 <nav className="h-16 md:h-20 bg-zinc-950 border-b border-zinc-800 px-4 md:px-12 flex items-center justify-between text-white">

  <Link
    to="/"
    className="text-xl md:text-2xl font-extrabold tracking-wider md:tracking-widest shrink-0"
  >
    FIT<span className="text-cyan-400">ZONE</span>
  </Link>

  <div className="flex items-center gap-3 md:gap-6 text-xs sm:text-sm md:text-base">

    {!localStorage.getItem("token") ? (
      <>
        <Link to="/" className="text-zinc-300 hover:text-cyan-400">
          Home
        </Link>

        <Link
          to="/membership-plans"
          className="text-zinc-300 hover:text-cyan-400 whitespace-nowrap"
        >
          Membership
        </Link>

        <Link to="/login" className="text-zinc-300 hover:text-cyan-400">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-cyan-400 text-black px-3 md:px-5 py-2 rounded-lg font-bold whitespace-nowrap"
        >
          Register
        </Link>
      </>
    ) : (
      <>
        <Link to="/" className="text-zinc-300 hover:text-cyan-400">
          Home
        </Link>

        <Link
          to="/membership-plans"
          className="text-zinc-300 hover:text-cyan-400 whitespace-nowrap"
        >
          Membership
        </Link>

        <span className="text-cyan-400 font-semibold whitespace-nowrap">
          <span className="md:hidden">
            {userRole === "admin" ? "Admin" : "Member"}
          </span>
          <span className="hidden md:inline">
            {userRole === "admin" ? "Admin Panel" : "Member Panel"}
          </span>
        </span>
      </>
    )}

  </div>
</nav>


      {/* ROUTES */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/membership-plans" element={<MembershipPlans />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={<DashboardPage><Dashboard /></DashboardPage>}
        />

        <Route
          path="/progress"
          element={<DashboardPage><ProgressTracking /></DashboardPage>}
        />

        <Route
          path="/workouts"
          element={<DashboardPage><WorkoutTracking /></DashboardPage>}
        />

        <Route
          path="/diet-plans"
          element={<DashboardPage><DietPlans /></DashboardPage>}
        />

        <Route
          path="/reports"
          element={<DashboardPage><Reports /></DashboardPage>}
        />

        <Route
          path="/attendance"
          element={
            <DashboardPage allowedRoles={["admin"]}>
              <Attendance />
            </DashboardPage>
          }
        />

        <Route
          path="/my-attendance"
          element={<DashboardPage><MyAttendance /></DashboardPage>}
        />

        <Route
          path="/trainers"
          element={
            <DashboardPage allowedRoles={["admin"]}>
              <Trainers />
            </DashboardPage>
          }
        />

        <Route
          path="/payment-history"
          element={<DashboardPage><PaymentHistory /></DashboardPage>}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;