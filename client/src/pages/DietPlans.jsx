
import axios from "axios";
import { useEffect, useState } from "react";

function DietPlans() {
    const [dietPlans, setDietPlans] = useState([]);
    const [members, setMembers] = useState([]);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [planName, setPlanName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [meals, setMeals] = useState([
        { mealType: "breakfast", description: "" },
        { mealType: "lunch", description: "" },
        { mealType: "dinner", description: "" },
    ]);
    const [creating, setCreating] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);


    useEffect(() => {
        const fetchDietPlans = async (userRole) => {
            try {
                const token = localStorage.getItem("token");

                const endpoint =
                    userRole === "trainer"
                        ? "/trainer"
                        : userRole === "admin"
                            ? "/all"
                            : "/my";

                const response = await axios.get(
                    `http://localhost:7000/api/diet-plans${endpoint}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data;

                setDietPlans(
                    Array.isArray(data)
                        ? data
                        : data.dietPlans || data.data || []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Diet plans load nahi ho sake."
                );
            } finally {
                setLoading(false);
            }
        };


        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:7000/api/trainers/members/active",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMembers(response.data.members || []);
            } catch (err) {
                console.log(
                    "Members fetch error:",
                    err.response?.data?.message || err.message
                );
            }
        };


        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:7000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const userRole = response.data.user.role;
                setRole(userRole);
                if (userRole === "trainer") {
                    await fetchMembers();
                }

                await fetchDietPlans(userRole);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "User details load nahi ho sake."
                );
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    const handleEditDietPlan = (plan) => {
        setEditingPlanId(plan._id);
        setPlanName(plan.name);
        setDescription(plan.description || "");
        setSelectedMember(plan.member?._id || "");

        setStartDate(
            plan.startDate
                ? new Date(plan.startDate).toISOString().split("T")[0]
                : ""
        );

        setEndDate(
            plan.endDate
                ? new Date(plan.endDate).toISOString().split("T")[0]
                : ""
        );

        setMeals(
            plan.meals.map((meal) => ({
                mealType: meal.mealType,
                description: meal.foods.join(", "),
            }))
        );
    };


    const handleUpdateDietPlan = async (e) => {
        e.preventDefault();

        const validMeals = meals.filter(
            (meal) => meal.description.trim() !== ""
        );

        if (!editingPlanId) return;

        try {
            setCreating(true);

            const token = localStorage.getItem("token");

            const formattedMeals = validMeals.map((meal) => ({
                mealType: meal.mealType.toLowerCase(),
                foods: meal.description
                    .split(",")
                    .map((food) => food.trim())
                    .filter(Boolean),
            }));

            await axios.put(
                `http://localhost:7000/api/diet-plans/${editingPlanId}`,
                {
                    name: planName,
                    description,
                    meals: formattedMeals,
                    startDate,
                    endDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Diet plan updated successfully!");

            setEditingPlanId(null);
            setPlanName("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setSelectedMember("");

            setMeals([
                { mealType: "breakfast", description: "" },
                { mealType: "lunch", description: "" },
                { mealType: "dinner", description: "" },
            ]);

            const updatedResponse = await axios.get(
                "http://localhost:7000/api/diet-plans/trainer",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDietPlans(updatedResponse.data.dietPlans || []);

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Diet plan update nahi ho saka."
            );
        } finally {
            setCreating(false);
        }
    };


    const handleDeleteDietPlan = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this diet plan?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:7000/api/diet-plans/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Diet plan deleted successfully!");

            setDietPlans((prevPlans) =>
                prevPlans.filter((plan) => plan._id !== id)
            );

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Diet plan delete nahi ho saka."
            );
        }
    };


    const handleCreateDietPlan = async (e) => {
        e.preventDefault();

        if (!selectedMember) {
            alert("Please select a member");
            return;
        }

        const validMeals = meals.filter(
            (meal) => meal.description.trim() !== ""
        );
        const formattedMeals = validMeals.map((meal) => ({
            mealType: meal.mealType.toLowerCase(),
            foods: meal.description
                .split(",")
                .map((food) => food.trim())
                .filter(Boolean),
        }));

        if (validMeals.length === 0) {
            alert("Please enter at least one meal");
            return;
        }

        try {
            setCreating(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:7000/api/diet-plans",
                {
                    memberId: selectedMember,
                    name: planName,
                    description,
                    meals: formattedMeals,
                    startDate,
                    endDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || "Diet plan created successfully!");

            setPlanName("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setSelectedMember("");
            setMeals([
                { mealType: "Breakfast", description: "" },
                { mealType: "Lunch", description: "" },
                { mealType: "Dinner", description: "" },
            ]);

            const updatedResponse = await axios.get(
                "http://localhost:7000/api/diet-plans/trainer",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDietPlans(updatedResponse.data.dietPlans || []);

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Diet plan create nahi ho saka."
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    Diet Plans
                </h1>

                <p className="mb-8 text-gray-600">
                    Manage your daily nutrition and diet plans.
                </p>

                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    {role === "trainer" && (
                        <div className="mb-8 rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                Create Diet Plan
                            </h2>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Member
                            </label>

                            <select
                                className="w-full rounded-lg border border-gray-300 p-3"
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                            >
                                <option value="" disabled>
                                    Choose a member
                                </option>

                                {members.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name} - {member.email}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-5 space-y-4">

                                <input
                                    type="text"
                                    placeholder="Diet Plan Name"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="w-full rounded-lg border p-3"
                                />

                                <textarea
                                    placeholder="Diet Plan Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-lg border p-3"
                                    rows="3"
                                />

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-lg border p-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full rounded-lg border p-3"
                                    />
                                </div>


                                <div className="mt-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                        Daily Meals
                                    </h3>

                                    {meals.map((meal, index) => (
                                        <div
                                            key={meal.mealType}
                                            className="mb-4 rounded-lg border p-4"
                                        >
                                            <h4 className="mb-2 font-medium text-gray-700">
                                                {meal.mealType}
                                            </h4>

                                            <textarea
                                                placeholder={`Enter ${meal.mealType} details`}
                                                value={meal.description}
                                                onChange={(e) => {
                                                    const updatedMeals = [...meals];

                                                    updatedMeals[index].description = e.target.value;

                                                    setMeals(updatedMeals);
                                                }}
                                                className="w-full rounded-lg border p-3"
                                                rows="2"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        editingPlanId
                                            ? handleUpdateDietPlan
                                            : handleCreateDietPlan
                                    }
                                    disabled={creating}
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {creating
                                        ? "Please wait..."
                                        : editingPlanId
                                            ? "Update Diet Plan"
                                            : "Create Diet Plan"}
                                </button>


                            </div>

                        </div>
                    )}

                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        My Diet Plans
                    </h2>

                    {loading && (
                        <p className="py-4 text-gray-500">
                            Loading diet plans...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="rounded-lg bg-red-100 p-3 text-red-700">
                            {error}
                        </p>
                    )}

                    {!loading && !error && dietPlans.length === 0 ? (
                        <p className="text-gray-500">
                            No diet plans available yet.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {dietPlans.map((plan) => (
                                <div
                                    key={plan._id}
                                    className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {plan.name}
                                    </h3>
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${plan.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : plan.status === "completed"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {plan.status || "active"}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600">
                                        {plan.description}
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-indigo-50 p-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Member</p>
                                            <p className="font-semibold text-indigo-900">
                                                {plan.member?.name || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Trainer</p>
                                            <p className="font-semibold text-indigo-900">
                                                {plan.trainer?.name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-gray-200 p-3">
                                            <p className="text-xs font-medium text-gray-500">Start Date</p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {plan.startDate
                                                    ? new Date(plan.startDate).toLocaleDateString("en-IN")
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-gray-200 p-3">
                                            <p className="text-xs font-medium text-gray-500">End Date</p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {plan.endDate
                                                    ? new Date(plan.endDate).toLocaleDateString("en-IN")
                                                    : "No end date"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {plan.meals?.map((meal, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-purple-100 bg-linear-to-r from-purple-200 to-indigo-50 p-4 shadow-sm"
                                            >
                                                <h4 className="text-sm font-bold uppercase tracking-wide text-indigo-700">
                                                    🍽️ {meal.mealType}
                                                </h4>

                                                <ul className="mt-3 space-y-2">
                                                    {meal.foods?.map((food, foodIndex) => (
                                                        <li
                                                            key={foodIndex}
                                                            className="flex items-center gap-2 text-sm text-gray-900"
                                                        >
                                                            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                                            {food}
                                                        </li>
                                                    ))}
                                                </ul>

                                                {meal.notes && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Notes: {meal.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>


                                    {role === "trainer" && (
                                        <button
                                            type="button"
                                            onClick={() => handleEditDietPlan(plan)}
                                            className="mt-4 rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                    )}


                                    {role === "trainer" && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDietPlan(plan._id)}
                                            className="ml-2 mt-4 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    )}


                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DietPlans;
