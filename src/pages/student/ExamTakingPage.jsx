import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function ExamTakingPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Security
  const [warningCount, setWarningCount] = useState(0);

  // ==========================
  // LOAD EXAM
  // ==========================

  useEffect(() => {
    const loadExam = async () => {
      try {
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
        setTimeLeft((examRes.data.duration || 60) * 60);
      } catch (err) {
        console.log(err);
        alert("Unable to load exam.");
      }
    };

    loadExam();
  }, [examId, navigate]);

  // ==========================
  // AUTO FULL SCREEN
  // ==========================

  useEffect(() => {
    if (!instructionsAccepted) return;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log(err);
      }
    };

    enterFullscreen();
  }, [instructionsAccepted]);

  // ==========================
  // BLOCK COPY / PASTE
  // ==========================

  useEffect(() => {
    const block = (e) => {
      e.preventDefault();
      alert("This action is not allowed during the examination.");
    };

    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);

    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  // ==========================
  // BLOCK KEYBOARD SHORTCUTS
  // ==========================

  useEffect(() => {
    const handleKey = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl Keys
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();

        if (
          key === "c" ||
          key === "v" ||
          key === "x" ||
          key === "u" ||
          key === "s" ||
          key === "p" ||
          key === "a"
        ) {
          e.preventDefault();
        }

        // Ctrl+Shift+I/J/C
        if (
          e.shiftKey &&
          (key === "i" || key === "j" || key === "c")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // ==========================
  // TAB SWITCH DETECTION
  // ==========================

  useEffect(() => {
    let timeout;

    const visibilityHandler = () => {
      if (document.hidden) {
        timeout = setTimeout(() => {
          setWarningCount((prev) => prev + 1);
        }, 15000);
      } else {
        clearTimeout(timeout);
      }
    };

    document.addEventListener(
      "visibilitychange",
      visibilityHandler
    );

    return () => {
      clearTimeout(timeout);
      document.removeEventListener(
        "visibilitychange",
        visibilityHandler
      );
    };
  }, []);

  // ==========================
  // FULLSCREEN EXIT
  // ==========================

  useEffect(() => {
    const handleFullscreen = () => {
      if (
        instructionsAccepted &&
        !document.fullscreenElement
      ) {
        setWarningCount((prev) => prev + 1);

        alert(
          "Warning!\nPlease stay in Full Screen Mode."
        );

        document.documentElement.requestFullscreen();
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
    };
  }, [instructionsAccepted]);

  // ==========================
  // WARNING SYSTEM
  // ==========================

  useEffect(() => {
    if (warningCount === 0) return;

    if (warningCount < 3) {
      alert(
        `Warning ${warningCount}/3\n\nYou violated the examination rules.`
      );
    }

    if (warningCount >= 3) {
      alert(
        "Exam Finished!\nYou exceeded the maximum warning limit."
      );

      submitExam();
    }
  }, [warningCount]);

  // ==========================
  // CURRENT QUESTION
  // ==========================

  const question = questions[currentIndex];
const options = (() => {
  if (!question?.options) return [];

  if (Array.isArray(question.options)) {
    if (question.options.length > 1) {
      return question.options;
    }

    return question.options[0]
      .split(/(?=[A-D]\))/)
      .map((item) => item.replace(/^[A-D]\)\s*/, "").trim())
      .filter(Boolean);
  }

  return question.options
    .split(/(?=[A-D]\))/)
    .map((item) => item.replace(/^[A-D]\)\s*/, "").trim())
    .filter(Boolean);
})();
  // ==========================
  // PROGRESS
  // ==========================

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return Math.round(
      (Object.keys(answers).length / questions.length) * 100
    );
  }, [answers, questions]);
  // ==========================
// TIMER
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
// SUBMIT EXAM
// ==========================

const submitExam = async () => {
  try {
    // Exit Fullscreen
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    const payload = {
      exam: examId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question: questionId,
        answer,
      })),
      timeTaken: (exam?.duration || 0) * 60 - timeLeft,
    };

    await api.post("/exams/submit", payload);

    alert("Exam Submitted Successfully");

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
// LOADING PAGE
// ==========================

if (!exam) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white shadow-xl rounded-3xl p-10 text-center">

        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-slate-800">
          Loading Exam...
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait while we prepare your examination.
        </p>

      </div>

    </div>
  );
}

// ==========================
// INSTRUCTIONS PAGE
// ==========================

