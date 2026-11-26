
import { useEffect, useState } from "react";
import axios from "axios";

function ProgressTracking() {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        weight: "",
        height: "",
        notes: "",
    });
    const [formData, setFormData] = useState({
        weight: "",
        height: "",
        notes: "",
    });

    const fetchProgress = async () => {
        try {
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:7000/api/progress/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const records = Array.isArray(response.data)
                ? response.data
                : response.data.progress || response.data.data || [];

            setProgress(records);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Progress data load nahi ho saka."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const weight = Number(formData.weight);
        const height = Number(formData.height);

        if (
            !formData.weight ||
            !formData.height ||
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            weight <= 0 ||
            height <= 0
        ) {
            setError("Please enter a valid weight and height.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:7000/api/progress",
                {
                    weight,
                    height,
                    notes: formData.notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                response.data.message || "Progress saved successfully!"
            );

            setFormData({
                weight: "",
                height: "",
                notes: "",
            });

            await fetchProgress();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Progress save nahi ho saka."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    const startEditing = (item) => {
        setEditingId(item._id);

        setEditData({
            weight: item.weight ?? "",
            height: item.height ?? "",
            notes: item.notes ?? "",
        });

        setError("");
        setSuccess("");
    };

    const cancelEditing = () => {
        setEditingId(null);

        setEditData({
            weight: "",
            height: "",
            notes: "",
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const weight = Number(editData.weight);
        const height = Number(editData.height);

        if (
            !editData.weight ||
            !editData.height ||
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            weight <= 0 ||
            height <= 0
        ) {
            setError("Please enter a valid weight and height.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:7000/api/progress/${editingId}`,
                {
                    weight,
                    height,
                    notes: editData.notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                response.data.message || "Progress updated successfully!"
            );

            cancelEditing();
            await fetchProgress();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Progress update nahi ho saka."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this progress record?"
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `http://localhost:7000/api/progress/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                response.data.message || "Progress deleted successfully!"
            );

            await fetchProgress();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Progress delete nahi ho saka."
            );
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <p className="text-cyan-400 font-bold tracking-widest mb-3">
                        FITZONE FITNESS
                    </p>

                    <h1 className="text-3xl md:text-5xl font-black">
                        My <span className="text-cyan-400">Progress</span>
                    </h1>

                    <p className="text-zinc-400 mt-4">
                        Track your weight and fitness journey.
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-10">
                    <h2 className="text-2xl font-bold mb-6">
                        Add New Progress
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    min="1"
                                    step="0.1"
                                    placeholder="e.g. 65"
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    min="1"
                                    step="0.1"
                                    placeholder="e.g. 175"
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-300 mb-2">
                                Notes (optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Write your fitness notes..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 resize-y"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-cyan-400 text-black font-bold px-7 py-3 rounded-xl hover:bg-cyan-300 transition disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Progress"}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-300 mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-4 text-emerald-300 mb-6">
                        {success}
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-6">
                    Progress History
                </h2>

                {loading ? (
                    <p className="text-cyan-400">Loading progress...</p>
                ) : progress.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                        <div className="text-5xl mb-4">📈</div>
                        <h3 className="text-xl font-bold mb-2">
                            No Progress Records Yet
                        </h3>
                        <p className="text-zinc-400">
                            Add your first progress record using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {progress.map((item) => (
                            <div
                                key={item._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-400 transition"
                            >
                                <p className="text-zinc-400 text-sm mb-2">
                                    Record Date
                                </p>

                                <h3 className="font-bold text-lg mb-6">
                                    {item.recordedAt
                                        ? new Date(item.recordedAt).toLocaleDateString("en-IN")
                                        : item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("en-IN")
                                            : "Date not available"}
                                </h3>

                                {editingId === item._id ? (
                                    <form onSubmit={handleUpdate} className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm text-zinc-300 mb-2">
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={editData.weight}
                                                onChange={handleEditChange}
                                                min="1"
                                                step="0.1"
                                                required
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-zinc-300 mb-2">
                                                Height (cm)
                                            </label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={editData.height}
                                                onChange={handleEditChange}
                                                min="1"
                                                step="0.1"
                                                required
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-zinc-300 mb-2">
                                                Notes
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={editData.notes}
                                                onChange={handleEditChange}
                                                rows="2"
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-cyan-300 disabled:opacity-50"
                                            >
                                                {saving ? "Updating..." : "Save Changes"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => startEditing(item)}
                                        className="w-full mb-6 border border-cyan-400 text-cyan-400 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                                    >
                                        Edit Progress
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    disabled={saving || editingId === item._id}
                                    className="w-full border border-red-500 text-red-400 font-bold px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                >
                                    Delete Progress
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-800 rounded-xl p-4">
                                        <p className="text-zinc-400 text-sm">Weight</p>
                                        <p className="text-2xl font-black text-cyan-400">
                                            {item.weight ?? "--"}
                                            <span className="text-sm ml-1">kg</span>
                                        </p>
                                    </div>

                                    <div className="bg-zinc-800 rounded-xl p-4">
                                        <p className="text-zinc-400 text-sm">BMI</p>
                                        <p className="text-2xl font-black text-cyan-400">
                                            {item.bmi ?? "--"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-zinc-800 rounded-xl p-4 mt-4">
                                    <p className="text-zinc-400 text-sm">Height</p>
                                    <p className="text-lg font-bold">
                                        {item.height ?? "--"} cm
                                    </p>
                                </div>

                                {item.notes && (
                                    <div className="mt-5">
                                        <p className="text-zinc-400 text-sm mb-1">
                                            Notes
                                        </p>
                                        <p className="text-zinc-200">{item.notes}</p>
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

export default ProgressTracking;
