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
    const res = await api.get("/exams");
    setExams(res.data);
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          📝 Exam Management
        </h1>
        <p className="text-gray-500 mt-2">
          Create and manage online examinations.
        </p>
      </div>

      {/* Create Exam */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-blue-700">
          Create New Exam
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Exam Name"
            value={form.examName}
            onChange={(e) =>
              setForm({ ...form, examName: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Year"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
          />

          <input
            type="number"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Duration"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Passing Marks"
            value={form.passingMarks}
            onChange={(e) =>
              setForm({
                ...form,
                passingMarks: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Negative Marks"
            value={form.negativeMarks}
            onChange={(e) =>
              setForm({
                ...form,
                negativeMarks: Number(e.target.value),
              })
            }
          />

          <select
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="datetime-local"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
          />

          <textarea
            rows="4"
            className="border rounded-xl p-3 md:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Instructions"
            value={form.instructions}
            onChange={(e) =>
              setForm({
                ...form,
                instructions: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            ➕ Create Exam
          </button>

        </form>

      </div>

      {/* Exam List */}
      <div className="bg-white rounded-3xl shadow-xl p-8 overflow-x-auto">

        <h2 className="text-2xl font-bold mb-6 text-blue-700">
          📋 Exam List
        </h2>

        <table className="w-full">

          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4 text-left">Exam</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Duration</th>
            </tr>
          </thead>

          <tbody>

            {exams.map((exam) => (
              <tr
                key={exam._id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="p-4 font-medium">
                  {exam.examName}
                </td>

                <td className="p-4">
                  {exam.subject}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

                <td className="p-4">
                  {exam.duration} min
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}