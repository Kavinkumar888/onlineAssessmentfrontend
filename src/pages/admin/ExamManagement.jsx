import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);

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
  };

  const handleEdit = (exam) => {
    setEditingId(exam._id);

    setForm({
      examName: exam.examName,
      subject: exam.subject,
      department: exam.department,
      year: exam.year,
      duration: exam.duration,
      instructions: exam.instructions || "",
      startTime: exam.startTime
        ? exam.startTime.slice(0, 16)
        : "",
      endTime: exam.endTime
        ? exam.endTime.slice(0, 16)
        : "",
      passingMarks: exam.passingMarks,
      negativeMarks: exam.negativeMarks,
      status: exam.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await api.delete(`/exams/${id}`);
      alert("Exam Deleted Successfully");
      loadExams();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/exams/${editingId}`, form);
        alert("Exam Updated Successfully");
      } else {
        await api.post("/exams", form);
        alert("Exam Created Successfully");
      }

      resetForm();
      loadExams();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Operation Failed");
    }
  };

  return (
        <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            📝 Exam Management
          </h1>

          <p className="text-gray-500 mt-2">
            Create, Update and Manage Online Exams
          </p>
        </div>

      </div>

      {/* Form Card */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-blue-700">
            {editingId ? "✏️ Update Exam" : "➕ Create New Exam"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            placeholder="Exam Name (Example: Java Mid Semester Exam)"
            value={form.examName}
            onChange={(e) =>
              setForm({
                ...form,
                examName: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl p-3 bg-white text-black"
          />

          <input
            type="text"
            placeholder="Subject (Example: Java Programming)"
            value={form.subject}
            onChange={(e) =>
              setForm({
                ...form,
                subject: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl p-3 bg-white text-black"
          />

          <input
            type="text"
            placeholder="Department (Example: CSE)"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl p-3 bg-white text-black"
          />

          <input
            type="text"
            placeholder="Year (Example: III Year)"
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl p-3 bg-white text-black"
          />
             <div className="flex flex-col">
  <label className="text-sm font-semibold text-gray-700 mb-2">
    Duration
  </label>

  <input
    type="number"
    placeholder="Enter exam duration in minutes (Example: 60)"
    value={form.duration}
    onChange={(e) =>
      setForm({
        ...form,
        duration: Number(e.target.value),
      })
    }
    className="border border-gray-300 rounded-xl p-3 bg-white text-black"
  />

  <p className="text-xs text-gray-500 mt-1">
    Total time allotted for the exam.
  </p>
</div>
           <div className="flex flex-col">
  <label className="text-sm font-semibold text-gray-700 mb-2">
    Passing Marks
  </label>

  <input
    type="number"
    placeholder="Example: 40"
    value={form.passingMarks}
    onChange={(e) =>
      setForm({
        ...form,
        passingMarks: Number(e.target.value),
      })
    }
    className="border border-gray-300 rounded-xl p-3 bg-white text-black"
  />

  <p className="text-xs text-gray-500 mt-1">
    Minimum marks required for a student to pass.
  </p>
</div>
          <div className="flex flex-col">
  <label className="text-sm font-semibold text-gray-700 mb-2">
    Negative Marks
  </label>

  <input
    type="number"
    step="0.25"
    placeholder="Example: 0.25"
    value={form.negativeMarks}
    onChange={(e) =>
      setForm({
        ...form,
        negativeMarks: Number(e.target.value),
      })
    }
    className="border border-gray-300 rounded-xl p-3 bg-white text-black"
  />

  <p className="text-xs text-gray-500 mt-1">
    Marks deducted for each incorrect answer.
  </p>
</div>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="border border-gray-100 rounded-xl p-1 bg-white text-black"
          >
            <option value="draft">Draft</option>
            <option value="active">Active (Visible to Students)</option>
            <option value="completed">Completed</option>
          </select>
                    <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
            className="border border-gray-100 rounded-xl p-1 bg-white text-black"
          />

          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl p-3 bg-white text-black"
          />

          <textarea
            rows={5}
            placeholder="Instructions shown to students before the exam starts..."
            value={form.instructions}
            onChange={(e) =>
              setForm({
                ...form,
                instructions: e.target.value,
              })
            }
            className="md:col-span-2 border border-gray-300 rounded-xl p-3 bg-white text-black"
          />

          <div className="md:col-span-2 grid grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4">

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold text-blue-700">
                Passing Marks
              </h4>

              <p className="text-sm text-gray-600 mt-2">
                Students scoring equal to or above this mark will pass the exam.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold text-red-600">
                Negative Marks
              </h4>

              <p className="text-sm text-gray-600 mt-2">
                Marks deducted for every incorrect answer.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold text-green-600">
                Active Status
              </h4>

              <p className="text-sm text-gray-600 mt-2">
                Only exams marked <strong>Active</strong> will be visible to students.
              </p>
            </div>

          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-2">

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {editingId
                ? "💾 Update Exam"
                : "➕ Create Exam"}
            </button>

          </div>

        </form>

      </div>

      {/* ==============================
          Exam List
      ============================== */}

      <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5">

          <h2 className="text-2xl font-bold text-white">
            📋 Exam List
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100 text-black">

              <tr>

                <th className="px-5 py-4 text-left">Exam</th>
                <th className="px-5 py-4 text-left">Subject</th>
                <th className="px-5 py-4 text-left">Department</th>
                <th className="px-5 py-4 text-left">Year</th>
                <th className="px-5 py-4 text-left">Duration</th>
                <th className="px-5 py-4 text-center">Passing</th>
                <th className="px-5 py-4 text-center">Negative</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>
                            {exams.length === 0 ? (

                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-gray-500"
                  >
                    No Exams Available
                  </td>
                </tr>

              ) : (

                exams.map((exam) => (

                  <tr
                    key={exam._id}
                    className="border-b hover:bg-slate-50 transition-all"
                  >

                    {/* Exam */}

                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {exam.examName}
                    </td>

                    {/* Subject */}

                   <td className="px-5 py-4 text-black">
                   {exam.subject}
                  </td>

                    {/* Department */}

                    <td className="px-5 py-4 text-black">
                   {exam.department}
                   </td>

                    {/* Year */}

                   <td className="px-5 py-4 text-black">
                      {exam.year}
                    </td>

                    {/* Duration */}

                    <td className="px-5 py-4 text-black">
                   {exam.duration} Min
                   </td>

                    {/* Passing */}

                    <td className="px-5 py-4 text-center text-black">
                   {exam.passingMarks}
                    </td>

                    {/* Negative */}

                    <td className="px-5 py-4 text-center text-black">
                    {exam.negativeMarks}
                         </td>

                    {/* Status */}

                    <td className="px-5 py-4 text-center">

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

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(exam)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(exam._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          🗑 Delete
                        </button>

                      </div>

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