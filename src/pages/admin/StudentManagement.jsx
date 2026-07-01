import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/students", form);

      setForm({
        name: "",
        registerNumber: "",
        department: "",
        year: "",
        email: "",
        phone: "",
        password: "",
      });

      loadStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create student");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/students/${id}/toggle-status`);
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          👨‍🎓 Student Management
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage student accounts easily.
        </p>
      </div>

      {/* Add Student Card */}

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          ➕ Add New Student
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            placeholder="Student Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Register Number"
            value={form.registerNumber}
            onChange={(e) =>
              setForm({
                ...form,
                registerNumber: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Year"
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="md:col-span-2 w-full rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="md:col-span-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Save Student
          </button>

        </form>

      </div>
            {/* Student List */}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            📋 Student List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr className="text-slate-700">

                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Register No</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-left">Year</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {students.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="py-10 text-center text-gray-500"
                  >
                    No Students Found
                  </td>

                </tr>

              ) : (

                students.map((student) => (

                  <tr
                    key={student._id}
                    className="border-b hover:bg-slate-50 transition duration-300"
                  >

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {student.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.registerNumber}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.department}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.year}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.phone}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {student.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                      <button
                        onClick={() => toggleStatus(student._id)}
                        className={`px-5 py-2 rounded-lg text-white font-medium transition duration-300 ${
                          student.status === "active"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {student.status === "active"
                          ? "Disable"
                          : "Enable"}
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}