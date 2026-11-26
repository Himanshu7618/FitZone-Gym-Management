
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://fitzone-gym-management-gyax.onrender.com/api/attendance";

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [membersRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/members`, config),
        axios.get(`${API}/today`, config),
      ]);

      setMembers(membersRes.data.members || []);
      setAttendance(attendanceRes.data.attendance || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAttendance = async (userId, status) => {
    try {
      setSavingId(userId);
      setMessage("");
      setError("");

      const response = await axios.post(
        `${API}/admin-mark`,
        { userId, status },
        config
      );

      setMessage(response.data.message);
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to mark attendance"
      );
    } finally {
      setSavingId("");
    }
  };

  const getMemberAttendance = (userId) => {
    return attendance.find(
      (item) => item.user?._id === userId
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-600">
        Loading Attendance...
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Management
        </h1>
        <p className="mt-2 text-gray-500">
          Manage member attendance and check-in records.
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Members Attendance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Email</th>
                <th className="p-3">Today's Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => {
                const record = getMemberAttendance(member._id);

                return (
                  <tr key={member._id} className="border-b">
                    <td className="p-3 font-medium text-gray-800">
                      {member.name}
                    </td>

                    <td className="p-3 text-gray-600">
                      {member.email}
                    </td>

                    <td className="p-3">
                      {record ? (
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Not Marked
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {!record ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              markAttendance(member._id, "present")
                            }
                            disabled={savingId === member._id}
                            className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Present
                          </button>

                          <button
                            onClick={() =>
                              markAttendance(member._id, "absent")
                            }
                            disabled={savingId === member._id}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Absent
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Already Marked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-5 text-center text-gray-500">
                    No active members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Today's Attendance Records
        </h2>

        <div className="space-y-3">
          {attendance.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {item.user?.name || "Unknown Member"}
                </p>

                <p className="text-sm text-gray-500">
                  {item.user?.email}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  item.status === "present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status.toUpperCase()}
              </span>

              <p className="text-sm text-gray-500">
                Check-in:{" "}
                {item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString()
                  : "N/A"}
              </p>
            </div>
          ))}

          {attendance.length === 0 && (
            <p className="text-center text-gray-500">
              No attendance records for today.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Attendance;
