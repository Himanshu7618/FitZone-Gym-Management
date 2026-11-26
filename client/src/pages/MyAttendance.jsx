
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:7000/api/attendance";

function MyAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const today = new Date().toDateString();

    const todayAttendance = attendance.find(
        (item) => new Date(item.date).toDateString() === today
    );

    const fetchAttendance = async () => {
        try {
            const response = await axios.get(`${API}/my`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAttendance(response.data.attendance || []);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const checkIn = async () => {
        try {
            await axios.post(
                `${API}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Check-in successful!");
            fetchAttendance();
        } catch (error) {
            alert(error.response?.data?.message || "Check-in failed");
        }
    };

    const checkOut = async (id) => {
        try {
            await axios.put(
                `${API}/${id}/checkout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Check-out successful!");
            fetchAttendance();
        } catch (error) {
            alert(error.response?.data?.message || "Check-out failed");
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Loading attendance...</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Attendance</h1>

                <div className="bg-zinc-900 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Today's Attendance
                    </h2>

                    {!todayAttendance ? (
                        <button
                            onClick={checkIn}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-lg"
                        >
                            Check In
                        </button>
                    ) : todayAttendance.checkIn && !todayAttendance.checkOut ? (
                        <p className="text-green-400 font-semibold">
                            You are checked in. Don't forget to check out!
                        </p>
                    ) : (
                        <p className="text-cyan-400 font-semibold">
                            Today's attendance is completed.
                        </p>
                    )}
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-5">
                        Attendance History
                    </h2>

                    {attendance.length === 0 ? (
                        <p className="text-zinc-400">No attendance records found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-700 text-zinc-400">
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Check In</th>
                                        <th className="p-3">Check Out</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {attendance.map((item) => (
                                        <tr key={item._id} className="border-b border-zinc-800">
                                            <td className="p-3">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>

                                            <td className="p-3">
                                                {item.checkIn
                                                    ? new Date(item.checkIn).toLocaleTimeString()
                                                    : "-"}
                                            </td>

                                            <td className="p-3">
                                                {item.checkOut
                                                    ? new Date(item.checkOut).toLocaleTimeString()
                                                    : "-"}
                                            </td>

                                            <td className="p-3 capitalize">{item.status}</td>

                                            <td className="p-3">
                                                {item.checkIn && !item.checkOut && (
                                                    <button
                                                        onClick={() => checkOut(item._id)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Check Out
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyAttendance;
