
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:7000/api/trainers";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  specialization: "",
  experience: 0,
  salary: 0,
  status: "active",
  bio: "",
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API, {
        headers: getHeaders(),
      });
      setTrainers(response.data.trainers || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load trainers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        const { password, ...updateData } = form;

        await axios.put(`${API}/${editingId}`, updateData, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(API, form, {
          headers: getHeaders(),
        });
      }

      resetForm();
      await fetchTrainers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (trainer) => {
    setEditingId(trainer._id);
    setForm({
      name: trainer.user?.name || "",
      email: trainer.user?.email || "",
      phone: trainer.user?.phone || "",
      password: "",
      specialization: trainer.specialization || "",
      experience: trainer.experience ?? 0,
      salary: trainer.salary ?? 0,
      status: trainer.status || "active",
      bio: trainer.bio || "",
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure? This will also delete the trainer's login account."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: getHeaders(),
      });
      await fetchTrainers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete trainer"
      );
    }
  };

  const filteredTrainers = trainers.filter((trainer) => {
    const name = trainer.user?.name || "";
    const email = trainer.user?.email || "";
    const specialization = trainer.specialization || "";

    return `${name} ${email} ${specialization}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Trainer Management
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your gym trainers.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          + Add Trainer
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total Trainers</p>
          <h2 className="mt-2 text-2xl font-bold">{trainers.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Active Trainers</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {trainers.filter((t) => t.status === "active").length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Inactive Trainers</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {trainers.filter((t) => t.status === "inactive").length}
          </h2>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold">
            {editingId ? "Edit Trainer" : "Add New Trainer"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", required: true },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  required: !editingId,
                },
                {
                  name: "specialization",
                  label: "Specialization",
                  required: true,
                },
                {
                  name: "experience",
                  label: "Experience (Years)",
                  type: "number",
                },
                {
                  name: "salary",
                  label: "Salary",
                  type: "number",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    min={
                      ["experience", "salary"].includes(field.name)
                        ? 0
                        : undefined
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Enter trainer details..."
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Trainer"
                    : "Save Trainer"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or specialization..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        {loading ? (
          <p className="p-8 text-center text-gray-500">
            Loading trainers...
          </p>
        ) : filteredTrainers.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No trainers found.
          </p>
        ) : (
          <table className="w-full min-w-800px text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4">Trainer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrainers.map((trainer) => (
                <tr key={trainer._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">
                      {trainer.user?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trainer.user?.email || ""}
                    </p>
                  </td>

                  <td className="p-4">{trainer.user?.phone || "N/A"}</td>
                  <td className="p-4">{trainer.specialization}</td>
                  <td className="p-4">{trainer.experience} years</td>
                  <td className="p-4">₹{trainer.salary}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        trainer.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trainer.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(trainer)}
                        className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(trainer._id)}
                        className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Trainers;