if (!instructionsAccepted) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          📋 Exam Instructions
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">

          <p className="text-lg text-gray-700 leading-8">
            {exam.instructions ||
              "Read all questions carefully before answering. Do not refresh the page. Copy, Paste, Right Click, Tab Switching and Full Screen Exit are prohibited."}
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-gray-100 rounded-2xl p-5">

            <p className="text-gray-500">
              Duration
            </p>

            <h2 className="text-3xl font-bold">
              {exam.duration} Minutes
            </h2>

          </div>

          <div className="bg-gray-100 rounded-2xl p-5">

            <p className="text-gray-500">
              Questions
            </p>

            <h2 className="text-3xl font-bold">
              {questions.length}
            </h2>

          </div>

        </div>

        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">

          <h3 className="font-bold text-red-700 mb-3">
            🚫 Examination Rules
          </h3>

          <ul className="space-y-2 text-gray-700">

            <li>✅ Full Screen is mandatory.</li>
            <li>❌ Copy / Paste / Cut are blocked.</li>
            <li>❌ Right Click is disabled.</li>
            <li>❌ Developer Tools are blocked.</li>
            <li>❌ Leaving the exam for more than 15 seconds gives one warning.</li>
            <li>⚠ Maximum 3 warnings.</li>
            <li>🚨 After 3 warnings your exam will be automatically submitted.</li>

          </ul>

        </div>

        <label className="flex items-center gap-3 mt-8 cursor-pointer">

          <input
            type="checkbox"
            checked={instructionsAccepted}
            onChange={() => setInstructionsAccepted(true)}
            className="w-5 h-5"
          />

          <span className="font-medium text-black">
            I have read and accepted all examination rules.
          </span>

        </label>

        <button
          onClick={async () => {
            try {
              if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
              }
            } catch (err) {
              console.log(err);
            }

            setInstructionsAccepted(true);
          }}
          className="w-full mt-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold transition"
        >
          🚀 Start Examination
        </button>

      </div>

    </div>
  );
}
// ==========================
// MAIN EXAM UI
// ==========================

return (
  <div className="min-h-screen bg-slate-100">

    {/* HEADER */}

    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-xl px-8 py-5 flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold">
          {exam.examName}
        </h1>

        <p className="text-blue-100 mt-1">
          Online Assessment System
        </p>

      </div>

      <div className="text-right">

        <h2 className="text-4xl font-bold">
          {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </h2>

        <p className="text-blue-100">
          Time Remaining
        </p>

      </div>

    </div>

    {/* BODY */}

    <div className="grid lg:grid-cols-4 gap-6 p-6">

      {/* LEFT PANEL */}

      <div className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-28">

        <h2 className="text-2xl font-bold mb-5">
          Questions
        </h2>

        <div className="grid grid-cols-5 gap-3">

         {options.map((option, index) => (

            <button
              key={q._id}
              onClick={() => setCurrentIndex(index)}
              className={`h-12 rounded-xl font-bold transition-all

              ${
                currentIndex === index
                  ? "bg-blue-600 text-white"
                  : answers[q._id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>

          ))}

        </div>

        {/* Progress */}

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span className="font-semibold">
              Progress
            </span>

            <span>
              {progress}%
            </span>

          </div>

          <div className="h-3 bg-gray-300 rounded-full overflow-hidden">

            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-6 bg-green-100 rounded-xl p-4">

          <h3 className="font-bold text-green-700">
            Answered
          </h3>

          <p className="text-3xl font-bold mt-2">
            {Object.keys(answers).length} / {questions.length}
          </p>

        </div>

        <button
          onClick={submitExam}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
        >
          Submit Exam
        </button>

      </div>

      {/* RIGHT PANEL */}

      <div className="lg:col-span-3">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Question Number */}

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-bold text-blue-700">

              Question {currentIndex + 1}

            </h2>

            <span className="text-gray-500">

              {questions.length} Questions

            </span>

          </div>

          {/* Progress */}

          <div className="mt-6 h-3 rounded-full bg-gray-200 overflow-hidden">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          {/* Question */}

          <div className="mt-10">

            <h3 className="text-3xl font-semibold leading-relaxed text-black">

              {question?.question}

            </h3>

          </div>
                    {/* OPTIONS */}

          <div className="mt-10 space-y-5">

            {question?.options?.map((option, index) => (

              <label
                key={index}
                className={`flex items-center gap-5 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300

                ${
                  answers[question._id] === option
                    ? "border-blue-600 bg-blue-50 shadow-lg"
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
                  className="w-6 h-6 accent-blue-600"
                />

                <div className="flex items-center gap-4">

                  <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                    {String.fromCharCode(65 + index)}

                  </span>

                  <span className="text-xl text-black">

                    {option}

                  </span>

                </div>

              </label>

            ))}

          </div>

          {/* NAVIGATION */}

          <div className="flex justify-between mt-12">

            <button
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex((prev) => Math.max(prev - 1, 0))
              }
              className="px-8 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-bold disabled:opacity-50"
            >
              ← Previous
            </button>

            {currentIndex === questions.length - 1 ? (

              <button
                onClick={submitExam}
                className="px-10 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                Finish & Submit
              </button>

            ) : (

              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  )
                }
                className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Next →
              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  </div>
);
}