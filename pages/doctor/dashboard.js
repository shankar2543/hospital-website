import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DoctorDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "doctor") router.push("/");
    setEmail(localStorage.getItem("email") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const appointments = [
    { id: 1, patient: "John Smith", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patient: "Sarah Connor", time: "10:30 AM", status: "Pending" },
    { id: 3, patient: "Mike Johnson", time: "12:00 PM", status: "Confirmed" },
    { id: 4, patient: "Emily Davis", time: "02:00 PM", status: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">🏥 Hospital Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">👨‍⚕️ {email}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Doctor Dashboard</h2>
        <p className="text-gray-500 mb-8">Welcome back, Doctor</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Today&apos;s Appointments</p>
            <p className="text-4xl font-bold text-green-600 mt-1">4</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Patients</p>
            <p className="text-4xl font-bold text-blue-600 mt-1">38</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending Reviews</p>
            <p className="text-4xl font-bold text-yellow-600 mt-1">5</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Today&apos;s Appointments</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="pb-3">#</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{a.id}</td>
                  <td className="py-3 font-medium text-gray-700">{a.patient}</td>
                  <td className="py-3 text-gray-500">{a.time}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        a.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : a.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
