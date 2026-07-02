import { useEffect, useState } from "react";
import api from "../../services/api";

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    examId: "",
    question: "",
    type: "mcq",
    options: "",
    correctAnswer: "",
    marks: 1,
    negativeMarks: 0,
    difficulty: "easy",
    explanation: "",
  });

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    if (form.examId) {
      loadQuestions();
    }
  }, [form.examId]);

  // =========================
  // Load Exams
  // =========================

  const loadExams = async () => {
    try {
      const res = await api.get("/exams");

      setExams(res.data);

      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          examId: res.data[0]._id,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Load Questions
  // =========================

  const loadQuestions = async () => {
    try {
      const res = await api.get(
        `/questions?examId=${form.examId}`
      );

      setQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Edit Question
  // =========================

  const handleEdit = (question) => {
    setEditingId(question._id);

    setForm({
      examId: question.examId || form.examId,
      question: question.question,
      type: question.type,
      options: question.options
        ? question.options.join(" | ")
        : "",
      correctAnswer: question.correctAnswer,
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      difficulty: question.difficulty || "easy",
      explanation: question.explanation || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete Question
  // =========================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await api.delete(`/questions/${id}`);

      loadQuestions();

      alert("Question deleted successfully.");
    } catch (err) {
      console.log(err);
      alert("Failed to delete question.");
    }
  };

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setEditingId(null);

    setForm((prev) => ({
      ...prev,
      question: "",
      options: "",
      correctAnswer: "",
      marks: 1,
      negativeMarks: 0,
      difficulty: "easy",
      explanation: "",
    }));
  };

  // =========================
  // Save / Update Question
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        options:
          form.type === "mcq" ||
          form.type === "multiple-answer"
            ? form.options
                .split("|")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
      };

      if (editingId) {
        await api.put(`/questions/${editingId}`, payload);
        alert("Question updated successfully.");
      } else {
        await api.post("/questions", payload);
        alert("Question created successfully.");
      }

      resetForm();
      loadQuestions();
    } catch (err) {
      console.log(err);
      alert("Failed to save question.");
    }
  };
    return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">
          ❓ Question Management
        </h1>

        <p className="text-gray-700 mt-2">
          Create, update and manage questions.
        </p>
      </div>

      {/* Form Card */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-black">
            {editingId
              ? "✏️ Edit Question"
              : "➕ Create Question"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          {/* Exam */}

          <select
  value={form.examId}
  onChange={(e) =>
    setForm({
      ...form,
      examId: e.target.value,
    })
  }
  className="w-full border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
>
  <option value="" className="text-black">
    Select Exam
  </option>

  {exams.map((exam) => (
    <option
      key={exam._id}
      value={exam._id}
      className="text-black bg-white"
    >
      {exam.examName}
    </option>
  ))}
</select>

          {/* Question Type */}

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
            className="border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="mcq">MCQ</option>
            <option value="multiple-answer">
              Multiple Answer
            </option>
            <option value="true-false">
              True / False
            </option>
            <option value="short-answer">
              Short Answer
            </option>
          </select>

          {/* Question */}

          <textarea
            rows={4}
            placeholder="Enter Question"
            value={form.question}
            onChange={(e) =>
              setForm({
                ...form,
                question: e.target.value,
              })
            }
            className="md:col-span-2 border border-gray-300 bg-white text-black placeholder:text-gray-500 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Options */}

          {(form.type === "mcq" ||
            form.type === "multiple-answer") && (
            <input
              type="text"
              placeholder="Option1 | Option2 | Option3 | Option4"
              value={form.options}
              onChange={(e) =>
                setForm({
                  ...form,
                  options: e.target.value,
                })
              }
              className="md:col-span-2 border border-gray-300 bg-white text-black placeholder:text-gray-500 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {/* Correct Answer */}

          <input
            type="text"
            placeholder="Correct Answer"
            value={form.correctAnswer}
            onChange={(e) =>
              setForm({
                ...form,
                correctAnswer: e.target.value,
              })
            }
            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Marks */}

          <input
            type="number"
            placeholder="Marks"
            value={form.marks}
            onChange={(e) =>
              setForm({
                ...form,
                marks: Number(e.target.value),
              })
            }
            className="border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Negative Marks */}

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
            className="border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Difficulty */}

          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
            className="border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Explanation */}

          <textarea
            rows={3}
            placeholder="Explanation"
            value={form.explanation}
            onChange={(e) =>
              setForm({
                ...form,
                explanation: e.target.value,
              })
            }
            className="md:col-span-2 border border-gray-300 bg-white text-black placeholder:text-gray-500 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="md:col-span-2 flex justify-end gap-4">

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              {editingId ? "Update Question" : "Create Question"}
            </button>

          </div>

        </form>

      </div>
            {/* Questions List */}

      <div className="mt-8">

        <h2 className="text-2xl font-bold text-black mb-6">
          📚 Questions
        </h2>

        {questions.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
            No Questions Found.
          </div>

        ) : (

          <div className="space-y-5">

            {questions.map((q, index) => (

              <div
                key={q._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              >

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                  {/* Question Details */}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-black">
                      Q{index + 1}. {q.question}
                    </h3>

                    {q.options?.length > 0 && (

                      <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">

                        {q.options.map((option, i) => (

                          <li key={i}>
                            {option}
                          </li>

                        ))}

                      </ul>

                    )}

                    <div className="flex flex-wrap gap-4 mt-5">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        ✅ {q.correctAnswer}
                      </span>

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        🎯 {q.marks} Marks
                      </span>

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        ❌ -{q.negativeMarks}
                      </span>

                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm capitalize">
                        {q.difficulty}
                      </span>

                    </div>

                    {q.explanation && (

                      <div className="mt-5 p-4 rounded-xl bg-gray-100">

                        <p className="text-gray-700">
                          <strong>Explanation :</strong>
                        </p>

                        <p className="mt-2 text-gray-600">
                          {q.explanation}
                        </p>

                      </div>

                    )}

                  </div>

                  {/* Actions */}

                  <div className="flex flex-col gap-3 w-full lg:w-44">

                    <span className="bg-blue-600 text-white text-center py-2 rounded-lg capitalize">
                      {q.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEdit(q)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
          </div>
  );
}