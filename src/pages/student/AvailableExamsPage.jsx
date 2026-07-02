import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AvailableExamsPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api.get("/exams").then((res) => setExams(res.data));
  }, []);

  const publishedExams = exams.filter(
    (exam) => exam.status === "active"
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          📝 Available Exams
        </h1>
        <p className="text-gray-500 mt-2">
          Select an exam and start your assessment.
        </p>
      </div>

      {/* Exams */}
      {publishedExams.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-700">
            No Exams Available
          </h2>
          <p className="text-gray-500 mt-2">
            There are no published exams at the moment.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {publishedExams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className="flex items-center justify-between">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-3xl text-white">
                  📝
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Published
                </span>

              </div>

              <h2 className="text-2xl font-bold text-slate-800 mt-6">
                {exam.examName}
              </h2>

              <p className="text-gray-500 mt-2">
                {exam.subject}
              </p>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between text-gray-600">
                  <span>⏱ Duration</span>
                  <span className="font-semibold">
                    {exam.duration} mins
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>🏢 Department</span>
                  <span className="font-semibold">
                    {exam.department}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>🎓 Year</span>
                  <span className="font-semibold">
                    {exam.year}
                  </span>
                </div>

              </div>

              <Link
                to={`/student/take/${exam._id}`}
                className="mt-8 block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              >
                🚀 Start Exam
              </Link>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}