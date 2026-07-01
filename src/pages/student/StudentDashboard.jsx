import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/exams"), api.get("/results/me")]).then(
      ([examsRes, resultsRes]) => {
        setExams(examsRes.data);
        setResults(resultsRes.data);
      }
    );
  }, []);

  const publishedExams = exams.filter(
    (exam) => exam.status === "published"
  );

  const passed = results.filter(
    (r) => r.status === "passed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-lg p-8 mb-8">

        <h1 className="text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="text-blue-100 mt-2">
          Welcome Back! Ready for your next exam.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-gray-500">
            Available Exams
          </h3>

          <h1 className="text-4xl font-bold text-blue-700 mt-2">
            {publishedExams.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-gray-500">
            Exams Completed
          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-2">
            {results.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-gray-500">
            Exams Passed
          </h3>

          <h1 className="text-4xl font-bold text-purple-600 mt-2">
            {passed}
          </h1>

        </div>

      </div>

      {/* Upcoming + Results */}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-bold text-blue-700 mb-4">
            📅 Upcoming Exams
          </h2>

          {publishedExams.slice(0, 5).map((exam) => (

            <div
              key={exam._id}
              className="border-b py-3"
            >

              <h4 className="font-semibold">
                {exam.examName}
              </h4>

              <p className="text-gray-500 text-sm">
                {exam.subject}
              </p>

            </div>

          ))}

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-bold text-blue-700 mb-4">
            🏆 Recent Results
          </h2>

          {results.length === 0 ? (

            <p className="text-gray-500">
              No Results Yet
            </p>

          ) : (

            results.slice(0, 5).map((result) => (

              <div
                key={result._id}
                className="border-b py-3 flex justify-between items-center"
              >

                <div>

                  <h4 className="font-semibold">
                    {result.exam?.examName}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {result.marks} Marks
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm

                  ${
                    result.status === "passed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }

                  `}
                >

                  {result.status}

                </span>

              </div>

            ))

          )}

        </div>

      </div>

      {/* Available Exams */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          📝 Available Exams
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {publishedExams.map((exam) => (

            <div
              key={exam._id}
              className="border rounded-xl p-5 hover:shadow-xl transition duration-300 bg-slate-50"
            >

              <h3 className="text-xl font-bold text-blue-700">
                {exam.examName}
              </h3>

              <p className="text-gray-500 mt-2">
                {exam.subject}
              </p>

              <p className="mt-2 text-sm">
                Duration :
                <span className="font-semibold">
                  {" "}
                  {exam.duration} Minutes
                </span>
              </p>

              <Link
                to={`/student/take/${exam._id}`}
                className="mt-5 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Start Exam →
              </Link>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}