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
    const res = await api.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  };

  const toggleStatus = async (id) => {
    await api.patch(`/students/${id}/toggle-status`);
    loadStudents();
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          👨‍🎓 Student Management
        </h1>
        <p className="text-gray-500 mt-2">
          Create and manage student accounts.
        </p>
      </div>

      {/* Create Student */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Add New Student
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Student Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Register Number"
            value={form.registerNumber}
            onChange={(e) =>
              setForm({
                ...form,
                registerNumber: e.target.value,
              })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Year"
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value,
              })
            }
          />

          <input
            type="email"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300"
          >
            ➕ Save Student
          </button>

        </form>

      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-bold text-blue-700">
            📋 Student List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">

              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Register No</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>

            </thead>

            <tbody>

              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="px-6 py-4 font-medium">
                      {student.name}
                    </td>

                    <td className="px-6 py-4">
                      {student.registerNumber}
                    </td>

                    <td className="px-6 py-4">
                      {student.department}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                        onClick={() =>
                          toggleStatus(student._id)
                        }
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${
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