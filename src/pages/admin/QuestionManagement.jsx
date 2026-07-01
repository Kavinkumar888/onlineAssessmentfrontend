import { useEffect, useState } from "react";
import api from "../../services/api";

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);

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

  const loadQuestions = async () => {
    try {
      const res = await api.get(`/questions?examId=${form.examId}`);
      setQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/questions", {
        ...form,
        options:
          form.type === "mcq" || form.type === "multiple-answer"
            ? form.options.split("|")
            : [],
      });

      setForm((prev) => ({
        ...prev,
        question: "",
        options: "",
        correctAnswer: "",
        explanation: "",
      }));

      loadQuestions();
    } catch (err) {
      console.log(err);
      alert("Failed to save question");
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
          Create, manage and organize questions for your exams.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-black mb-6">
          Create Question
        </h2>

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
            className="border border-gray-300 bg-white text-black rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
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
            <option value="multiple-answer">Multiple Answer</option>
            <option value="true-false">True / False</option>
            <option value="short-answer">Short Answer</option>
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
          <input
            type="text"
            placeholder="Explanation"
            value={form.explanation}
            onChange={(e) =>
              setForm({
                ...form,
                explanation: e.target.value,
              })
            }
            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300"
          >
            ➕ Save Question
          </button>

        </form>
      </div>

      {/* Question List */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold text-black mb-6">
          📋 Question List
        </h2>

        {questions.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No questions available.
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((q, index) => (
              <div
                key={q._id}
                className="border border-gray-200 rounded-2xl p-5 hover:bg-blue-50 transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">
                      Q{index + 1}. {q.question}
                    </h3>

                    {q.options?.length > 0 && (
                      <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
                      <span>
                        <strong>Answer:</strong> {q.correctAnswer}
                      </span>

                      <span>
                        <strong>Marks:</strong> {q.marks}
                      </span>

                      <span>
                        <strong>Negative:</strong> {q.negativeMarks}
                      </span>

                      <span>
                        <strong>Difficulty:</strong> {q.difficulty}
                      </span>
                    </div>

                    {q.explanation && (
                      <p className="mt-3 text-gray-600">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium capitalize">
                      {q.type}
                    </span>
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