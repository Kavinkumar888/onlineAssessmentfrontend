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

  useEffect(() => {
    Promise.all([
      api.get(`/exams/${examId}`),
      api.get(`/questions?examId=${examId}`),
    ]).then(([examRes, questionRes]) => {
      setExam(examRes.data);
      setQuestions(questionRes.data);
      setTimeLeft((examRes.data?.duration || 60) * 60);
    });
  }, [examId]);

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

  const submitExam = async () => {
    const payload = {
      exam: examId,
      answers: Object.values(answers),
      correctAnswers: 0,
      wrongAnswers: 0,
      skippedQuestions: questions.length - Object.keys(answers).length,
      marks: 0,
      percentage: 0,
      timeTaken: exam?.duration * 60 - timeLeft,
      status: "passed",
    };

    await api.post("/exams/submit", payload);
    navigate("/student/results");
  };

  const question = questions[currentIndex];

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return Math.round(
      (Object.keys(answers).length / questions.length) * 100
    );
  }, [answers, questions]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-100 text-black flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-black">
            Loading Exam...
          </h2>
        </div>
      </div>
    );
  }

  if (!instructionsAccepted) {
    return (
      <div className="min-h-screen bg-slate-100 text-black flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">

          <h2 className="text-3xl font-bold text-black mb-6">
            📋 Exam Instructions
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">

            <p className="leading-8 text-black">
              {exam.instructions ||
                "Please read all instructions carefully before starting the examination."}
            </p>

          </div>

          <div className="mt-8 flex items-center gap-3">

            <input
              type="checkbox"
              checked={instructionsAccepted}
              onChange={() => setInstructionsAccepted(true)}
              className="w-5 h-5"
            />

            <span className="text-black font-medium">
              I have read all the instructions.
            </span>

          </div>

          <button
            onClick={() => setInstructionsAccepted(true)}
            className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Start Exam
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-black">

      {/* Header */}

      <div className="bg-blue-700 text-white shadow-lg px-8 py-5 flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            {exam.examName}
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

          <div>
            Progress : {progress}%
          </div>

        </div>

      </div>
            <div className="grid lg:grid-cols-4 gap-6 p-6">

        {/* Left Side */}

        <div className="bg-white rounded-2xl shadow-lg p-5">

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

          <button
            onClick={submitExam}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Exam
          </button>

        </div>

        {/* Right Side */}

        <div className="lg:col-span-3">

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-2xl font-bold text-black">
                Question {currentIndex + 1}
              </h3>

              <span className="text-black font-medium">
                {questions.length} Questions
              </span>

            </div>

            {/* Progress Bar */}

            <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">

              <div
                className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            {/* Question */}

            <h2 className="text-2xl font-semibold text-black mb-8 leading-relaxed">

              {question?.question}

            </h2>

            {/* Options */}

            <div className="space-y-4">

              {question?.options?.map((option, index) => (

                <label
                  key={index}
                  className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    answers[question._id] === option
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50 hover:border-blue-400"
                  }`}
                >

                  <input
                    type="radio"
                    name={question._id}
                    checked={answers[question._id] === option}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [question._id]: option,
                      })
                    }
                    className="w-5 h-5 accent-blue-600"
                  />

                  <span className="text-lg text-black font-medium">
                    {option}
                  </span>

                </label>

              ))}

            </div>
                        {/* Navigation */}

            <div className="flex justify-between items-center mt-10">

              <button
                disabled={currentIndex === 0}
                onClick={() =>
                  setCurrentIndex(Math.max(0, currentIndex - 1))
                }
                className="px-8 py-3 rounded-lg font-semibold bg-gray-300 text-black hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>

              <button
                onClick={() =>
                  setCurrentIndex(
                    Math.min(
                      questions.length - 1,
                      currentIndex + 1
                    )
                  )
                }
                className="px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                {currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next →"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}