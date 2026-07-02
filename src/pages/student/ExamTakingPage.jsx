import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function ExamTakingPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // ==========================
  // Load Exam + Questions
  // ==========================

  useEffect(() => {
    const loadExam = async () => {
      try {
        // Check Already Attempted
        const check = await api.get(`/exams/check/${examId}`);

        if (check.data.alreadySubmitted) {
          alert("You have already attended this exam.");
          navigate("/student/results");
          return;
        }

        const [examRes, questionRes] = await Promise.all([
          api.get(`/exams/${examId}`),
          api.get(`/questions?examId=${examId}`),
        ]);

        setExam(examRes.data);
        setQuestions(questionRes.data);

        setTimeLeft((examRes.data?.duration || 60) * 60);
      } catch (err) {
        console.log(err);
        alert("Unable to load exam.");
      }
    };

    loadExam();
  }, [examId, navigate]);

  // ==========================
  // Timer
  // ==========================

  useEffect(() => {
    if (!instructionsAccepted || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [instructionsAccepted, exam]);

  // ==========================
  // Submit Exam
  // ==========================

  const submitExam = async () => {
    try {
      const payload = {
        exam: examId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question: questionId,
          answer,
        })),
        timeTaken: (exam?.duration || 0) * 60 - timeLeft,
      };

      await api.post("/exams/submit", payload);

      alert("Exam submitted successfully.");

      navigate("/student/results");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 400) {
        alert("You have already attended this exam.");
        navigate("/student/results");
      } else {
        alert("Failed to submit exam.");
      }
    }
  };

  // ==========================
  // Current Question
  // ==========================

  const question = questions[currentIndex];

  // ==========================
  // Progress
  // ==========================

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return Math.round(
      (Object.keys(answers).length / questions.length) * 100
    );
  }, [answers, questions]);
    // ==========================
  // Loading
  // ==========================

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-black">
            Loading Exam...
          </h2>

          <p className="text-gray-600 mt-2">
            Please wait while we load your exam.
          </p>
        </div>
      </div>
    );
  }

  // ==========================
  // Instructions
  // ==========================

  if (!instructionsAccepted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-8">

          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            📋 Exam Instructions
          </h1>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-5">

            <p className="text-gray-700 leading-8">
              {exam.instructions ||
                "Read all questions carefully before answering. Do not refresh the page during the examination. The exam will be submitted automatically when the timer reaches zero."}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <h3 className="text-xl font-bold text-black">
                {exam.duration} Minutes
              </h3>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Questions
              </p>

              <h3 className="text-xl font-bold text-black">
                {questions.length}
              </h3>
            </div>

          </div>

          <label className="flex items-center gap-3 mt-8 cursor-pointer">

            <input
              type="checkbox"
              checked={instructionsAccepted}
              onChange={() => setInstructionsAccepted(true)}
              className="w-5 h-5"
            />

            <span className="text-black font-medium">
              I have read and understood all the instructions.
            </span>

          </label>

          <button
            onClick={() => setInstructionsAccepted(true)}
            className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            Start Exam
          </button>

        </div>

      </div>
    );
  }

  // ==========================
  // Main UI
  // ==========================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <div className="bg-blue-700 text-white shadow-lg px-8 py-5 flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            {exam.title || exam.examName}
          </h2>

          <p className="text-blue-100">
            Online Assessment Portal
          </p>

        </div>

        <div className="text-right">

          <div className="text-2xl font-bold">
            ⏰ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>

          <div className="text-sm">
            Progress : {progress}%
          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-4 gap-6 p-6">
              {/* Left Sidebar */}

      <div className="bg-white rounded-2xl shadow-lg p-5 h-fit">

        <h3 className="text-xl font-bold text-black mb-5">
          Questions
        </h3>

        <div className="grid grid-cols-5 gap-3">

          {questions.map((q, i) => (

            <button
              key={q._id}
              onClick={() => setCurrentIndex(i)}
              className={`h-11 rounded-lg font-semibold transition-all duration-200 ${
                answers[q._id]
                  ? "bg-green-500 text-white"
                  : currentIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>

          ))}

        </div>

        <div className="mt-8 space-y-4">

          <div className="bg-gray-100 rounded-xl p-4">

            <div className="flex justify-between text-sm text-gray-600">

              <span>Answered</span>

              <span>
                {Object.keys(answers).length}/{questions.length}
              </span>

            </div>

            <div className="w-full bg-gray-300 h-2 rounded-full mt-3">

              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <button
            onClick={submitExam}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Submit Exam
          </button>

        </div>

      </div>

      {/* Right Side */}

      <div className="lg:col-span-3">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-2xl font-bold text-black">
              Question {currentIndex + 1}
            </h2>

            <span className="text-gray-600">
              {questions.length} Questions
            </span>

          </div>

          {/* Progress */}

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-8">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          {/* Question */}

          <h3 className="text-2xl font-semibold text-black leading-relaxed mb-8">
            {question?.question}
          </h3>

          {/* Options */}

          <div className="space-y-4"></div>

            {question?.options?.map((option, index) => (

              <label
                key={index}
                className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition ${
                  answers[question._id] === option
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >

                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question._id]: option,
                    }))
                  }
                  className="w-5 h-5 accent-blue-600"
                />

                <span className="text-lg text-black">
                  {option}
                </span>

              </label>

            ))}
                      </div>

          {/* Navigation */}

          <div className="flex justify-between items-center mt-10">

            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex((prev) => Math.max(prev - 1, 0))
              }
              className="px-8 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentIndex === questions.length - 1) {
                  submitExam();
                } else {
                  setCurrentIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  );
                }
              }}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              {currentIndex === questions.length - 1
                ? "Finish & Submit"
                : "Next →"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}