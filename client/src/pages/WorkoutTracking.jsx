
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:7000/api/workouts";

export default function WorkoutTracking() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleCompleteWorkout = async (workoutId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${API_URL}/${workoutId}`,
                { status: "completed" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWorkouts((prevWorkouts) =>
                prevWorkouts.map((workout) =>
                    workout._id === workoutId
                        ? { ...workout, status: "completed" }
                        : workout
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Workout is not completed. Please try again."
            );
        }
    };

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login to view your workouts.");
                    return;
                }

                const response = await axios.get(`${API_URL}/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setWorkouts(response.data.workouts || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Workouts load nahi ho sake. Please login again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-10 sm:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <p className="text-cyan-400 font-semibold uppercase tracking-widest text-sm">
                        FitZone Fitness
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                        My Workouts
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Track your assigned workout plans and exercises.
                    </p>
                </div>

                {loading && (
                    <p className="text-zinc-400">Loading workouts...</p>
                )}

                {!loading && error && (
                    <div className="bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-4">
                        {error}
                    </div>
                )}

                {!loading && !error && workouts.length === 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                        <h2 className="text-xl font-semibold">
                            No workouts assigned yet
                        </h2>
                        <p className="text-zinc-400 mt-2">
                            Your trainer's assigned workout plans will appear here.
                        </p>
                    </div>
                )}

                {!loading && !error && workouts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workouts.map((workout) => (
                            <div
                                key={workout._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {workout.name}
                                        </h2>
                                        <p className="text-zinc-400 text-sm mt-2">
                                            {workout.description || "No description provided"}
                                        </p>
                                    </div>

                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${workout.status === "active"
                                                ? "bg-green-500/10 text-green-400"
                                                : workout.status === "completed"
                                                    ? "bg-cyan-500/10 text-cyan-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}
                                    >
                                        {workout.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 my-5">
                                    <div className="bg-zinc-800 rounded-xl p-3">
                                        <p className="text-zinc-400 text-sm">Exercises</p>
                                        <p className="text-2xl font-bold">
                                            {workout.exercises?.length || 0}
                                        </p>
                                    </div>

                                    <div className="bg-zinc-800 rounded-xl p-3">
                                        <p className="text-zinc-400 text-sm">Trainer</p>
                                        <p className="font-semibold mt-1">
                                            {workout.trainer?.name || "Not assigned"}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="font-semibold mb-3">Exercise Details</h3>

                                <div className="space-y-3">
                                    {workout.exercises?.map((item, index) => (
                                        <div
                                            key={`${workout._id}-${index}`}
                                            className="border border-zinc-800 rounded-xl p-4"
                                        >
                                            <p className="font-semibold">
                                                {item.exercise?.name || "Exercise"}
                                            </p>

                                            <p className="text-zinc-400 text-sm mt-2">
                                                {item.sets} sets × {item.reps} reps
                                            </p>

                                            <div className="flex flex-wrap gap-3 text-sm text-zinc-300 mt-2">
                                                <span>Weight: {item.weight ?? 0} kg</span>
                                                <span>Duration: {item.duration ?? 0} min</span>
                                            </div>

                                            {item.notes && (
                                                <p className="text-zinc-500 text-sm mt-2">
                                                    Notes: {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-zinc-500 text-xs mt-5">
                                    Start date:{" "}
                                    {workout.startDate
                                        ? new Date(workout.startDate).toLocaleDateString()
                                        : "Not available"}
                                </p>
                                {workout.status === "active" && (
                                    <button
                                        onClick={() => handleCompleteWorkout(workout._id)}
                                        className="w-full mt-5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold py-3 rounded-xl transition"
                                    >
                                        Mark as Completed
                                    </button>
                                )}

                                {workout.status === "completed" && (
                                    <div className="w-full mt-5 bg-cyan-500/10 text-cyan-400 text-center font-semibold py-3 rounded-xl">
                                        ✓ Workout Completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
