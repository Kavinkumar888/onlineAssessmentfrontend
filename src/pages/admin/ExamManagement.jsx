import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ExamManagement() {
  const [exams, setExams] = useState([]);

  const [form, setForm] = useState({
    examName: "",
    subject: "",
    department: "",
    year: "",
    duration: 60,
    instructions: "",
    startTime: "",
    endTime: "",
    passingMarks: 40,
    negativeMarks: 0,
    status: "draft",
  });

  const loadExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/exams", form);

      setForm({
        examName: "",
        subject: "",
        department: "",
        year: "",
        duration: 60,
        instructions: "",
        startTime: "",
        endTime: "",
        passingMarks: 40,
        negativeMarks: 0,
        status: "draft",
      });

      loadExams();
      alert("Exam Created Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create exam");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          📝 Exam Management
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage online examinations.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          ➕ Create New Exam
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >
                    <input
            type="text"
            placeholder="Exam Name"
            value={form.examName}
            onChange={(e) =>
              setForm({ ...form, examName: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Year"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="number"
            placeholder="Duration (Minutes)"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="number"
            placeholder="Passing Marks"
            value={form.passingMarks}
            onChange={(e) =>
              setForm({
                ...form,
                passingMarks: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="number"
            placeholder="Negative Marks"
            value={form.negativeMarks}
            onChange={(e) =>
              setForm({
                ...form,
                negativeMarks: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Instructions"
            value={form.instructions}
            onChange={(e) =>
              setForm({
                ...form,
                instructions: e.target.value,
              })
            }
            className="md:col-span-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            ➕ Create Exam
          </button>

        </form>

      </div>
            {/* Exam List */}

      <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            📋 Exam List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr className="text-slate-700">

                <th className="px-6 py-4 text-left">Exam</th>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-left">Year</th>
                <th className="px-6 py-4 text-left">Duration</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-left">Start Time</th>
                <th className="px-6 py-4 text-left">End Time</th>

              </tr>

            </thead>

            <tbody>

              {exams.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="py-10 text-center text-gray-500"
                  >
                    No Exams Found
                  </td>

                </tr>

              ) : (

                exams.map((exam) => (

                  <tr
                    key={exam._id}
                    className="border-b hover:bg-slate-50 transition duration-300"
                  >

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {exam.examName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.subject}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.department}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.year}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.duration} Minutes
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          exam.status === "active"
                            ? "bg-green-100 text-green-700"
                            : exam.status === "completed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {exam.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.startTime
                        ? new Date(exam.startTime).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {exam.endTime
                        ? new Date(exam.endTime).toLocaleString()
                        : "-"}
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