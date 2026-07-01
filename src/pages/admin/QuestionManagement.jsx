import { useEffect, useState } from "react";
import api from "../../services/api";

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
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
    api.get("/exams").then((res) => {
      if (res.data[0]) {
        setForm((prev) => ({
          ...prev,
          examId: res.data[0]._id,
        }));
      }
    });
  }, []);

  const loadQuestions = async () => {
    if (!form.examId) return;
    const res = await api.get(`/questions?examId=${form.examId}`);
    setQuestions(res.data);
  };

  useEffect(() => {
    loadQuestions();
  }, [form.examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/questions", {
      ...form,
      options: form.options.split("|"),
    });

    setForm((prev) => ({
      ...prev,
      question: "",
      options: "",
      correctAnswer: "",
      explanation: "",
    }));

    loadQuestions();
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          ❓ Question Management
        </h1>
        <p className="text-gray-500 mt-2">
          Add and manage exam questions.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Create Question
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <textarea
            rows="3"
            placeholder="Enter Question"
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
            className="md:col-span-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="mcq">MCQ</option>
            <option value="multiple-answer">Multiple Answer</option>
            <option value="true-false">True / False</option>
            <option value="short-answer">Short Answer</option>
          </select>

          <input
            placeholder="Options (Option1|Option2|Option3)"
            value={form.options}
            onChange={(e) =>
              setForm({ ...form, options: e.target.value })
            }
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            placeholder="Correct Answer"
            value={form.correctAnswer}
            onChange={(e) =>
              setForm({
                ...form,
                correctAnswer: e.target.value,
              })
            }
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

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
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            placeholder="Explanation"
            value={form.explanation}
            onChange={(e) =>
              setForm({
                ...form,
                explanation: e.target.value,
              })
            }
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            ➕ Save Question
          </button>

        </form>

      </div>

      {/* Question List */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          📋 Question List
        </h2>

        {questions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No questions found.
          </div>
        ) : (
          <div className="space-y-4">

            {questions.map((q, index) => (
              <div
                key={q._id}
                className="border rounded-2xl p-5 hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">
                      Q{index + 1}. {q.question}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Marks : {q.marks} | Negative : {q.negativeMarks}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium capitalize">
                    {q.type}
                  </span>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}