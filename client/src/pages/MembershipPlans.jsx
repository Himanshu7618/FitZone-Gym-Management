import { useEffect, useState } from "react";
import axios from "axios";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingPlanId, setPayingPlanId] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:7000/api/membership-plans"
      );

      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load membership plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePayment = async (plan) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first!");
        return;
      }

      setPayingPlanId(plan._id);

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:7000/api/payments/create-order",
        { planId: plan._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "FitZone Gym",
        description: `${plan.name} Membership`,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:7000/api/payments/verify",
              {
                ...response,
                planId: plan._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              alert("Payment successful! Membership activated.");
            }
          } catch (error) {
            alert(
              error.response?.data?.message ||
              "Payment verification failed."
            );
          }
        },

        theme: {
          color: "#22d3ee",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to start payment."
      );
    } finally {
      setPayingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-16 md:px-12 lg:px-20">

      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <p className="text-cyan-400 text-sm font-bold tracking-[0.3em] uppercase mb-3">
          FitZone Membership
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
          Choose Your{" "}
          <span className="text-cyan-400">
            Membership Plan
          </span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
          Choose the plan that fits your fitness goals and start your
          transformation today.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-zinc-400 text-lg">
            Loading membership plans...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">
            {error}
          </p>
        </div>
      )}

      {/* No plans */}
      {!loading && !error && plans.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">
            No active membership plans available.
          </p>
        </div>
      )}

      {/* Plans */}
      {!loading && !error && plans.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

          {plans.map((plan) => (
            <div
              key={plan._id}
              className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-7 hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300"
            >

              {/* Plan Name */}
              <h2 className="text-2xl font-bold mb-5">
                {plan.name}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-extrabold">
                  ₹{plan.price}
                </span>

                <span className="text-zinc-500 ml-2">
                  / {plan.duration} {plan.durationType}
                </span>
              </div>

              {/* Description */}
              <p className="text-zinc-400 min-h-48px mb-7">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="border-t border-zinc-800 mb-6"></div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-400/10 text-cyan-400 font-bold">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Join Button */}
              <button
                onClick={() => handlePayment(plan)}
                disabled={payingPlanId === plan._id}
                className="w-full bg-cyan-400 text-black py-3.5 rounded-xl font-bold hover:bg-cyan-300 transition"
              >
                {payingPlanId === plan._id ? "Processing..." : "Join Now"}
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MembershipPlans;